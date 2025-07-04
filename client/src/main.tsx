import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

document.title = "CPU Pipeline Simulator - Educational Tool";

createRoot(document.getElementById("root")!).render(<App />);
