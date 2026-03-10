/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--theme-bg)',
        surface: 'var(--theme-surface)',
        'surface-light': 'var(--theme-surfaceLight)',
        'additional-surface': 'var(--theme-additionalSurface)',
        border: 'var(--theme-border)',
        text: 'var(--theme-text)',
        'text-secondary': 'var(--theme-textSecondary)',
        gold: 'var(--theme-gold)',
        accent: 'var(--theme-accent)',
        owned: 'var(--theme-owned)',
        duplicate: 'var(--theme-duplicate)',
      },
    },
  },
  plugins: [],
};
