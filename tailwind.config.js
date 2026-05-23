export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 24px 80px rgba(59, 130, 246, 0.14)',
      },
      backgroundImage: {
        'hero-light': 'radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 35%), radial-gradient(circle at bottom right, rgba(59,130,246,0.12), transparent 25%)',
        'hero-dark': 'radial-gradient(circle at top left, rgba(59,130,246,0.14), transparent 30%), radial-gradient(circle at bottom right, rgba(59,130,246,0.10), transparent 20%)',
      },
    },
  },
  plugins: [],
}
