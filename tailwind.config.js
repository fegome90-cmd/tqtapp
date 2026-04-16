/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-surface)',
        card: 'var(--color-card)',
        'primary-action': 'var(--color-primary-action)',
        'primary-light': 'var(--color-primary-light)',
        heading: 'var(--color-text-heading)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
        'on-action': 'var(--color-text-on-action)',
        'border-subtle': 'var(--color-border-subtle)',
        error: 'var(--color-error)',
        'error-bg': 'var(--color-error-bg)',
      },
    },
  },
  plugins: [],
};
