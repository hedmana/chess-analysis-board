from stockfish import Stockfish
from .base import Engine


class StockfishEngine(Engine):
    def __init__(self):
        self.engine = Stockfish(depth=20)  # TODO: make depth configurable

    def get_best_move(self, fen: str) -> str:
        self.engine.set_fen_position(fen)
        return self.engine.get_best_move()

    def analyze_position(self, fen: str):
        self.engine.set_fen_position(fen)
        evaluation = self.engine.get_evaluation()
        best_move = self.engine.get_best_move()

        top_moves = []
        if best_move:
            # Parse the move string (e.g., "e2e4" -> from: "e2", to: "e4")
            from_square = best_move[:2]
            to_square = best_move[2:4]
            top_moves.append(
                {
                    "from": from_square,
                    "to": to_square,
                    "notation": best_move,
                }
            )

        return {
            "evaluation": evaluation,
            "best_move": best_move,
            "top_moves": top_moves,
        }