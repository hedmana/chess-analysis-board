import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StartMenu } from "./components/StartMenu/StartMenu";
import { Analysis } from "./components/Analysis/Analysis";
import { Play } from "./components/Play/Play";
import { checkHealth } from "./services/api";
import "./App.module.css";

function App() {
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    const checkBackendHealth = async () => {
      const isHealthy = await checkHealth();
      setBackendHealthy(isHealthy);
    };

    checkBackendHealth();

    const healthCheckInterval = setInterval(checkBackendHealth, 20000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab became active, check health immediately
        checkBackendHealth();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(healthCheckInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <div>
        {backendHealthy === false && (
          <div
            style={{
              backgroundColor: "#fee",
              color: "#c00",
              padding: "12px",
              textAlign: "center",
              borderBottom: "1px solid #c00",
            }}
          >
            Backend is not running. Make sure to start the server with{" "}
            <code>uv run uvicorn main:app --reload</code>
          </div>
        )}
        {backendHealthy === true && (
          <div
            style={{
              backgroundColor: "#efe",
              color: "#060",
              padding: "8px",
              textAlign: "center",
              fontSize: "12px",
              borderBottom: "1px solid #060",
            }}
          >
            Backend connected
          </div>
        )}
        <Routes>
          <Route path="/" element={<StartMenu />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/play" element={<Play />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
