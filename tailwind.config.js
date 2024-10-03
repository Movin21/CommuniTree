/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryColor: "#004BAC",
        greyColor: "#3D3D3D",
        balck: "#000000",
        lightGrey: "#D9D9D9",
      },
      fontFamily: {
        inter: ["Inter"],
      },
      borderRadius: {
        obi: "80px",
      },
    },
  },
  plugins: [],
};
