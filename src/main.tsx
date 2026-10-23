import React from "react";
import ReactDOM from "react-dom/client";
import { PwaApp } from "./components/PwaApp";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Elemento raiz '#root' não encontrado no DOM.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <PwaApp />
  </React.StrictMode>
);
