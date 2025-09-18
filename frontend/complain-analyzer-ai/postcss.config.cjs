/**
 * PostCSS configuration for Tailwind CSS + Autoprefixer
 * Tailwind’s JIT engine will pick up all class names found in content paths
 */
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
}
