import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <NextUIProvider>
        <main className="dark font-mono bg-gradient-to-tr from-custom-dark to bg-custom-dark-accent min-h-screen">
          <App />
        </main>
      </NextUIProvider>
    </Router>
  </React.StrictMode>
);
