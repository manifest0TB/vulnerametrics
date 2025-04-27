<script setup lang="ts">
// src/views/HomePage.vue
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-[#161717]" style="font-family: 'Roboto', sans-serif;">
    <div class="w-full max-w-2xl bg-[#23272F] rounded-3xl shadow-2xl p-16 flex flex-col items-center mt-24 mb-12 border border-[#23272F]">
      <img src="@/assets/vmlogo_white.svg" alt="VulneraMetrics Logo" class="h-20 w-auto mb-8" />
      <h1 class="text-4xl font-bold text-white mb-4 text-center">Welcome to VulneraMetrics!</h1>
      <p class="text-lg text-[#B0B3B8] mb-8 text-center">
        VulneraMetrics is a cybersecurity tool to generate detailed PDF reports on specific CVE using Claude 3.7 Sonnet on AWS Bedrock. 
      </p>
      <RouterLink
        to="/generate-reports"
        class="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl shadow-lg text-xl font-semibold transition"
      >
        Search CVE
      </RouterLink>
    </div>
    <div class="flex justify-center space-x-6 mt-8">
      <RouterLink to="/privacy" class="text-[#B0B3B8] underline hover:text-[#21C063] transition">Privacy Policy</RouterLink>
      <RouterLink to="/terms" class="text-[#B0B3B8] underline hover:text-[#21C063] transition">Terms of Service</RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style>