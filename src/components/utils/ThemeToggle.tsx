"use client";

import { Button } from "../ui/button";

const ThemeToggle = () => {
  return (
    <Button
      onClick={() => {
        const html = document.documentElement;
        const isDark = html.classList.contains("dark");

        if (isDark) {
          html.classList.remove("dark");
          localStorage.setItem("theme", "light");
        } else {
          html.classList.add("dark");
          localStorage.setItem("theme", "dark");
        }
      }}
    >
      toggle
    </Button>
  );
};

export default ThemeToggle;
