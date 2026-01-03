import { useState, useEffect } from "react";

export function useDarkMode() {
  // Always dark mode now
  const [isDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.add("dark");
    body.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    // No-op to prevent breakage elsewhere
    console.log("Light mode is disabled.");
  };

  return [isDark, toggleDarkMode];
}

