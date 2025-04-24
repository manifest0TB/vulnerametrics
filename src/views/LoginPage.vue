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
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2
        class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-800"
      >
        Sign in to your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-700"
            >Email address</label
          >
          <div class="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              v-model="email"
              autocomplete="email"
              required
              class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium leading-6 text-gray-700"
            >Password</label
          >
          <div class="relative mt-2">
            <input
              id="password"
              name="password"
              :type="isPasswordVisible ? 'text' : 'password'"
              v-model="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md border-0 px-3 py-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {{ isPasswordVisible ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <RouterLink
            to="/forgot-password"
            class="text-sm font-medium text-gray-600 hover:text-gray-800"
            >Forgot your password?</RouterLink
          >
        </div>

        <div v-if="errorMessage" class="text-center text-sm" :class="{
          'text-red-600': !errorMessage.includes('successfully'),
          'text-green-600': errorMessage.includes('successfully')
        }">
          {{ errorMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex w-full justify-center rounded-md bg-gray-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition-colors hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            :class="{ 'animate-pulse': isLoading }"
          >
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Not a member?
        {{ ' ' }}
        <RouterLink
          to="/register"
          class="font-semibold leading-6 text-gray-600 hover:text-gray-800"
          >Register here</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style>