from abc import ABC, abstractmethod

class Engine(ABC):
    @abstractmethod
    def get_best_move(self, fen: str) -> str:
        pass
    
    @abstractmethod
    def analyze_position(self, fen: str) -> dict:
        pass
