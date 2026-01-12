/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // 👈 NOTE: It is NOT just 'tailwindcss' anymore
  },
};

export default config;