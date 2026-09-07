import { useEffect } from 'react';
import { themes } from '../constants/Colors';

export function useTheme(settings) {
  const theme = settings?.theme && themes[settings.theme] ? themes[settings.theme] : themes.dark;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg1', theme.background);
    root.style.setProperty('--bg2', theme.backgroundSecondary);
    root.style.setProperty('--bg3', theme.backgroundGrey);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accentColored', theme.accentColored);
    root.style.setProperty('--accentColoredBright', theme.accentColoredBright);
    root.style.setProperty('--accentColoredDark', theme.accentColoredDark);
    root.style.setProperty('--accentDelete', theme.delCol);
    root.style.setProperty('--shadow', theme.shadow);
    const hueRotate = typeof theme.kanbieLogoHueRotate === 'number' ? `${theme.kanbieLogoHueRotate}deg` : theme.kanbieLogoHueRotate;
    root.style.setProperty('--kanbie-logo-hue-rotate', hueRotate);
    root.style.setProperty('--kanbie-logo-grayscale', theme.kanbieLogoGrayscale);
  }, [theme]);

  return theme;
}

export default useTheme;

