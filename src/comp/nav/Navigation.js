import { Link, useLocation } from "react-router-dom";
import ka from "../../i18n/ka";

const links = [
  { to: "/dashboard", label: ka.nav.dashboard },
  { to: "/notes", label: ka.nav.notes },
  { to: "/library", label: ka.nav.library },
  { to: "/quiz", label: ka.nav.quizzes },
  { to: "/user", label: ka.nav.users },
  { to: "/group", label: ka.nav.messages },
  { to: "/ai", label: ka.nav.ai },
  { to: "/settings", label: ka.nav.settings },
];

function Navigation() {
  const location = useLocation();

  return (
    <nav className="flex flex-col">
      {links.map(({ to, label }) => {
        const active = location.pathname === to;
        return (
          <Link
            key={to}
            className={`text-left px-4 py-2 rounded-lg transition-colors ${
              active
                ? "bg-emerald-700 text-white"
                : "text-white hover:bg-emerald-700 hover:text-white"
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
