import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChessBoard } from "../ChessBoard/ChessBoard";
import { analyzePosition, getAvailableEngines, selectEngine, type TopMove } from "../../services/api";

import styles from "./Analysis.module.css";

export function Analysis() {
  const navigate = useNavigate();
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [evaluation, setEvaluation] = useState<number | null>(null);
  const [recommendedMoves, setRecommendedMoves] = useState<TopMove[]>([]);
  const [availableEngines, setAvailableEngines] = useState<string[]>([]);
  const [currentEngine, setCurrentEngine] = useState<string>("");
  const [enginesLoading, setEnginesLoading] = useState(true);

  useEffect(() => {
    const loadEngines = async () => {
      try {
        const engines = await getAvailableEngines();
        setAvailableEngines(engines.available_engines);
        setCurrentEngine(engines.current_engine);
      } catch (err) {
        console.error("Failed to load engines:", err);
      } finally {
        setEnginesLoading(false);
      }
    };

    loadEngines();
  }, []);

  const handleMainMenu = () => {
    navigate("/");
  };

  const handleEngineChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEngine = e.target.value;
    try {
      await selectEngine(newEngine);
      setCurrentEngine(newEngine);
    } catch (err) {
      console.error("Failed to select engine:", err);
      // Reset to previous engine on error
      setCurrentEngine(currentEngine);
    }
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

  const handleResetBoard = () => {
    const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    setFen(initialFen);
    setEvaluation(null);
    setRecommendedMoves([]);
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
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="engine-select" style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Select Engine:
            </label>
            <select
              id="engine-select"
              value={currentEngine}
              onChange={handleEngineChange}
              disabled={enginesLoading}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontSize: "14px",
                cursor: enginesLoading ? "not-allowed" : "pointer",
              }}
            >
              {enginesLoading ? (
                <option>Loading engines...</option>
              ) : (
                availableEngines.map((engine) => (
                  <option key={engine} value={engine}>
                    {engine.charAt(0).toUpperCase() + engine.slice(1)}
                  </option>
                ))
              )}
            </select>
          </div>
          <button onClick={handleResetBoard} style={{ marginBottom: "8px" }}>
            Reset Board
          </button>
          <button onClick={handleMainMenu}>Back to Main Menu</button>
        </div>
      </div>
    </div>
  );
}
