const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    '@unocss/postcss': {
      content: ['./app/**/*.{html,js,ts,jsx,tsx}'],
    },
  },
};

export default config;
