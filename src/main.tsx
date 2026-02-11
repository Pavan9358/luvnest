import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register Service Worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => { })
      .catch((err) => console.error("SW registration failed:", err));
  });
}

console.log("App starting...");
console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("ENV DEBUG:", {
  MODE: import.meta.env.MODE,
  RAZORPAY_KEY: import.meta.env.VITE_RAZORPAY_KEY_ID ? "Present" : "Missing",
  FULL_ENV: import.meta.env
});

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  createRoot(rootElement).render(<App />);
  console.log("App mounted");
} catch (error) {
  console.error("Failed to mount app:", error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">
    <h1>App Crashed</h1>
    <pre>${error instanceof Error ? error.message : String(error)}</pre>
  </div>`;
}

