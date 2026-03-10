/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#FFD700',
        'gold-dark': '#B8960C',
        accent: '#E53935',
        surface: '#212d40',
        'surface-light': '#2a384d',
        missing: '#252f42',
      },
    },
  },
  plugins: [],
};
