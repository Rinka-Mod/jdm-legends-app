/**
 * ==========================================================================
 * JDM LEGENDS — Ứng dụng Web (Front-End)
 * Thư viện số về xe thể thao Nhật Bản.
 *
 * Tác giả / Author : Rinka-Mod
 * © 2026 Rinka-Mod. All rights reserved.
 *
 * ĐIỀU KIỆN TÁI SỬ DỤNG:
 * Nếu bạn dùng lại toàn bộ hoặc phần lớn dự án này, BẮT BUỘC phải ghi rõ tên
 * tác giả "Rinka-Mod" ở cuối trang (footer) và trong mã nguồn. Không được xoá
 * hoặc thay thế thông tin tác giả.
 * ==========================================================================
 */

import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import { Sidebar } from "./components/Sidebar";
import { SiteHeader } from "./components/SiteHeader";
import { Topbar } from "./components/Topbar";
import { MobileBar } from "./components/MobileBar";
import { Footer } from "./components/Footer";
import { SocialSprite } from "./components/SocialIcons";
import { ChatAssistant } from "./components/ChatAssistant";
import { CustomCursor, Grain, ScrollProgress, ToTop } from "./components/Chrome";
import { NotFound } from "./components/NotFound";

import { HomePage } from "./pages/HomePage";
import { CarPage } from "./pages/CarPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { MyGaragePage } from "./pages/MyGaragePage";

import { AuthProvider } from "./lib/auth";
import { ToastProvider } from "./lib/toast";
import { UiProvider, useUi } from "./lib/ui";
import { useActiveSection } from "./lib/hooks";
import { SECTIONS } from "./data/shapes";
import type { Car } from "./types";

const SECTION_IDS = SECTIONS.map((s) => s.id);

function Layout() {
  const active = useActiveSection(SECTION_IDS);
  const [stuck, setStuck] = useState(false);
  const [carCount, setCarCount] = useState(12);
  const { focusSearch } = useUi();
  const navigate = useNavigate();

  /* Header dính khi cuộn */
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jumpToSearch = useCallback(() => {
    if (focusSearch()) return;
    navigate("/");
    // Thư viện được mount sau khi điều hướng, chờ một nhịp rồi focus
    window.setTimeout(() => focusSearch(), 450);
  }, [focusSearch, navigate]);

  /* Phím tắt "/" — chỉ trên PC, chỉ khi không gõ trong ô nhập liệu */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key !== "/" && e.code !== "Slash") return;
      if (window.innerWidth < 1024) return;
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (document.querySelector(".modal.is-open")) return;
      e.preventDefault();
      jumpToSearch();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [jumpToSearch]);

  const handleCarsLoaded = useCallback((cars: Car[]) => setCarCount(cars.length), []);

  return (
    <>
      <SocialSprite />
      <Grain />
      <CustomCursor />
      <ScrollProgress />

      <Sidebar active={active} />
      <SiteHeader active={active} stuck={stuck} />
      <Topbar active={active} count={carCount} onSearchJump={jumpToSearch} />

      <Routes>
        <Route path="/" element={<HomePage onCarsLoaded={handleCarsLoaded} />} />
        <Route path="/car/:id" element={<CarPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/garage" element={<MyGaragePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
      <MobileBar active={active} />
      <ChatAssistant />
      <ToTop />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <UiProvider>
        <ToastProvider>
          <Layout />
        </ToastProvider>
      </UiProvider>
    </AuthProvider>
  );
}
