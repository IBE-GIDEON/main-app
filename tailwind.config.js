/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
      xs: '2px',
    },
      keyframes: {
        blobSlow: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(20px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(-15px, 15px) scale(0.95)' },
        },
        blobSlow2: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(-20px, 15px) scale(1.05)' },
          '66%': { transform: 'translate(10px, -10px) scale(0.95)' },
        },
        gradientBackground: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
      },
      animation: {
        blobSlow: 'blobSlow 20s infinite ease-in-out',
        blobSlow2: 'blobSlow2 25s infinite ease-in-out',
        gradientBackground: 'gradientBackground 30s infinite ease-in-out',
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
      },
    },
  },
  plugins: [],
};


