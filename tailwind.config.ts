import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#135bec',
        'background-light': '#f6f6f8',
        'background-dark': '#101622',
        'card-light': '#ffffff',
        'card-dark': '#1a2230',
        'status-pending': '#F5A623',
        'status-progress': '#4A90E2',
        'status-completed': '#7ED321',
        'status-canceled': '#D0021B',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
