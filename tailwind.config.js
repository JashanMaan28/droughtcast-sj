/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        water: {
          DEFAULT: "#0c4a6e",
          light: "#0ea5e9",
        },
        sand: {
          50: "#fafaf5",
          100: "#f5f4ea",
        },
      },
    },
  },
  plugins: [],
};
