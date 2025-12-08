import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StartMenu } from "./components/StartMenu/StartMenu";
import { AnalysisBoard } from "./components/AnalysisBoard/AnalysisBoard";
import "./App.module.css";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<StartMenu />} />
          <Route path="/analysis" element={<AnalysisBoard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
