import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StartMenu } from "./components/StartMenu/StartMenu";
import { Analysis } from "./components/Analysis/Analysis";
import { Play } from "./components/Play/Play";
import "./App.module.css";

function App() {
  return (
    <BrowserRouter>
      <div>
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
