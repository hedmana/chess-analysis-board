from stockfish import Stockfish
from .base import Engine

class StockfishEngine(Engine):
    def __init__(self):
        self.engine = Stockfish(depth=20) # TODO: make depth configurable

    def get_best_move(self, fen: str) -> str:
        self.engine.set_fen_position(fen)
        return self.engine.get_best_move()
    
    def analyze_position(self, fen):
        self.engine.set_fen_position(fen)
        return {
            "evaluation": self.engine.get_evaluation(),
            "best_move": self.engine.get_best_move(),
        }
 