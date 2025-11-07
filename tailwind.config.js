/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Jeton Theme Colors
        'primary': '#F85C70',
        'primary-start': '#F85C70',
        'primary-end': '#F6A85E',
        'secondary': '#F6A85E',
        'accent': '#FF6F61',
        'background': '#F97C66',
        'surface': '#FFFFFF',
        'text-primary': '#FFFFFF',
        'text-secondary': 'rgba(255,255,255,0.8)',
        'button-bg': '#FF6F61',
        'button-hover': '#E65C56',
        'card-bg': 'rgba(255,255,255,0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'heading-1': '4rem',
        'heading-2': '2.5rem',
        'heading-3': '1.75rem',
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '2rem',
        'xl': '4rem',
      },
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '24px',
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 10px 20px rgba(0,0,0,0.08)',
        'medium': '0 15px 30px rgba(0,0,0,0.12)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #F85C70, #F6A85E)',
        'gradient-overlay': 'linear-gradient(to right, #F85C70, #F6A85E)',
      },
      backdropBlur: {
        'glass': '10px',
      },
      letterSpacing: {
        'heading': '-0.02em',
      },
      lineHeight: {
        'heading': '1.1',
        'body': '1.6',
      },
      maxWidth: {
        'container': '1280px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
