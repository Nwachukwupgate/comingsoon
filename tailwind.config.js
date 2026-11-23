module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    backgroundImage: {
      hero:
        "url('https://html.creativegigstf.com/vCamp/vCamp/images/assets/bg_01.png')",
    },
    extend: {
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
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
            filter: "blur(2px)",
          },
          "33%": {
            transform: "translate(8%, -13%) scale(1.1)",
            filter: "blur(0px)",
          },
          "66%": {
            transform: "translate(-5%, 5%) scale(0.9)",
            filter: "blur(2px)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
            filter: "blur(1px)",
          },
        },
        blob2: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
            filter: "blur(2px)",
          },
          "50%": {
            transform: "translate(20px, -20px) scale(1.1)",
            filter: "blur(0px)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
            filter: "blur(1px)",
          },
        },
      },
    },
  },
  variants: {},
  plugins: [],
};
