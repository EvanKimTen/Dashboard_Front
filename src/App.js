import { Routes, Route } from "react-router-dom";
import SidebarComp from "./components/SidebarComp";
import { CssBaseline } from "@mui/material";
import "./App.css";

import Analytics from "./pages/Analytics";
import KnowledgeBase from "./pages/KnowledgeBase";
import Transcript from "./pages/Transcript";
import Login from "./components/Login";
import Join from "./components/Join";

const App = () => {
  return (
    <>
    <CssBaseline />
    <div className="App">
      <SidebarComp />
      <main className="content whole">
        <Routes>
          {/*public routes*/}
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/transcript" element={<Transcript />} />
          <Route path="/" element={<Login />} />
          <Route path="/join" element={<Join />} />
          {/*protected routes*/}
        </Routes>
      </main>
    </div>
    </>
  );
};

export default App;

