import React, { createContext, useState, useContext, useEffect } from "react";
import { Appearance } from "react-native";

const LightTheme = {
  mode: "light",
  background: "#FFFFFF",
  text: "#1A1A1A",
  card: "#F6F6F6",
  primary: "#007AFF",
};

const DarkTheme = {
  mode: "dark",
  background: "#1A1A1A",
  text: "#FFFFFF",
  card: "#2C2C2C",
  primary: "#0A84FF",
};

type Theme = typeof LightTheme;

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: LightTheme,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = Appearance.getColorScheme(); // 'dark' or 'light'
  const [theme, setTheme] = useState(colorScheme === "dark" ? DarkTheme : LightTheme);

  const toggleTheme = () => {
    setTheme(prev => (prev.mode === "dark" ? LightTheme : DarkTheme));
  };

  useEffect(() => {
    Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? DarkTheme : LightTheme);
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
