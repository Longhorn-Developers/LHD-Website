"use client";

import { useEffect, useState } from "react";

type ThemePreference = "system" | "light" | "dark";

const themeOrder: ThemePreference[] = ["system", "light", "dark"];

const themeIcons: Record<ThemePreference, string> = {
  system: "◐",
  light: "☀",
  dark: "☾",
};

function resolveTheme(preference: ThemePreference) {
  if (preference !== "system") return preference;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(preference: ThemePreference) {
  const theme = resolveTheme(preference);
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [preference, setPreference] =
    useState<ThemePreference>("system");

  useEffect(() => {
    const saved = window.localStorage.getItem("lhd-theme");
    const initial =
      saved === "light" || saved === "dark" || saved === "system"
        ? saved
        : "system";

    setPreference(initial);
    applyTheme(initial);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = () => {
      if (window.localStorage.getItem("lhd-theme") !== "light" &&
          window.localStorage.getItem("lhd-theme") !== "dark") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", followSystem);
    return () => media.removeEventListener("change", followSystem);
  }, []);

  const currentIndex = themeOrder.indexOf(preference);
  const nextPreference = themeOrder[(currentIndex + 1) % themeOrder.length];

  function cycleTheme() {
    window.localStorage.setItem("lhd-theme", nextPreference);
    setPreference(nextPreference);
    applyTheme(nextPreference);
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={cycleTheme}
      aria-label={`Theme: ${preference}. Change to ${nextPreference}.`}
      title={`Theme: ${preference}. Click for ${nextPreference}.`}
    >
      <span aria-hidden="true">{themeIcons[preference]}</span>
    </button>
  );
}
