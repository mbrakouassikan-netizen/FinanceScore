import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0D0F14',
        'bg-card': '#161820',
        'accent-primary': '#C8F04A',
        'accent-secondary': '#185FA5',
        'text-primary': '#F0EDE6',
        'text-secondary': '#7A7D8A',
        'score-red': '#FF5C5C',
        'score-orange': '#FF8C42',
        'score-yellow': '#FFD166',
        'score-green': '#C8F04A',
      },
      fontFamily: {
        'serif': ['Fraunces', 'serif'],
        'sans': ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'pill': '9999px',
      },
      animation: {
        'count-up': 'countUp 1.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
