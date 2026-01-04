from chess import Board
from .base import Engine


class MinimaxEngine(Engine):
    """
    A simple chess engine using the Minimax algorithm with alpha-beta pruning.
    Efficient enough for deployment and suitable for training.
    """

    def __init__(self, depth: int = 4):
        """
        Initialize the minimax engine.
        
        Args:
            depth: Search depth for the minimax algorithm (default: 4)
                   Higher depth = stronger but slower
                   depth=3-4 is recommended for reasonable performance
        """
        self.depth = depth
        self.transposition_table = {}

    def get_best_move(self, fen: str) -> str:
        """Get the best move for the given position."""
        board = Board(fen)
        
        if not board.legal_moves:
            return None
        
        best_move = None
        is_white = board.turn  # Save the original turn
        best_score = float('-inf') if is_white else float('inf')
        
        for move in board.legal_moves:
            board.push(move)
            score = self._minimax(
                board, 
                self.depth - 1, 
                float('-inf'), 
                float('inf'), 
                not is_white  # Now it's the opponent's turn
            )
            board.pop()
            
            if is_white and score > best_score:
                best_score = score
                best_move = move
            elif not is_white and score < best_score:
                best_score = score
                best_move = move
        
        return best_move.uci() if best_move else None

    def analyze_position(self, fen: str) -> dict:
        """Analyze a position and return evaluation and top moves."""
        board = Board(fen)
        
        # Get the best move
        best_move = self.get_best_move(fen)
        
        # Evaluate the position
        evaluation = self._evaluate_position(board)
        
        top_moves = []
        if best_move:
            top_moves.append({
                "from": best_move[:2],
                "to": best_move[2:4],
                "notation": best_move,
            })
        
        return {
            "evaluation": {
                "type": "cp",
                "value": int(evaluation * 100),  # Convert to centipawns
            },
            "best_move": best_move,
            "top_moves": top_moves,
        }

    def _minimax(
        self, 
        board: Board, 
        depth: int, 
        alpha: float, 
        beta: float, 
        is_maximizing: bool
    ) -> float:
        """
        Minimax algorithm with alpha-beta pruning.
        
        Args:
            board: Current board state
            depth: Remaining search depth
            alpha: Alpha value for pruning
            beta: Beta value for pruning
            is_maximizing: Whether we're maximizing (True) or minimizing (False)
        
        Returns:
            Evaluation score of the position
        """
        # Check transposition table
        fen = board.fen()
        if fen in self.transposition_table:
            stored_depth, stored_score = self.transposition_table[fen]
            if stored_depth >= depth:
                return stored_score
        
        # Terminal node: checkmate, stalemate, or max depth reached
        if depth == 0:
            score = self._evaluate_position(board)
            self.transposition_table[fen] = (depth, score)
            return score
        
        if board.is_checkmate():
            # Checkmate is worst for maximizing player, best for minimizing
            score = float('-inf') if is_maximizing else float('inf')
            self.transposition_table[fen] = (depth, score)
            return score
        
        if board.is_stalemate() or board.is_insufficient_material():
            self.transposition_table[fen] = (depth, 0)
            return 0
        
        if is_maximizing:
            max_eval = float('-inf')
            for move in board.legal_moves:
                board.push(move)
                eval_score = self._minimax(board, depth - 1, alpha, beta, False)
                board.pop()
                
                max_eval = max(max_eval, eval_score)
                alpha = max(alpha, eval_score)
                
                if beta <= alpha:
                    break  # Beta cutoff
            
            self.transposition_table[fen] = (depth, max_eval)
            return max_eval
        else:
            min_eval = float('inf')
            for move in board.legal_moves:
                board.push(move)
                eval_score = self._minimax(board, depth - 1, alpha, beta, True)
                board.pop()
                
                min_eval = min(min_eval, eval_score)
                beta = min(beta, eval_score)
                
                if beta <= alpha:
                    break  # Alpha cutoff
            
            self.transposition_table[fen] = (depth, min_eval)
            return min_eval

    def _evaluate_position(self, board: Board) -> float:
        """
        Evaluate a chess position.
        Returns a score: positive = good for white, negative = good for black.
        """
        # Material values (in pawns)
        material_values = {
            1: 1.0,    # Pawn
            2: 3.0,    # Knight
            3: 3.2,    # Bishop
            4: 5.0,    # Rook
            5: 9.0,    # Queen
            6: 0.0,    # King (handled separately)
        }
        
        score = 0.0
        
        # Calculate material balance
        for square in range(64):
            piece = board.piece_at(square)
            if piece is None:
                continue
            
            piece_value = material_values.get(piece.piece_type, 0)
            
            # Add or subtract based on color
            if piece.color:  # White
                score += piece_value
            else:  # Black
                score -= piece_value
        
        # Positional bonuses
        score += self._position_bonus(board)
        
        return score

    def _position_bonus(self, board: Board) -> float:
        """
        Calculate positional bonuses/penalties.
        Simple factors: piece activity, king safety, pawn structure.
        """
        bonus = 0.0
        
        # Encourage piece development and center control
        for square in range(64):
            piece = board.piece_at(square)
            if piece is None:
                continue
            
            # Center control bonus (especially for knights and bishops)
            if piece.piece_type in [2, 3]:  # Knight or Bishop
                if square in [19, 20, 27, 28, 35, 36, 43, 44]:  # Central squares
                    bonus += 0.2 if piece.color else -0.2
            
            # Pawn advancement bonus
            if piece.piece_type == 1:  # Pawn
                rank = 7 - (square // 8) if piece.color else (square // 8)
                if rank > 2:  # Advanced pawns
                    bonus += 0.1 if piece.color else -0.1
        
        # Mobility bonus (simple: count number of legal moves)
        legal_moves_count = len(list(board.legal_moves))
        bonus += 0.01 * legal_moves_count
        
        return bonus
