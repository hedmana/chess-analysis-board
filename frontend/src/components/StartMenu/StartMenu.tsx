import { useNavigate } from "react-router-dom";
import styles from "./StartMenu.module.css";

export function StartMenu() {
  const navigate = useNavigate();

  const handleNavigationClick = (target: string) => () => {
    if (target === "analysis") {
      navigate("/analysis");
    } else if (target === "play") {
      navigate("/play");
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h1>Chess Analysis Board</h1>
      </div>

      <button onClick={handleNavigationClick("analysis")}>New Analysis</button>
      <button onClick={handleNavigationClick("play")}>Play Chess</button>
    </div>
  );
}
