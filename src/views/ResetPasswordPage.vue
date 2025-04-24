<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { validateVerificationCode, validatePassword } from '@/utils/inputValidation';

// Initialize store, router, and route
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// Password validation pattern
const passwordPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$';

// Local reactive state for form inputs and validation
const email = ref<string>('');
const code = ref<string>('');
const newPassword = ref<string>('');
const confirmPassword = ref<string>('');
const validationErrors = ref<{ [key: string]: string | undefined }>({});

// State for password visibility toggle
const isPasswordVisible = ref<boolean>(false);

// Local state for password mismatch error
const passwordMismatch = ref<boolean>(false);

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

// Add password requirements display
const passwordRequirements = [
  'Contains at least 8 characters',
  'Contains at least 1 number',
  'Contains at least 1 lowercase letter',
  'Contains at least 1 uppercase letter',
  'Contains at least 1 special character'
];

// Add reactive validation for password requirements
const passwordMeetsRequirements = computed(() => {
  if (!newPassword.value) return false;
  return validatePassword(newPassword.value).isValid;
});
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-800">
        Set your new password
      </h2>
      <div v-if="email" class="mt-2 text-center">
        <p class="text-sm text-gray-600">
          Enter the verification code sent to:
        </p>
        <p class="mt-1 text-sm">
          <strong class="font-medium text-gray-800 block">{{ email }}</strong>
          <RouterLink
            to="/forgot-password"
            class="mt-1 inline-block text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            (Change email)
          </RouterLink>
        </p>
      </div>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <form class="space-y-6" @submit.prevent="handleResetPassword">
        <!-- Verification Code Input -->
        <div>
          <label for="code" class="block text-sm font-medium leading-6 text-gray-700">
            Verification Code
          </label>
          <div class="mt-2">
            <input
              id="code"
              name="code"
              type="text"
              inputmode="numeric"
              v-model="code"
              required
              maxlength="6"
              pattern="[0-9]{6}"
              class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
            />
          </div>
          <p v-if="validationErrors.code" class="mt-2 text-sm text-red-600">
            {{ validationErrors.code }}
          </p>
        </div>

        <!-- New Password Input -->
        <div>
          <label for="new-password" class="block text-sm font-medium leading-6 text-gray-700">
            New Password
          </label>
          <div class="relative mt-2">
            <input
              id="new-password"
              name="new-password"
              :type="isPasswordVisible ? 'text' : 'password'"
              v-model="newPassword"
              required
              maxlength="256"
              :pattern="passwordPattern"
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
          <p v-if="validationErrors.password" class="mt-2 text-sm text-red-600">
            {{ validationErrors.password }}
          </p>
        </div>

        <!-- Confirm New Password Input -->
        <div>
          <label for="confirm-password" class="block text-sm font-medium leading-6 text-gray-700">
            Confirm New Password
          </label>
          <div class="relative mt-2">
            <input
              id="confirm-password"
              name="confirm-password"
              :type="isPasswordVisible ? 'text' : 'password'"
              v-model="confirmPassword"
              required
              maxlength="256"
              :pattern="passwordPattern"
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
          <p v-if="validationErrors.confirmPassword" class="mt-2 text-sm text-red-600">
            {{ validationErrors.confirmPassword }}
          </p>
        </div>

        <!-- Password Requirements Display -->
        <div class="mt-2 space-y-1">
          <p class="text-sm font-medium text-gray-700">Password requirements:</p>
          <ul class="text-xs text-gray-600 space-y-1">
            <li>At least 8 characters long</li>
            <li>Contains at least 1 number</li>
            <li>Contains at least 1 lowercase letter</li>
            <li>Contains at least 1 uppercase letter</li>
            <li>Contains at least 1 special character</li>
          </ul>
        </div>

        <!-- Error/Success Messages -->
        <div v-if="errorMessage" class="text-center text-sm" :class="{
          'text-red-600': !errorMessage.includes('successfully'),
          'text-green-600': errorMessage.includes('successfully')
        }">
          {{ errorMessage }}
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex w-full justify-center rounded-md bg-gray-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition-colors hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            :class="{ 'animate-pulse': isLoading }"
          >
            {{ isLoading ? 'Resetting Password...' : 'Reset Password' }}
          </button>
        </div>

        <!-- Resend Code Section -->
        <div class="text-center">
          <button
            type="button"
            :disabled="!canResendCode"
            @click="handleResendCode"
            class="text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ canResendCode ? 'Resend verification code' : `Resend code in ${countdown}s` }}
          </button>
        </div>
      </form>
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