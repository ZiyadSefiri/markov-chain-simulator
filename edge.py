import pygame
from math import exp
import numpy as np


class edge :
    width = 20

    def __init__(self ,sender , receiver , probability , colour ) :
        self.sender = sender
        self.receiver = receiver
        self._probability = probability
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
    
    def draw(self ,surface   ) :
        arrow_width = self.probability*self.width

        # code tu be used later to make an arc shape
        #inflexion_pt = (self.receiver.position + self.sender.position)/2
        #alpha = 1
        #for i in range (20) :
            #for pos in pos_list :
                #dis = (self.receiver.position - self.sender.position)/np.linalg.norm(self.receiver.position - self.sender.position)
                #force_dir = (inflexion_pt - pos) -  np.dot(inflexion_pt - pos , dis)* dis
                #inflexion_pt +=( force_dir/np.linalg.norm(dis))*exp(-np.linalg.norm(force_dir*alpha))
        
        pygame.draw.line(surface, self.colour, self.sender.position, self.receiver.position , int(arrow_width))




        

        

        

 

        

                




