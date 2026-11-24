/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      /* ---- Upsworth marketing site (app/) ----
         Values live as CSS variables in app/globals.css. */
      colors: {
        navy: {
          DEFAULT: "rgb(var(--c-navy) / <alpha-value>)",
          deep: "rgb(var(--c-navy-deep) / <alpha-value>)",
          soft: "rgb(var(--c-navy-soft) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--c-accent) / <alpha-value>)",
          ink: "rgb(var(--c-accent-ink) / <alpha-value>)",
        },
        mist: {
          DEFAULT: "rgb(var(--c-mist) / <alpha-value>)",
          blue: "rgb(var(--c-mist-blue) / <alpha-value>)",
        },
        line: "rgb(var(--c-line) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
        site: ["var(--font-manrope)", "var(--font-arabic)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: { site: "78rem" },

      /* ---- Coming soon page (pages/index.tsx) ---- */
      backgroundImage: {
        hero: "url('https://html.creativegigstf.com/vCamp/vCamp/images/assets/bg_01.png')",
      },
      screens: {
        // Phones held sideways: wide enough for `sm`, but very little height.
        short: { raw: "(orientation: landscape) and (max-height: 500px)" },
      },
      height: {
        // Scales with screen height so the form stays in view on small phones.
        figure: "clamp(8rem, 28vh, 18rem)",
      },
      fontSize: {
        hero: ["clamp(2rem, 12vw, 4.5rem)", "1.05"],
      },
      animation: {
        blob: "blob 7s infinite",
        blob2: "blob2 10s infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)", filter: "blur(2px)" },
          "33%": { transform: "translate(8%, -13%) scale(1.1)", filter: "blur(0px)" },
          "66%": { transform: "translate(-5%, 5%) scale(0.9)", filter: "blur(2px)" },
          "100%": { transform: "translate(0px, 0px) scale(1)", filter: "blur(1px)" },
        },
        blob2: {
          "0%": { transform: "translate(0px, 0px) scale(1)", filter: "blur(2px)" },
          "50%": { transform: "translate(20px, -20px) scale(1.1)", filter: "blur(0px)" },
          "100%": { transform: "translate(0px, 0px) scale(1)", filter: "blur(1px)" },
        },
      },
    },
  },
  plugins: [],
};
