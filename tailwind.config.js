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
        grad: {
          dark: "#3f3d56",
          light: "#fcfbf5",
        },
      },
      zIndex: {
        1: 1,
        "-1": -1,
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle at bottom, var(--tw-gradient-stops))",
      },
      keyframes: {
        subtle: {
          "0%, 100%": { "background-size": "100% 100%" },
          "50%": { "background-size": "250% 250%" },
        },
      },
      animation: {
        subtle: "subtle 20s ease-in-out infinite",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
