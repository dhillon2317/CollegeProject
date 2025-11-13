/**
 * PostCSS configuration for Tailwind CSS + Autoprefixer
 * Uses postcss-nesting for CSS nesting support
 */
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {},
    autoprefixer: {},
  },
}
