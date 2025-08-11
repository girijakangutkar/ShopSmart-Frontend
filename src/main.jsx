import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AuthContext from "./context/AuthContext.jsx";
import ButtonContext from "./context/ButtonContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContext>
      <BrowserRouter>
        <ButtonContext>
          <App />
        </ButtonContext>
      </BrowserRouter>
    </AuthContext>
  </StrictMode>
);
