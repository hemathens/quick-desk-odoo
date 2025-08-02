import React from "react";
import "./App.css";
import "./styles/QuickDeskLanding.css";
import "./styles/AppDashboard.css";
import "./styles/Registration.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuickDeskLanding from "./components/QuickDeskLanding";
import AppDashboard from "./components/AppDashboard";
import Registration from "./components/Registration";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<QuickDeskLanding />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/app" element={<AppDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;