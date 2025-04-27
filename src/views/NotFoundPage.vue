<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-[#161717]" style="font-family: 'Roboto', sans-serif;">
    <div class="sm:mx-auto sm:w-full sm:max-w-md bg-[#23272F] rounded-2xl shadow-lg p-10 text-center">
      <h1 class="text-9xl font-bold text-[#21C063] mb-4">404</h1>
      <h2 class="text-3xl font-bold text-white mb-4">Page Not Found</h2>
      <p class="text-[#B0B3B8] mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        @click="goHome"
        class="bg-[#21C063] hover:bg-[#16994A] text-white px-8 py-3 rounded-xl text-lg font-medium shadow transition"
      >
        Return to Home
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style>