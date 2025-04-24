<script setup lang="ts">
// src/components/AppHeader.vue
import { ref, computed, onMounted, watch } from 'vue'; // Import computed, onMounted, and watch
import { RouterLink, useRouter } from 'vue-router'; // Import useRouter
import { useAuthStore } from '@/stores/auth'; // Import the auth store
import { useCreditsStore } from '@/stores/credits';

// Get the auth store instance
const authStore = useAuthStore();
const creditsStore = useCreditsStore();
const router = useRouter();

// Use computed properties to reactively get data from the store
const isLoggedIn = computed(() => authStore.isAuthenticated);
const userNickname = computed(() => {
  const attributes = authStore.userAttributes;
  return attributes?.nickname || 'User';
});

const userCredits = computed(() => creditsStore.credits);
const isLoadingCredits = computed(() => creditsStore.loading);

// Fetch credits when component is mounted and user is logged in
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await creditsStore.fetchCredits();
  }
});

// Watch for authentication state changes
watch(() => authStore.isAuthenticated, async (isAuthenticated) => {
  if (isAuthenticated) {
    await creditsStore.fetchCredits();
  }
});

// Logout handler
const handleLogout = async () => {
  await authStore.logout();
  // Redirect to login page after logout
  router.push({ name: 'Login' });
};
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 h-16 bg-gray-900 text-gray-100 shadow-md"
  >
    <div
      class="container mx-auto flex h-full items-center justify-between px-4"
    >
      <RouterLink to="/" class="flex items-center">
        <img
          src="@/assets/logo-bw-50.png"
          alt="Vulnerametrics Logo"
          class="mr-3 h-10 w-auto" /> </RouterLink>

      <nav class="flex items-center space-x-4">
        <template v-if="isLoggedIn">
          <span class="text-sm text-gray-300">
            Welcome,
            <span class="font-medium text-gray-100">{{ userNickname }}</span>
          </span>
          <span class="text-sm text-gray-300">|</span>
          <span class="text-sm text-gray-300">
            Credits:
            <span v-if="isLoadingCredits" class="font-medium text-gray-100">Loading...</span>
            <span v-else class="font-medium text-gray-100">{{ userCredits ?? 0 }}</span>
          </span>
          <span class="text-sm text-gray-300">|</span>
          <button
            @click="handleLogout"
            class="rounded px-3 py-1 text-sm text-gray-200 transition-colors hover:bg-gray-700 hover:text-white"
            :disabled="authStore.loading"
            >
            Logout
          </button>
        </template>
        <template v-else>
          <RouterLink
            to="/login"
            class="rounded px-3 py-1 text-sm text-gray-200 transition-colors hover:bg-gray-700 hover:text-white"
            >Login</RouterLink
          >
          <RouterLink
            to="/register"
            class="rounded bg-gray-600 px-3 py-1 text-sm text-white transition-colors hover:bg-gray-500"
            >Register</RouterLink
          >
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* Scoped styles specific to AppHeader if needed */
header {
  border-bottom: 1px solid theme('colors.gray.700');
}
</style>