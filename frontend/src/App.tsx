import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StartMenu } from "./components/StartMenu/StartMenu";
import { Analysis } from "./components/Analysis/Analysis";
import { Play } from "./components/Play/Play";
import { checkHealth } from "./services/api";
import styles from "./App.module.css";

function App() {
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);
  const [showHealthMessage, setShowHealthMessage] = useState(false);
  const [hasEverBeenHealthy, setHasEverBeenHealthy] = useState(false);

  useEffect(() => {
    const checkBackendHealth = async () => {
      const isHealthy = await checkHealth();
      setBackendHealthy(isHealthy);

      if (isHealthy) {
        setHasEverBeenHealthy(true);
      }

      if (!hasEverBeenHealthy || (backendHealthy !== null && backendHealthy !== isHealthy)) {
        setShowHealthMessage(true);

        if (isHealthy) {
          const dismissTimer = setTimeout(() => {
            setShowHealthMessage(false);
          }, 3000);
          return () => clearTimeout(dismissTimer);
        }
      }
    };

    const healthCheckInterval = setInterval(checkBackendHealth, 20000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkBackendHealth();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(healthCheckInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [backendHealthy, hasEverBeenHealthy]);

  return (
    <>
      {backendHealthy === false && (
        <div className={`${styles.healthWarning} ${styles.error}`}>
          Backend is not running
        </div>
      )}
      {showHealthMessage && backendHealthy === true && (
        <div className={`${styles.healthWarning} ${styles.success}`}>
          Backend connected
        </div>
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartMenu />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/play" element={<Play />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
