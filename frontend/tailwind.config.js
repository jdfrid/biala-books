/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDF9E7',
          100: '#FCF3C7',
          200: '#F9E68B',
          300: '#F5D54A',
          400: '#E8BF0C',
          500: '#C9A008',
          600: '#A17D06',
          700: '#795C06',
          800: '#5E480A',
          900: '#4A380D',
          950: '#2A1F03',
        },
        cream: {
          50: '#FEFDFB',
          100: '#FDF9F0',
          200: '#FAF3E0',
          300: '#F5E8C8',
          400: '#EEDCA8',
          500: '#E5CC83',
          600: '#D9B85E',
          700: '#C9A040',
          800: '#A68232',
          900: '#856829',
          950: '#483515',
        },
        navy: {
          50: '#F0F3F8',
          100: '#E1E6F0',
          200: '#C3CCE0',
          300: '#9AA8C9',
          400: '#6B7EAD',
          500: '#4C5E91',
          600: '#3D4C79',
          700: '#333F62',
          800: '#2C3652',
          900: '#1A2035',
          950: '#0D101A',
        },
        burgundy: {
          50: '#FDF3F4',
          100: '#FCE4E7',
          200: '#FACDD3',
          300: '#F6A7B1',
          400: '#EF7386',
          500: '#E4455F',
          600: '#D02849',
          700: '#AE1D3C',
          800: '#911B38',
          900: '#7C1A35',
          950: '#450918',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        display: ['Cinzel', 'Georgia', 'serif'],
        hebrew: ['Frank Ruhl Libre', 'David', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'pattern-ornate': "url('/patterns/ornate.svg')",
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

