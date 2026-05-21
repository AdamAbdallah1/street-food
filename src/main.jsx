import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from "react-hot-toast";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: "#111",
          color: "#fff",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.08)",
        },
      }}
    />
    <App />
  </StrictMode>,
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/demo/street-food/sw.js")
      .then(() => {
        console.log("SW registered");
      })
      .catch((err) => {
        console.log("SW failed", err);
      });
  });
}