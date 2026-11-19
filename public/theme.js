let theme;
try {
  const preference = localStorage.getItem("portfolio-theme");
  if (preference === "light" || preference === "dark") {
    theme = preference;
    document.documentElement.dataset.theme = preference;
  }
} catch {
  // The CSS uses the system theme when storage is unavailable.
}
const dark = theme ? theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#10111b" : "#f7f8fd");
