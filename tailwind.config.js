module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    flex: {
      4: "1 1 23%",
    },
  },
  variants: {
    extend: {
      fill: ["hover", "focus"],
      margin: ["first"],
    },
  },
  plugins: [require("tailwind-gradient-mask-image")],
};
