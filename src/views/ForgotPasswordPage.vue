<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { validateEmail } from '@/utils/inputValidation';

// Initialize store and router
const authStore = useAuthStore();
const router = useRouter();

// Validation patterns
const emailPattern = '^[^<>\'"`;\{\}%]*$';

// Local reactive state for form input and validation
const email = ref<string>('');
const validationError = ref<string | undefined>();

// Computed properties from store
const isLoading = computed(() => authStore.loading);
const errorMessage = computed(() => authStore.error);

// Clear any existing error messages when the component mounts
onMounted(() => {
  // Only clear errors if we're not coming from the reset password page
  if (!router.currentRoute.value.query.fromReset) {
    authStore.error = null;
  }
});

// Clear any error messages when leaving the page
onUnmounted(() => {
  authStore.error = null;
});

// Handler for form submission
const handleForgotPassword = async () => {
  // Reset validation error
  validationError.value = undefined;

  // Validate email
  const emailValidation = validateEmail(email.value);
  if (!emailValidation.isValid) {
    validationError.value = emailValidation.error;
    return;
  }

  try {
    await authStore.forgotPassword(email.value);
    // Si llegamos aquí, el proceso fue exitoso
    router.push({
      name: 'ResetPassword',
      query: { email: email.value }
    });
  } catch (error) {
    console.error('Error during forgot password process:', error);
  }
};
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-800">
        Reset your password
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Enter your email address and we'll send you a code to reset your password.
      </p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <form class="space-y-6" @submit.prevent="handleForgotPassword">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-700">
            Email address
          </label>
          <div class="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              v-model="email"
              autocomplete="email"
              required
              maxlength="254"
              :pattern="emailPattern"
              class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
            />
          </div>
          <!-- Validation error message -->
          <p v-if="validationError" class="mt-2 text-sm text-red-600">
            {{ validationError }}
          </p>
        </div>

        <div v-if="errorMessage" class="text-center text-sm" :class="{
          'text-red-600': !errorMessage.includes('If an account exists'),
          'text-blue-600': errorMessage.includes('If an account exists')
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
            {{ isLoading ? 'Sending...' : 'Send Reset Code' }}
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Remember your password?
        {{ ' ' }}
        <RouterLink
          to="/login"
          class="font-semibold leading-6 text-gray-600 hover:text-gray-800"
        >
          Back to Sign In
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.forgot-password-page {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: center;
}
</style>