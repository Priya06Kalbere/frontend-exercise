module.exports = {
  content: ['./src/**/*.{js,ts,tsx,jsx}', './public/index.html'],
  darkMode: 'media',
  purge: [],
  theme: {
    extend: {
      fontFamily: {
        // Use for all UI text, labels, and body
        sans: ['Poppins', 'sans-serif'],
        // Use for the main game title
        display: ['Audiowide', 'sans-serif']
      },
      colors: {
        // Define your custom colors
        'purple-bg': '#3A055C',
        'pink-accent': '#FF6B9B',
        'dark-pink': '#A8055E',
        'light-text': '#F0F0F0'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
