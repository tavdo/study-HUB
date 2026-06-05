import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../i18n";

function Navigation() {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useI18n();

  const links = [
    { to: "/dashboard", label: t("nav.dashboard") },
    { to: "/notes", label: t("nav.notes") },
    { to: "/library", label: t("nav.library") },
    { to: "/quiz", label: t("nav.quizzes") },
    { to: "/flashcards", label: t("nav.flashcards") },
    { to: "/user", label: t("nav.users") },
    { to: "/group", label: t("nav.messages") },
    { to: "/ai", label: t("nav.ai") },
    { to: "/settings", label: t("nav.settings") },
    ...(user?.role === "admin"
      ? [{ to: "/admin", label: t("nav.admin") }]
      : []),
  ];

  return (
    <nav className="flex flex-col gap-0.5">
      {links.map(({ to, label }) => {
        const active = location.pathname === to;
        return (
          <Link
            key={to}
            className={`text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              active ? "sh-nav-active" : "sh-nav-link"
            }`}
            to={to}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export default Navigation;
