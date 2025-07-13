import pygame

class node :

    size = 100 # maybe this should be a class variable # nvm it is

    def __init__(self , probability , position ,neighbours , edges , colour ) :
        self._probability = probability
        self.neighbours = neighbours
        self.edges = edges #out going edges must sum to 1
        self.position = position
        self.colour = colour
    
    @property
    def probability(self) :
        return self._probability
    
    @probability.setter
    def probability(self,value) :
        if value < 0 or value > 1 :
            raise ValueError ("Invalid Probability Value")
        else :
            self._probability = value
    
    @classmethod
    def default (cls , probability , position ) :
        return cls(probability ,position , [] , [] , (255,100,255))
    
    

    def draw(self , surface) :
        circle_size = self.size* self.probability
        pygame.draw.circle(surface, self.colour, self.position, circle_size)
   

    def is_clicked(self, pos):
        dx = pos[0] - self.position[0]
        dy = pos[1] - self.position[1]
        distance = (dx**2 + dy**2)**0.5
        return distance <= (self.probability *self.size)







        







