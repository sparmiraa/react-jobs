import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";

import "./styles/variables.scss"
import "./styles/normalize.scss"
import "./styles/global.scss"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
