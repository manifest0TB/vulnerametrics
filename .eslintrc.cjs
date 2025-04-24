// .eslintrc.cjs
/* eslint-env node */
// Ensure this line exists if you installed @rushstack/eslint-patch separately, otherwise omit
// require('@rushstack/eslint-patch/modern-module-resolution'); 

module.exports = {
  root: true, // Specifies this is the root config
  env: {
    browser: true, // Enable browser global variables
    es2021: true,  // Enable ES2021 globals and syntax
    node: true     // Enable Node.js global variables and scope (for config files like this one)
  },
  extends: [
    // Base ESLint recommended rules
    'eslint:recommended',

    // Vue 3 specific linting rules
    // Use 'vue3-essential' for basic rules, 'vue3-strongly-recommended', or 'vue3-recommended' for more comprehensive checks
    'plugin:vue/vue3-recommended', 

    // TypeScript specific linting rules
    'plugin:@typescript-eslint/recommended', 

    // Prettier integration: disables ESLint rules conflicting with Prettier & enables prettier rule
    // IMPORTANT: Must be the LAST item in the extends array
    'plugin:prettier/recommended', 
  ],
  parser: 'vue-eslint-parser', // Use the Vue parser first
  parserOptions: {
    parser: '@typescript-eslint/parser', // Specify TypeScript parser for <script lang="ts"> blocks
    ecmaVersion: 'latest', // Use the latest ECMAScript standard
    sourceType: 'module', // Use ES modules
  },
  plugins: [
    // Register the TypeScript plugin (already included via extends usually, but explicit is fine)
    '@typescript-eslint', 
    // Prettier plugin already included via 'plugin:prettier/recommended'
  ],
  rules: {
    // --- Prettier Rule ---
    'prettier/prettier': 'warn', // Show Prettier formatting issues as warnings

    // --- Potential Custom Rules (Examples) ---
    // Allow console.log during development but warn
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    // Allow debugger during development but error in production
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn', 

    // --- Vue Specific Rule Overrides (Example) ---
    // Allow single word component names if needed (though multi-word is recommended)
    // 'vue/multi-word-component-names': 'off', 

    // --- TypeScript Specific Rule Overrides (Example) ---
    // Allow the use of 'any' type (use with caution)
    // '@typescript-eslint/no-explicit-any': 'off', 
  },
  ignorePatterns: [ // Files/directories ESLint should ignore
      "node_modules/", 
      "dist/",
      "*.d.ts" // Declaration files
  ] 
};
