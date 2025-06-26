import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import DailyTracker from "./pages/DailyTracker";
import Weekly from "./pages/Weekly";
import "./App.css";

export default function App() {
  const linkBase =
    "px-1 transition-colors duration-150 hover:text-violet-400";
  const active = "border-b-2 border-violet-500 text-violet-400";

  return (
    <BrowserRouter>
      <nav className="flex gap-6 p-4 bg-neutral-900 shadow text-white rounded-t-xl">
        <NavLink
          to="/daily"
          className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}
        >
          Daily
        </NavLink>
        <NavLink
          to="/weekly"
          className={({ isActive }) => `${linkBase} ${isActive ? active : ""}`}
        >
          Weekly
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/daily" replace />} />
        <Route path="/daily" element={<DailyTracker />} />
        <Route path="/weekly" element={<Weekly />} />
      </Routes>
    </BrowserRouter>
  );
}
