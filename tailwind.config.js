// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  // Configure template paths
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Ensure this scans all relevant source files
  ],

  // Define the theme customizations
  theme: {
    extend: {
      colors: {
        // Main colors
        primary: {
          DEFAULT: '#21C063',
          hover: '#16994A',
        },
        // Background colors
        dark: {
          DEFAULT: '#161717',
          card: '#23272F',
          input: '#18181B',
        },
        // Text colors
        text: {
          primary: '#FFFFFF',
          secondary: '#B0B3B8',
        },
        // Status colors
        status: {
          error: '#EF4444',
          success: '#21C063',
          warning: '#F59E42',
          info: '#38BDF8',
        },
        // Error states
        error: {
          bg: '#2D1B1B',
          border: '#EF4444',
          text: '#EF4444',
        },
        // Success states
        success: {
          bg: '#1B2D1B',
          border: '#21C063',
          text: '#21C063',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'button': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },

  // Tailwind plugins (we might add some later, e.g., for forms)
  plugins: [],
}