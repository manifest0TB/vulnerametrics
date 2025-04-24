<script setup lang="ts">
// src/components/AppFooter.vue
import { RouterLink } from 'vue-router';

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="mt-auto bg-gray-800 text-gray-400 shadow-inner">
    <div
      class="container mx-auto flex flex-col items-center justify-between px-4 py-4 text-sm sm:flex-row"
    >
      <div class="mb-2 sm:mb-0">
        &copy; {{ currentYear }} Vulnerametrics. All rights reserved.
      </div>

      <nav class="flex space-x-4">
        <RouterLink
          to="/privacy-policy"
          class="transition-colors hover:text-gray-200"
          >Privacy Policy</RouterLink
        >
        <span class="select-none">|</span>
        <RouterLink
          to="/terms-of-service"
          class="transition-colors hover:text-gray-200"
          >Terms of Service</RouterLink
        >
      </nav>
    </div>
  </footer>
</template>

<style scoped>
/* Scoped styles specific to AppFooter if needed */
footer {
  /* Add a subtle top border */
  border-top: 1px solid theme('colors.gray.700');
}
</style>