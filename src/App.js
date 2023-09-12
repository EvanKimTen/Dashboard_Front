import { Routes, Route } from "react-router-dom";
import { useState } from 'react';
import "./App.css";

import Analytics from "./pages/Analytics";
import KnowledgeBase from "./pages/KnowledgeBase";
import SidebarComp from "./components/SidebarComp";

import { CssBaseline } from "@mui/material";


const App = () => {

  return (
    <>
    <CssBaseline />
    <div className="App">
      <SidebarComp />
      <main className="content whole">
        <Routes>
          {/*public routes*/}
          <Route path="/" element={<Analytics />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />

          {/*protected routes*/}
        </Routes>
      </main>
    </div>
    </>
  );
};

export default App;
