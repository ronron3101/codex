import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lumini: {
          950: "#101316",
          900: "#171c21",
          700: "#2c3944",
          500: "#7ca0bc",
          300: "#c7d8e6",
          100: "#eef3f7"
        }
      }
    }
  },
  plugins: []
};

export default config;
