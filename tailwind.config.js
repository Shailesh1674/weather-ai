/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: "rgba(255, 255, 255, 0.1)",
        glassBorder: "rgba(255, 255, 255, 0.2)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'sunny': 'linear-gradient(to bottom right, #4facfe, #00f2fe)',
        'rainy': 'linear-gradient(to bottom right, #2b5876, #4e4376)',
        'cloudy': 'linear-gradient(to bottom right, #8e9eab, #eef2f3)',
        'night': 'linear-gradient(to bottom right, #141e30, #243b55)',
      }
    },
  },
  plugins: [],
};
