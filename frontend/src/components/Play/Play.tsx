import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chess } from "chess.js";
import { ChessBoard } from "../ChessBoard/ChessBoard";
import { getBestMove, getAvailableEngines, selectEngine } from "../../services/api";

import styles from "./Play.module.css";

export function Play() {
  const navigate = useNavigate();
  const [fen, setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);
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

    const game = new Chess(move.fen);
    if (game.isGameOver()) {
      setGameOver(true);
      return;
    }

    setLoading(true);
    try {
      const result = await getBestMove(move.fen);
      
      const gameAfterEngine = new Chess(move.fen);
      const engineMove = gameAfterEngine.move(result.best_move, { strict: false });
      
      if (engineMove) {
        setFen(gameAfterEngine.fen());

        if (gameAfterEngine.isGameOver()) {
          setGameOver(true);
        }
      }
    } catch (err) {
      console.error("Engine error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Let's Play</h1>
      <div className={styles.mainContent}>
        <div className={styles.boardWrapper}>
          {gameOver && <div style={{ color: "green", marginBottom: "12px", fontWeight: "bold" }}>Game Over!</div>}
          <ChessBoard mode="play" fen={fen} onMove={handleMove} interactive={!loading && !gameOver} />
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
          <button onClick={handleMainMenu}>Back to Main Menu</button>
        </div>
      </div>
    </div>
  );
}

