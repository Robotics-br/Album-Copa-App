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
        'missing-sticker-bg': 'var(--theme-missingStickerBg)',
        'missing-sticker-border': 'var(--theme-missingStickerBorder)',
        text: 'var(--theme-text)',
        'text-secondary': 'var(--theme-textSecondary)',
        'owned-sticker-text': 'var(--theme-ownedStickerTextColor)',
        primary: 'var(--theme-primary)',
        'on-primary': 'var(--theme-onPrimary)',
        'header-bg': 'var(--theme-headerBg)',
        'on-header': 'var(--theme-onHeader)',
        accent: 'var(--theme-accent)',
        owned: 'var(--theme-owned)',
        duplicate: 'var(--theme-duplicate)',
        'on-duplicate': 'var(--theme-onDuplicate)',
        'tab-border-color': 'var(--theme-tabBorderColor)',
        'tabs-bg': 'var(--theme-tabsBg)',
        'tabs-bg-active': 'var(--theme-tabsBgActive)',
        'tabs-bg-inactive': 'var(--theme-tabsBgInactive)',
      },
    },
  },
  plugins: [],
};
