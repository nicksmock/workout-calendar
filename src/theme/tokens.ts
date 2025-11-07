/**
 * Jeton Theme Design Tokens
 *
 * This file contains all the design tokens from the Jeton Theme design system.
 * Import these tokens to maintain consistency across the application.
 */

export const theme = {
  colors: {
    primaryGradient: {
      start: '#F85C70',
      end: '#F6A85E',
      direction: 'to right',
      css: 'linear-gradient(to right, #F85C70, #F6A85E)',
    },
    primary: '#F85C70',
    secondary: '#F6A85E',
    accent: '#FF6F61',
    background: '#F97C66',
    surface: '#FFFFFF',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.8)',
    buttonBackground: '#FF6F61',
    buttonText: '#FFFFFF',
    cardBackground: 'rgba(255,255,255,0.1)',
    link: '#FFFFFF',
  },

  typography: {
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    heading: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    body: {
      fontWeight: 400,
      letterSpacing: '0',
      lineHeight: 1.6,
    },
    sizes: {
      h1: '4rem',
      h2: '2.5rem',
      h3: '1.75rem',
      body: '1rem',
      small: '0.875rem',
    },
  },

  layout: {
    maxWidth: '1280px',
    padding: {
      mobile: '1.5rem',
      desktop: '3rem',
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '2rem',
      xl: '4rem',
    },
    borderRadius: {
      sm: '6px',
      md: '12px',
      lg: '24px',
      pill: '9999px',
    },
    boxShadow: {
      soft: '0 10px 20px rgba(0,0,0,0.08)',
      medium: '0 15px 30px rgba(0,0,0,0.12)',
    },
  },

  buttons: {
    primary: {
      background: '#FF6F61',
      color: '#FFFFFF',
      borderRadius: '9999px',
      fontWeight: 600,
      padding: '0.75rem 1.5rem',
      hover: {
        background: '#E65C56',
      },
    },
    secondary: {
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.5)',
      color: '#FFFFFF',
      borderRadius: '9999px',
    },
  },

  effects: {
    glassmorphism: {
      background: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
    },
    gradientOverlay: {
      type: 'linear',
      colors: ['#F85C70', '#F6A85E'],
    },
  },

  animations: {
    fadeIn: 'fade-in 0.6s ease-out',
    float: 'float 6s ease-in-out infinite',
  },
} as const;

export type Theme = typeof theme;
