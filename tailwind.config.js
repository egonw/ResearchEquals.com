// tailwind.config.js
module.exports = {
  mode: "jit",
  content: ["{pages,app}/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        xs: "340px",
        modscreen: "916px",
      },
      fontFamily: {
        sans: ["Noto Sans Display", "system-ui"],
      },
      spacing: {
        120: "35rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/line-clamp"), require("@tailwindcss/forms")],
}
