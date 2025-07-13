import pygame
import pygame_gui
import re
import numpy as np

from edge import edge
from node import node

pygame.init()

# Set up display
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Markov Chain")

clock = pygame.time.Clock()

# State variables
input_context     = None  
nodes_list        = []
edges_list        = []
input_box         = None
pending_node      = None
pending_edge      = None
pending_pos       = None
sender_vertex     = None
receiver_vertex   = None
simulation        = False
distribution      = None  # will hold the current probability vector
frame_counter = 0

# Start with an empty transition matrix (0×0)
transition_matrix = np.empty((0, 0))

manager = pygame_gui.UIManager((WIDTH, HEIGHT))

button = pygame_gui.elements.UIButton(
    relative_rect=pygame.Rect((320, 10), (80, 40)),
    text='Start',
    manager=manager,
    object_id="#my_button"
)

running = True
while running:
    time_delta = clock.tick(60) / 1000.0
    screen.fill((30, 30, 30))

    # ─── Event Loop ─────────────────────────────────────────────────────────────
    for event in pygame.event.get():
        # Always give pygame_gui a chance to process the event first
        manager.process_events(event)

        # 1) Quit
        if event.type == pygame.QUIT:
            running = False

        # 2) Left‐click: either pick a sender‐node or create a new node
        if (
            event.type == pygame.MOUSEBUTTONDOWN
            and event.button == 1
            and input_box is None
            and sender_vertex is None
            and not simulation
        ):
            click_pos = event.pos
            # If clicked on an existing node, select it as sender
            for vertex in nodes_list:
                if vertex.is_clicked(click_pos):
                    sender_vertex = vertex
                    break
            else:
                # Otherwise: prepare to create a new node
                pending_pos = click_pos
                pending_node = node.default(0.0, pending_pos)
                input_box = pygame_gui.elements.UITextEntryLine(
                    relative_rect=pygame.Rect((pending_pos[0], pending_pos[1], 100, 30)),
                    manager=manager
                )
                input_context = "node"

        # 3) Left‐click with a sender already chosen: pick a receiver and add an edge
        if (
            event.type == pygame.MOUSEBUTTONDOWN
            and event.button == 1
            and sender_vertex is not None
            and input_box is None
            and not simulation
        ):
            click_pos = event.pos
            for vertex in nodes_list:
                if vertex.is_clicked(click_pos) and vertex != sender_vertex:
                    receiver_vertex = vertex
                    # Place the input box at the midpoint of sender↔receiver
                    midpoint = (
                        (receiver_vertex.position[0] + sender_vertex.position[0]) / 2,
                        (receiver_vertex.position[1] + sender_vertex.position[1]) / 2
                    )
                    input_box = pygame_gui.elements.UITextEntryLine(
                        relative_rect=pygame.Rect((midpoint[0], midpoint[1], 100, 30)),
                        manager=manager
                    )
                    # Create a “pending” edge (weight = 0 for now)
                    pending_edge = edge(sender_vertex, receiver_vertex, 0.0, (255, 255, 255))
                    input_context = "edge"
                    break

        # 4) As the user types into the UITextEntryLine, filter out non‐float characters
        if (
            input_box is not None
            and event.type == pygame_gui.UI_TEXT_ENTRY_CHANGED
            and event.ui_element == input_box
        ):
            text = input_box.get_text()
            # Allow only digits, one decimal point, and optional leading '-'
            if not re.fullmatch(r'-?\d*\.?\d*', text):
                filtered = ''.join(c for c in text if c in '0123456789.-')
                if filtered.count('.') > 1:
                    parts = filtered.split('.', 1)
                    filtered = parts[0] + '.' + parts[1].replace('.', '')
                if filtered.count('-') > 1 or (filtered.count('-') == 1 and not filtered.startswith('-')):
                    filtered = filtered.replace('-', '')
                input_box.set_text(filtered)

        # 5) Handle Enter‐key when typing into the input box
        if event.type == pygame.KEYDOWN and event.key == pygame.K_RETURN and input_box is not None:
            text = input_box.get_text()
            try:
                value = float(text)

                if input_context == "node" and pending_node is not None:
                    # ─── Adding a new node with probability = value ───────────────
                    pending_node.probability = value

                    # Expand transition_matrix by one column of zeros
                    #   Old shape: (N × N)
                    #   After hstack: (N × (N+1))
                    transition_matrix = np.hstack((
                        transition_matrix,
                        np.zeros((len(nodes_list), 1))
                    ))

                    # Add the new node to the list
                    nodes_list.append(pending_node)

                    # Create a self‐loop with weight = 1 for the new node
                    self_edge = edge(pending_node, pending_node, 1.0, (0, 0, 0))
                    pending_node.edges.append(self_edge)
                    # (If you want to draw self‐edges, you might also do edges_list.append(self_edge))

                    # Now expand transition_matrix by one row
                    #   New size: ((N+1) × (N+1)). The new row is all zeros except a 1 on the diagonal
                    new_row = np.zeros((1, len(nodes_list)))
                    new_row[0, -1] = 1.0
                    transition_matrix = np.vstack((transition_matrix, new_row))

                    # Clear pending
                    pending_node = None

                elif input_context == "edge" and pending_edge is not None:
                    # ─── Adding a new edge with the typed probability ───────────────
                    pending_edge.probability = value

                    # Adjust the sender’s self‐edge (assume it’s at index 0)
                    if len(sender_vertex.edges) > 0:
                        sender_vertex.edges[0].probability -= value

                    # Find indices of sender and receiver in nodes_list
                    sender_index = None
                    receiver_index = None
                    for i, vertex in enumerate(nodes_list):
                        if vertex is sender_vertex:
                            sender_index = i
                        if vertex is receiver_vertex:
                            receiver_index = i

                    # Subtract value from sender’s diagonal entry
                    if sender_index is not None:
                        transition_matrix[sender_index, sender_index] -= value
                    # Add value to the off‐diagonal (sender→receiver)
                    if sender_index is not None and receiver_index is not None:
                        transition_matrix[sender_index, receiver_index] = value

                    # Finally, record the new edge in each object
                    sender_vertex.edges.append(pending_edge)
                    edges_list.append(pending_edge)
                    pending_edge = None

                # After processing a node or edge, always reset sender
                sender_vertex = None

            except ValueError:
                # If the user typed something that couldn’t cast to float, ignore
                pass

            # Destroy the UI text box
            input_box.kill()
            input_box = None
            input_context = None

        # 6) “Start” button pressed → initialize distribution and flip flag
        if event.type == pygame_gui.UI_BUTTON_PRESSED:
            if event.ui_element == button:
                if len(nodes_list) > 0:
                    print("Simulation Started")
                    prob_sum = 0
                    for v in nodes_list :
                        prob_sum+= v.probability 
                    distribution = np.array([v.probability/prob_sum for v in nodes_list], dtype=float)
                    
                    simulation = True

    # ─── After processing all events, do one simulation update (if running) ─────

    if simulation and distribution is not None and len(nodes_list) > 0 :
        # One time‐step of Markov update
        if frame_counter > 25 :
            distribution = distribution @ transition_matrix
            # Write back into each node’s probability
            for i, vertex in enumerate(nodes_list):
                vertex.probability = distribution[i]
            frame_counter = 0
        else :
            frame_counter+=1

    # ─── Draw everything ────────────────────────────────────────────────────────
    manager.update(time_delta)
    manager.draw_ui(screen)

    for vertex in nodes_list:
        vertex.draw(screen)
    for edge_obj in edges_list:
        edge_obj.draw(screen)

    pygame.display.flip()

pygame.quit()
