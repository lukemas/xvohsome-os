import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        retro: [
          "Tahoma",
          "Segoe UI",
          "MS Sans Serif",
          "sans-serif",
        ],
      },
      colors: {
        win: {
          /** Title bar & selection accent (dark purple, not classic Win navy) */
          title: "#3d2a5c",
          surface: "#c0c0c0",
          borderLight: "#ffffff",
          borderDark: "#808080",
          borderDarker: "#000000",
        },
      },
      boxShadow: {
        win98out:
          "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080, 1px 1px 0 #000000",
        win98in:
          "inset -1px -1px 0 #ffffff, inset 1px 1px 0 #808080, -1px -1px 0 #000000",
      },
    },
  },
  plugins: [],
};

export default config;
