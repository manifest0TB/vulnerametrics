<script setup lang="ts">
// src/views/LoginPage.vue
import { ref, computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Import the auth store

// Initialize the auth store and router
const authStore = useAuthStore();
const router = useRouter();

// Local reactive state for form inputs
const email = ref<string>('');
const password = ref<string>('');
const isPasswordVisible = ref<boolean>(false);

// Computed properties to access store state easily
const isLoading = computed(() => authStore.loading);
const errorMessage = computed(() => authStore.error);

// Toggle password visibility function
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

// Handler for form submission
const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);
    // Si llegamos aquí, el login fue exitoso
    console.log('Redirecting to home page after successful login...');
    router.push({ name: 'Home' });
  } catch (error) {
    console.error('Login error:', error);
  }
};
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-[#161717]" style="font-family: 'Roboto', sans-serif;">
    <div class="sm:mx-auto sm:w-full sm:max-w-md bg-[#23272F] rounded-2xl shadow-lg p-10">
      <h2 class="text-center text-3xl font-bold text-white mb-6">Sign in to your account</h2>
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="email" class="block text-sm font-medium text-[#B0B3B8]">Email address</label>
          <div class="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              v-model="email"
              autocomplete="email"
              required
              class="block w-full rounded-md border-0 px-3 py-2 text-white bg-[#18181B] shadow-sm ring-1 ring-inset ring-[#23272F] placeholder:text-[#B0B3B8] focus:ring-2 focus:ring-inset focus:ring-[#21C063] sm:text-base"
            />
          </div>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-[#B0B3B8]">Password</label>
          <div class="relative mt-2">
            <input
              id="password"
              name="password"
              :type="isPasswordVisible ? 'text' : 'password'"
              v-model="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md border-0 px-3 py-2 pr-10 text-white bg-[#18181B] shadow-sm ring-1 ring-inset ring-[#23272F] placeholder:text-[#B0B3B8] focus:ring-2 focus:ring-inset focus:ring-[#21C063] sm:text-base"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5 text-[#B0B3B8] hover:text-[#21C063] focus:outline-none"
            >
              {{ isPasswordVisible ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <RouterLink
            to="/forgot-password"
            class="text-sm font-medium text-[#B0B3B8] hover:text-[#21C063]"
          >
            Forgot your password?
          </RouterLink>
        </div>
        <div v-if="errorMessage" class="text-center text-sm mt-2" :class="{
          'text-[#EF4444]': !errorMessage.includes('successfully'),
          'text-[#21C063]': errorMessage.includes('successfully')
        }">
          {{ errorMessage }}
        </div>
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex w-full justify-center rounded-md bg-[#21C063] px-3 py-2 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#16994A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21C063] disabled:cursor-not-allowed disabled:opacity-50"
            :class="{ 'animate-pulse': isLoading }"
          >
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>
      <p class="mt-10 text-center text-sm text-[#B0B3B8]">
        Not a member?
        <RouterLink
          to="/register"
          class="font-semibold text-[#21C063] hover:underline"
        >
          Register here
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style>