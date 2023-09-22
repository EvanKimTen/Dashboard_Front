import { Routes, Route } from "react-router-dom";

import SidebarComp from "../components/SidebarComp";
import Analytics from "./Analytics";
import KnowledgeBase from "./KnowledgeBase";
import Transcript from "./Transcript";

const Dashboard = () => {
  return (
    <>
      <SidebarComp />
      <main className="content whole">
        <Routes>
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/transcript" element={<Transcript />} />
        </Routes>
      </main>
    </>
  );
};

export default Dashboard;
