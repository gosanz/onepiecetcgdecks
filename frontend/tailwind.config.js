import { nextui } from "@nextui-org/react";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-dark": "#212434",
        "custom-dark-accent": "#3F446F",
        "custom-silver": "#BBBBBB",
        "custom-silver-accent": "#D7D7D7",
        "custom-yellow": "#FFD082",
        "custom-tangerine": "#FF8282",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
