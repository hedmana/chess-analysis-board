import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChessBoard } from "../ChessBoard/ChessBoard";
import { analyzePosition, type TopMove } from "../../services/api";

import styles from "./Analysis.module.css";

export function Analysis() {
  const navigate = useNavigate();
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [evaluation, setEvaluation] = useState<number | null>(null);
  const [recommendedMoves, setRecommendedMoves] = useState<TopMove[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMainMenu = () => {
    navigate("/");
  };

  const handleMove = async (move: { from: string; to: string; fen: string }) => {
    setFen(move.fen);
    setLoading(true);
    setError(null);
    try {
      const result = await analyzePosition(move.fen);
      setEvaluation(result.evaluation.value / 100); // Convert centipawns to pawns (divide by 100)
      setRecommendedMoves(result.top_moves || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      console.error("Analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h1>Let's Analyze</h1>
        {error && <div style={{ color: "red", marginBottom: "12px" }}>{error}</div>}
        {loading && <div style={{ color: "gray", marginBottom: "12px" }}>Analyzing...</div>}
        <ChessBoard
          mode="analysis"
          fen={fen}
          onMove={handleMove}
          evaluation={evaluation}
          recommendedMoves={recommendedMoves}
        />
      </div>

      <button onClick={handleMainMenu}>Back to Main Menu</button>
    </div>
  );
}
