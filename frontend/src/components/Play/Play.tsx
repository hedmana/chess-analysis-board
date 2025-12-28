import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chess } from "chess.js";
import { ChessBoard } from "../ChessBoard/ChessBoard";
import { getBestMove } from "../../services/api";

import styles from "./Play.module.css";

export function Play() {
  const navigate = useNavigate();
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const handleMainMenu = () => {
    navigate("/");
  };

  const handleMove = async (move: { from: string; to: string; fen: string }) => {
    // User made a move, update position
    setFen(move.fen);

    // Check if game is over
    const game = new Chess(move.fen);
    if (game.isGameOver()) {
      setGameOver(true);
      return;
    }

    // Get engine's response
    setLoading(true);
    setError(null);
    try {
      const result = await getBestMove(move.fen);
      
      // Apply engine's move
      const gameAfterEngine = new Chess(move.fen);
      const engineMove = gameAfterEngine.move(result.best_move, { strict: false });
      
      if (engineMove) {
        setFen(gameAfterEngine.fen());

        // Check if game is over after engine move
        if (gameAfterEngine.isGameOver()) {
          setGameOver(true);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Engine error");
      console.error("Engine error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h1>Let's Play</h1>
        {error && <div style={{ color: "red", marginBottom: "12px" }}>{error}</div>}
        {loading && <div style={{ color: "gray", marginBottom: "12px" }}>Engine thinking...</div>}
        {gameOver && <div style={{ color: "green", marginBottom: "12px", fontWeight: "bold" }}>Game Over!</div>}
        <ChessBoard mode="play" fen={fen} onMove={handleMove} interactive={!loading && !gameOver} />
      </div>

      <button onClick={handleMainMenu}>Back to Main Menu</button>
    </div>
  );
}
