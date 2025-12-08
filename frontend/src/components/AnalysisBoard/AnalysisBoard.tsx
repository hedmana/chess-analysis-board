import { useNavigate } from "react-router-dom";
import styles from "./AnalysisBoard.module.css";

export function AnalysisBoard() {
  const navigate = useNavigate();

  const handleMainMenu = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div>
        <h1>Let's Analyze</h1>
      </div>

      <button onClick={handleMainMenu}>Back to Main Menu</button>
    </div>
  );
}