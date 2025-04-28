<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { validateVerificationCode, validatePassword } from '@/utils/inputValidation';

// Initialize store, router, and route
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Local reactive state for form inputs and validation
const email = ref<string>('');
const code = ref<string>('');
const newPassword = ref<string>('');
const confirmPassword = ref<string>('');
const validationErrors = ref<{ [key: string]: string | undefined }>({});

// State for password visibility toggle
const isPasswordVisible = ref<boolean>(false);

// Computed properties from store
const isLoading = computed(() => authStore.loading);
const errorMessage = computed(() => authStore.error);

// Add resend code countdown functionality
const canResendCode = ref(true);
const countdown = ref(60);
const countdownInterval = ref<number | null>(null);

// Function to start countdown
const startCountdown = () => {
  canResendCode.value = false;
  countdown.value = 60;
  countdownInterval.value = window.setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      canResendCode.value = true;
      if (countdownInterval.value) {
        clearInterval(countdownInterval.value);
      }
    }
  }, 1000);
};

// Function to handle resend code
const handleResendCode = async () => {
  if (!canResendCode.value) return;
  
  try {
    await authStore.forgotPassword(email.value);
    startCountdown();
  } catch (error) {
    console.error('Error resending code:', error);
  }
};

// Clean up interval on component unmount
onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value);
  }
  // Only clear error messages if we're not going back to forgot password
  if (!router.currentRoute.value.query.fromReset) {
    authStore.error = null;
  }
});

// Start countdown on mount if we have an email
onMounted(() => {
  if (email.value) {
    startCountdown();
  }
});

// Get the email from the route query parameters when the component mounts
onMounted(async () => {
  if (typeof route.query.email === 'string' && route.query.email) {
    email.value = route.query.email;
  } else {
    console.error('Email parameter missing in route query for password reset.');
    authStore.error = 'Invalid reset attempt. Please start the password reset process again.';
    router.push({ 
      name: 'ForgotPassword',
      query: { fromReset: 'true' }
    });
  }
});

// Toggle password visibility function
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

// Handler for form submission with validation
const handleResetPassword = async () => {
  // Reset validation errors
  validationErrors.value = {};

  // Validate verification code
  const codeValidation = validateVerificationCode(code.value);
  if (!codeValidation.isValid) {
    validationErrors.value.code = codeValidation.error;
    return;
  }

  // Validate password
  const passwordValidation = validatePassword(newPassword.value);
  if (!passwordValidation.isValid) {
    validationErrors.value.password = passwordValidation.error;
    return;
  }

  // Validate password confirmation
  if (newPassword.value !== confirmPassword.value) {
    validationErrors.value.confirmPassword = 'Passwords do not match';
    return;
  }

  try {
    console.log('Attempting to reset password...');
    await authStore.resetPassword(email.value, code.value, newPassword.value);
    console.log('Password reset successful');
    // Wait 3 seconds to show the success message before redirecting
    setTimeout(() => {
      router.push({ name: 'Login' });
    }, 3000);
  } catch (error) {
    console.error('Error during password reset:', error);
  }
};
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-4 sm:px-6 py-6 sm:py-12 lg:px-8 bg-[#161717]" style="font-family: 'Roboto', sans-serif;">
    <div class="sm:mx-auto sm:w-full sm:max-w-md bg-[#23272F] rounded-2xl shadow-lg p-6 sm:p-10">
      <h2 class="text-center text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Set your new password</h2>
      <form class="space-y-4 sm:space-y-6" @submit.prevent="handleResetPassword">
        <div>
          <label for="code" class="block text-xs sm:text-sm font-medium text-[#B0B3B8]">Verification Code</label>
          <div class="mt-1 sm:mt-2">
            <input
              id="code"
              name="code"
              type="text"
              v-model="code"
              required
              class="block w-full rounded-md border-0 px-3 py-2 text-sm sm:text-base text-white bg-[#18181B] shadow-sm ring-1 ring-inset ring-[#23272F] placeholder:text-[#B0B3B8] focus:ring-2 focus:ring-inset focus:ring-[#21C063] focus:outline-none"
            />
          </div>
          <p v-if="validationErrors.code" class="mt-1 sm:mt-2 text-xs sm:text-sm text-[#EF4444]">
            {{ validationErrors.code }}
          </p>
        </div>
        <div>
          <label for="newPassword" class="block text-xs sm:text-sm font-medium text-[#B0B3B8]">New Password</label>
          <div class="mt-1 sm:mt-2 relative">
            <input
              id="newPassword"
              name="newPassword"
              :type="isPasswordVisible ? 'text' : 'password'"
              v-model="newPassword"
              required
              class="block w-full rounded-md border-0 px-3 py-2 text-sm sm:text-base text-white bg-[#18181B] shadow-sm ring-1 ring-inset ring-[#23272F] placeholder:text-[#B0B3B8] focus:ring-2 focus:ring-inset focus:ring-[#21C063] focus:outline-none"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-xs sm:text-sm text-[#B0B3B8] hover:text-[#21C063] focus:outline-none"
            >
              {{ isPasswordVisible ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p v-if="validationErrors.password" class="mt-1 sm:mt-2 text-xs sm:text-sm text-[#EF4444]">
            {{ validationErrors.password }}
          </p>
        </div>
        <div>
          <label for="confirmPassword" class="block text-xs sm:text-sm font-medium text-[#B0B3B8]">Confirm New Password</label>
          <div class="mt-1 sm:mt-2 relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              :type="isPasswordVisible ? 'text' : 'password'"
              v-model="confirmPassword"
              required
              class="block w-full rounded-md border-0 px-3 py-2 text-sm sm:text-base text-white bg-[#18181B] shadow-sm ring-1 ring-inset ring-[#23272F] placeholder:text-[#B0B3B8] focus:ring-2 focus:ring-inset focus:ring-[#21C063] focus:outline-none"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-xs sm:text-sm text-[#B0B3B8] hover:text-[#21C063] focus:outline-none"
            >
              {{ isPasswordVisible ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p v-if="validationErrors.confirmPassword" class="mt-1 sm:mt-2 text-xs sm:text-sm text-[#EF4444]">
            {{ validationErrors.confirmPassword }}
          </p>
        </div>
        <div v-if="errorMessage" class="text-center text-xs sm:text-sm text-[#EF4444]">
          {{ errorMessage }}
        </div>
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex w-full justify-center rounded-md bg-[#21C063] px-3 py-2 text-sm sm:text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#16994A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21C063] disabled:cursor-not-allowed disabled:opacity-50"
            :class="{ 'animate-pulse': isLoading }"
          >
            {{ isLoading ? 'Resetting...' : 'Reset Password' }}
          </button>
        </div>
        <div class="text-center">
          <button
            type="button"
            :disabled="!canResendCode"
            @click="handleResendCode"
            class="text-xs sm:text-sm font-medium text-[#B0B3B8] hover:text-[#21C063] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ canResendCode ? 'Resend verification code' : `Resend code in ${countdown}s` }}
          </button>
        </div>
      </form>
      <p class="mt-6 sm:mt-10 text-center text-xs sm:text-sm text-[#B0B3B8]">
        Remembered your password?
        <RouterLink
          to="/login"
          class="font-semibold text-[#21C063] hover:underline"
        >
          Back to Sign In
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.reset-password-page {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: center;
}
</style>