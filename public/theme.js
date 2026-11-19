try {
  const theme = localStorage.getItem("portfolio-theme");
  if (theme === "dark" || theme === "light") document.documentElement.dataset.theme = theme;
} catch {
  // System color preference remains available through CSS.
}
