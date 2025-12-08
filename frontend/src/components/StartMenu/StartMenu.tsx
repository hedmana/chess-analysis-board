import { useNavigate } from "react-router-dom";
import styles from "./StartMenu.module.css";

export function StartMenu() {
  const navigate = useNavigate();

  const handleNewAnalysis = () => {
    navigate("/analysis");
  };

  return (
    <div className={styles.container}>
      <div>
        <h1>Chess Analysis Board</h1>
      </div>

      <button onClick={handleNewAnalysis}>New Analysis</button>
    </div>
  );
}
