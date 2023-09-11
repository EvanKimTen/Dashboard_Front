import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Analytics from "./pages/Analytics";
import KnowledgeBase from "./pages/KnowledgeBase";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/*public routes*/}
          <Route path="/" element={<Analytics />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />

          {/*protected routes*/}
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
