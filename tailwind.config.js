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
      // Define our professional grayscale color palette
      // We can adjust these hex codes later if needed, but this provides a good range.
      colors: {
        // Naming convention: gray-XXX where lower numbers are lighter
        'gray-100': '#f8f9fa', // Very light gray (almost white) - Page backgrounds, cards
        'gray-200': '#e9ecef', // Light gray - Subtle backgrounds, borders
        'gray-300': '#dee2e6', // Light gray - Borders, dividers
        'gray-400': '#ced4da', // Medium-light gray - Input borders, disabled text
        'gray-500': '#adb5bd', // Medium gray - Secondary text, icons, placeholders
        'gray-600': '#6c757d', // Medium-dark gray - Body text, primary text (on light bg)
        'gray-700': '#495057', // Dark gray - Headings, primary text, input text
        'gray-800': '#343a40', // Very dark gray - Header/footer backgrounds, dark sections
        'gray-900': '#212529', // Near black - Darkest backgrounds, contrasting text
        // We keep standard white and black too for maximum contrast when needed
        'white': '#ffffff',
        'black': '#000000',
      }
      // We can extend fonts, spacing, etc. here later if needed
      // fontFamily: {
      //   sans: ['Inter', 'sans-serif'], // Example: adding a custom font
      // },
    },
  },

  // Tailwind plugins (we might add some later, e.g., for forms)
  plugins: [],
}