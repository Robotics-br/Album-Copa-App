/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--theme-bg)',
        surface: 'var(--theme-surface)',
        border: 'var(--theme-border)',
        text: 'var(--theme-text)',
        'text-secondary': 'var(--theme-textSecondary)',
        primary: 'var(--theme-primary)',
        'on-primary': 'var(--theme-onPrimary)',
        accent: 'var(--theme-accent)',
        owned: 'var(--theme-owned)',
        duplicate: 'var(--theme-duplicate)',
      },
    },
  },
  plugins: [],
};
