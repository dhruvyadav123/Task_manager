/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
      boxShadow: {
        soft: '0 18px 45px -25px rgba(15, 23, 42, .35)',
      },
    },
  },
  plugins: [],
};
