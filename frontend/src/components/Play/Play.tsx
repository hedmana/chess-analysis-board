import { useNavigate } from "react-router-dom";
import { ChessBoard } from "../ChessBoard/ChessBoard";

import styles from "./Play.module.css";

export function Play() {
  const navigate = useNavigate();

  const handleMainMenu = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div>
        <h1>Let's Play</h1>
        <ChessBoard />
      </div>

      <button onClick={handleMainMenu}>Back to Main Menu</button>
    </div>
  );
}
