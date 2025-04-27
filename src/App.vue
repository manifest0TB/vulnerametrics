<script setup lang="ts">
// src/App.vue
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

onMounted(async () => {
  try {
    await authStore.checkAuth();
  } catch (error) {
    console.error('Error initializing auth:', error);
  }
});
</script>

<template>
  <div id="app" class="min-h-screen bg-dark text-text-primary" style="font-family: 'Roboto', sans-serif;">
    <RouterView />
  </div>
</template>