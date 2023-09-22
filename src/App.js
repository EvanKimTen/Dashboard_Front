import { Routes, Route } from "react-router-dom";

import { CssBaseline } from "@mui/material";
import "./App.css";

import Login from "./pages/Login";
import Join from "./pages/Join";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <>
      <CssBaseline />
      <div className="App">
        <Routes>
          {/*public routes*/}
          <Route path="/*" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
          <Route path="/join" element={<Join />} />
          {/*protected routes*/}
        </Routes>
      </div>
    </>
  );
};

export default App;
