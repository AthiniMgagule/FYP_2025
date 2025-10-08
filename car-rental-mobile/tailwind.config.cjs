/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")], // Corrected line
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",     // nice blue
        secondary: "#9333ea",   // accent purple
      },
      fontFamily: {
        inter: ["Inter_400Regular"],
      },
    },
  },
  plugins: [],
};
