const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        blue: colors.sky,
        gray: colors.trueGray,
      },
      zIndex: {
        1: 1,
        "-1": -1,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
