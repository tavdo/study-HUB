import { useEffect } from "react";
import { useStudyHub } from "../context/StudyHubContext";
import ka from "../i18n/ka";

const THEME_MAP = {
  [ka.settings.themeDark]: "dark",
  [ka.settings.themeOnyx]: "onyx",
  [ka.settings.themeMint]: "mint",
  "Dark Emerald (default)": "dark",
  "Midnight Onyx": "onyx",
  "Light Mint": "mint",
};

function ThemeEffect() {
  const { settings } = useStudyHub();

  useEffect(() => {
    const theme = THEME_MAP[settings.theme] || "dark";
    document.documentElement.setAttribute("data-theme", theme);
  }, [settings.theme]);

  return null;
}

export default ThemeEffect;
