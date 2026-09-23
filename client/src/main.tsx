/**
 * JDM LEGENDS — Điểm khởi động React.
 * Tác giả gốc / Original author: Rinka-Mod — © 2026. All rights reserved.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
// Lớp giao diện mobile làm mới — nạp SAU index.css để đè được bản gốc
import "./styles/mobile.css";

const container = document.getElementById("root");
if (!container) throw new Error("Không tìm thấy #root trong index.html");

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
