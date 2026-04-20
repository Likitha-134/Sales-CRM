import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

// styles
import "./styles/variables.css";
import "./styles/layout.css";
import "./styles/Sidebar.css";
import "./styles/topbar.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);