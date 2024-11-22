module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // Enable dark mode with a specific class
  theme: {
    extend: {
      fontFamily: {
        title: ['Unlock', 'serif'],
      },
      colors: {
        background: '#1a202c',
        card: '#2d3748',
        text: '#e2e8f0',
        border: '#4a5568',
        lightBg: '#374152',
      },
      height: {
        cli: '70vh',
        '2/3-screen': '66.6667vh',
      },
      minHeight: {
        cli: '66.6667vh', // Define min-h-cli
      },
      boxShadow: {
        '3xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // Add a custom shadow larger than 2xl
        '4xl': '0 40px 90px 1px rgba(0, 0, 0, 0.9)', // Even larger shadow
      },
      borderRadius: {
        pile: '1.3rem',
        '4xl': '2rem', // Custom border radius for 4xl
      },
    },
  },
  plugins: [],
};
