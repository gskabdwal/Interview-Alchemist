"use client";

import React from "react";
import { useTheme } from "next-themes";

export const Logo = ({ className }: { className?: string }) => {
  const { theme } = useTheme();

  // Determine colors based on the current theme
  // For light mode: logo color white, background black;
  // For dark mode: logo color black, background white;
  const isLight = theme === "light" || theme === "system";
  const iconColor = isLight ? "#fff" : "#000";
  const bgColor = isLight ? "black" : "white";

  return (
    <div
      className={className}
      style={{
        width: "34px",
        height: "34px",
        backgroundColor: bgColor,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
    <svg className={"z-1"} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke={iconColor} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M15.5 13a3.5 3.5 0 0 0-3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1-7 0v-1.8"/><path d="M17.5 16a3.5 3.5 0 0 0 0-7H17"/><path d="M19 9.3V6.5a3.5 3.5 0 0 0-7 0M6.5 16a3.5 3.5 0 0 1 0-7H7"/><path d="M5 9.3V6.5a3.5 3.5 0 0 1 7 0v10"/></g></svg>
    </div>
  );
};

export default Logo;