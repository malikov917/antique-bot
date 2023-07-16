const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        transparent: 'transparent',
        purple: '#d406b6',
        green: '#b6d406',
        red: '#ff4549',
        blue: '#064fd4',
        ...defaultTheme.colors
      },
      flex: {
        '2': '2 2 0%'
      }
    },
  },
  plugins: [],
}

