import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./css/globals.css";
import "./css/typography.css";

createRoot(document.getElementById("root")!).render(<App />);
