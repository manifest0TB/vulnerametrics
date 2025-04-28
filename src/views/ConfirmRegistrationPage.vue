<script setup lang="ts">
// src/views/ConfirmRegistrationPage.vue
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Import useRoute
import { useAuthStore } from '@/stores/auth';

// Initialize store, router, and route
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute(); // Get access to the current route object

// Local state for the confirmation code input
const confirmationCode = ref<string>('');
// Store the email from the route query parameter
const email = ref<string>('');

// Add resend code cooldown state
const canResendCode = ref<boolean>(true);
const cooldownSeconds = ref<number>(0);
const COOLDOWN_TIME = 60; // 60 seconds cooldown
const nickname = ref<string>('');

// Computed properties from store
const isLoading = computed(() => authStore.loading);
const errorMessage = computed(() => authStore.error);
const successMessage = ref<string | null>(null); // Local state for success message

// Get the email and nickname from the route query parameters when the component mounts
onMounted(() => {
  if (typeof route.query.email === 'string' && route.query.email) {
    email.value = route.query.email;
  } else {
    console.error('Email parameter missing in route query for confirmation.');
    authStore.error = 'Email address not found for confirmation.';
    router.push({ name: 'Register' });
  }
  if (typeof route.query.nickname === 'string' && route.query.nickname) {
    nickname.value = route.query.nickname;
  }
  console.log('[Confirm Page] isLoading state on mount:', authStore.loading);
  console.log('[Confirm Page] successMessage value on mount:', successMessage.value);
  // Clear any previous auth errors when mounting this page
  authStore.error = null;
});

// Handler for form submission
const handleConfirmation = async () => {
  authStore.error = null;
  successMessage.value = null;

  if (!email.value || !confirmationCode.value.trim()) {
    authStore.error = 'Please enter the confirmation code.';
    return;
  }

  try {
    await authStore.confirmRegistration(email.value, confirmationCode.value.trim());
    successMessage.value = 'Account confirmed successfully! Redirecting to login...';
    // Wait a moment to show the success message before redirecting
    setTimeout(() => {
      const redirect = route.query.redirect as string | undefined;
      if (redirect) {
        router.push({ name: 'Login', query: { redirect } });
      } else {
        router.push({ name: 'Login' });
      }
    }, 2000);
  } catch (error) {
    console.error('Confirmation error:', error);
  }
};

// Implement resend code with cooldown
const handleResendCode = async () => {
  if (!canResendCode.value || !email.value) return;
  
  try {
    await authStore.register(email.value, '', email.value, nickname.value);
    // Start cooldown
    canResendCode.value = false;
    cooldownSeconds.value = COOLDOWN_TIME;
    
    // Start countdown timer
    const timer = setInterval(() => {
      cooldownSeconds.value--;
      if (cooldownSeconds.value <= 0) {
        canResendCode.value = true;
        clearInterval(timer);
      }
    }, 1000);
  } catch (error) {
    console.error('Resend code error:', error);
  }
};

</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-4 sm:px-6 py-6 sm:py-12 lg:px-8 bg-dark" style="font-family: 'Roboto', sans-serif;">
    <div class="sm:mx-auto sm:w-full sm:max-w-md bg-dark-card rounded-2xl shadow-lg p-6 sm:p-10">
      <h2 class="text-center text-2xl sm:text-3xl font-bold text-text-primary mb-3 sm:mb-4">
        Confirm your account
      </h2>
      <p v-if="email" class="text-center text-xs sm:text-sm text-text-secondary mb-6 sm:mb-8">
        Enter the verification code sent to:
        <strong class="font-medium text-text-primary block mt-1">{{ email }}</strong>
      </p>
      <p v-else class="text-center text-xs sm:text-sm text-error-text">
        Could not determine email address.
      </p>

      <form class="space-y-4 sm:space-y-6" @submit.prevent="handleConfirmation">
        <div>
          <label for="code" class="block text-xs sm:text-sm font-medium text-text-secondary">Verification Code</label>
          <div class="mt-1 sm:mt-2">
            <input
              id="code"
              name="code"
              type="text"
              inputmode="numeric"
              v-model="confirmationCode"
              required
              class="block w-full rounded-md border-0 px-3 py-2 text-sm sm:text-base text-text-primary bg-dark-input shadow-sm ring-1 ring-inset ring-dark-card placeholder:text-text-secondary focus:ring-2 focus:ring-inset focus:ring-primary focus:outline-none"
            />
          </div>
        </div>

        <div v-if="errorMessage" class="text-center text-xs sm:text-sm" :class="{
          'text-error-text': !errorMessage.includes('successfully'),
          'text-success-text': errorMessage.includes('successfully')
        }">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="text-center text-xs sm:text-sm text-success-text">
          {{ successMessage }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm sm:text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
            :class="{ 'animate-pulse': isLoading }"
          >
            {{ isLoading ? 'Confirming...' : 'Confirm Account' }}
          </button>
        </div>
      </form>

      <div class="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
        <button 
          @click="handleResendCode" 
          :disabled="!canResendCode || isLoading"
          class="font-medium text-text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ canResendCode ? "Didn't receive a code? Resend" : `Wait ${cooldownSeconds}s to resend` }}
        </button>
      </div>

      <div class="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
        <RouterLink
          :to="{ name: 'Login', query: route.query.redirect ? { redirect: route.query.redirect } : undefined }"
          class="font-semibold text-[#21C063] hover:underline"
        >
          Back to Sign In
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Component-specific styles if needed */
</style>