import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import About from "./pages/About.jsx";
import Apply from "./pages/Apply.jsx";
import Maintenance from "./pages/Maintenance.jsx";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/maintenance" element={<Maintenance />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);