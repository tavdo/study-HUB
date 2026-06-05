import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "../comp/nav/Navigation";
import Setting from "../pages/Setting/Settings";
import Notes from "../pages/notes/Notes";
import Dashboard from "../pages/Dashboard/Dashboard";
import AI from "../pages/AI/AI";
import Library from "../pages/Libery/Library";
import Group from "../pages/Group/Groups";
import User from "../pages/users/user";
import Quiz from "../pages/Quiz/Quiz";
import Flashcards from "../pages/Flashcards/Flashcards";
import AdminPanel from "../pages/Admin/AdminPanel";
import Landing from "../components/landing";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import StudyTimer from "./StudyTimer";
import SyncBadge from "./SyncBadge";
import Omnibar from "./Omnibar";
import ThemeEffect from "./ThemeEffect";
import { StudyHubProvider } from "../context/StudyHubContext";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n";

function AppShell({ children, showSidebar }) {
  const { t } = useI18n();

  return (
    <div className="flex h-screen overflow-hidden bg-study-bg relative">
      <ThemeEffect />
      <Omnibar />
      <div className="animated-bg pointer-events-none" aria-hidden="true">
        <div className="animated-bg__grid" />
        <div className="animated-bg__stripes" />
        <div className="animated-bg__blob animated-bg__blob--one" />
        <div className="animated-bg__blob animated-bg__blob--two" />
        <div className="animated-bg__blob animated-bg__blob--three" />
        <div className="animated-bg__particles" />
      </div>

      {showSidebar && (
        <div className="w-64 sh-sidebar flex flex-col border-r shadow-xl shrink-0 relative z-20">
          <div className="p-6 pb-2">
            <h1 className="text-left text-study-accent text-xl font-black mb-2 uppercase tracking-[0.2em]">
              {t("brand")}
            </h1>
            <SyncBadge />
            <Navigation />
          </div>
          <StudyTimer />
        </div>
      )}

      <div className="flex-1 overflow-y-auto bg-transparent relative">
        <div className="absolute inset-0 bg-gradient-to-b from-study-bg/80 via-study-bg/50 to-study-bg/70 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-study-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

function ProtectedApp() {
  const { user } = useAuth();

  return (
    <StudyHubProvider user={user}>
      <AppShell showSidebar>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/group" element={<Group />} />
          <Route path="/library" element={<Library />} />
          <Route path="/user" element={<User />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
        </Routes>
      </AppShell>
    </StudyHubProvider>
  );
}

function StudyContent() {
  const location = useLocation();
  const path = location.pathname;
  const isPublic =
    path === "/" || path === "" || path === "/login" || path === "/register";

  if (isPublic) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <ProtectedRoute>
      <ProtectedApp />
    </ProtectedRoute>
  );
}

function Study() {
  return (
    <HashRouter>
      <StudyContent />
    </HashRouter>
  );
}

export default Study;
