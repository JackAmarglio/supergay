import { useEffect } from "react";
import { BuildTheme } from "./Theme";

const ThemeSettings = () => {
  const theme = BuildTheme({
    direction: 'ltr',
    theme: 'ORANGE_THEME',
  });
  useEffect(() => {
    document.dir = 'ltr';
  }, []);

  return theme;
};
export default ThemeSettings;
