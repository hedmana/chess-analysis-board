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


  const handleMainMenu = () => {
    navigate("/");
  };

  const handleMove = async (move: { from: string; to: string; fen: string }) => {
    setFen(move.fen);
    try {
      const result = await analyzePosition(move.fen);
      setEvaluation(result.evaluation.value / 100); // Convert centipawns to pawns (divide by 100)
      setRecommendedMoves(result.top_moves || []);
    } catch (err) {
      console.error("Analysis error:", err);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Let's Analyze</h1>
      <div className={styles.mainContent}>
        <div className={styles.boardWrapper}>
          <ChessBoard
            mode="analysis"
            fen={fen}
            onMove={handleMove}
            evaluation={evaluation}
            recommendedMoves={recommendedMoves}
          />
        </div>
        <div className={styles.sidebar}>
          <button onClick={handleMainMenu}>Back to Main Menu</button>
        </div>
      </div>
    </div>
  );
}
