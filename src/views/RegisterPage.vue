<script setup lang="ts">
// src/views/RegisterPage.vue
import { ref, computed } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Import the auth store
import { validateNickname, validateEmail, validatePassword } from '@/utils/inputValidation';

// Initialize store and router
const authStore = useAuthStore();
const router = useRouter();

// Validation patterns
const emailPattern = '^[^<>\'"`;\{\}%]*$';

// Local reactive state for form inputs
const nickname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref<string>('');
const validationErrors = ref<{ [key: string]: string | undefined }>({});

// Terms acceptance state
const acceptTerms = ref<boolean>(false);
const acceptPrivacy = ref<boolean>(false);

// State for password visibility toggle
const isPasswordVisible = ref<boolean>(false);

// Local state for password mismatch error
const passwordMismatch = ref<boolean>(false);

// Computed properties from store
const isLoading = computed(() => authStore.loading);
const errorMessage = computed(() => authStore.error);

// Toggle password visibility function
const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

// Handler for form submission
const handleRegister = async () => {
  // Reset validation errors
  validationErrors.value = {};

  // Validate terms acceptance
  if (!acceptTerms.value || !acceptPrivacy.value) {
    validationErrors.value.terms = 'You must accept both the Terms of Service and Privacy Policy to register.';
    return;
  }

  // Validate nickname
  const nicknameValidation = validateNickname(nickname.value);
  if (!nicknameValidation.isValid) {
    validationErrors.value.nickname = nicknameValidation.error;
    return;
  }

  // Validate email
  const emailValidation = validateEmail(email.value);
  if (!emailValidation.isValid) {
    validationErrors.value.email = emailValidation.error;
    return;
  }

  // Validate password
  const passwordValidation = validatePassword(password.value);
  if (!passwordValidation.isValid) {
    validationErrors.value.password = passwordValidation.error;
    return;
  }

  passwordMismatch.value = false;

  // Basic client-side validation
  if (password.value !== confirmPassword.value) {
    passwordMismatch.value = true;
    authStore.error = null;
    return;
  }

  console.log('Registration attempt with:', { 
    nickname: nickname.value, 
    email: email.value,
    acceptTerms: acceptTerms.value,
    acceptPrivacy: acceptPrivacy.value
  });

  try {
    // Call the actual register action from the auth store
    const result = await authStore.register(email.value, password.value, email.value, nickname.value);

    console.log('Register action result:', result);

    if ('isSignUpComplete' in result) {
      if (result.isSignUpComplete) {
        console.log('Registration complete and user likely auto-signed in. Redirecting home...');
        router.push({ name: 'Home' });
      } else {
        console.log('Registration initiated, confirmation required. Redirecting...');
        router.push({ name: 'ConfirmRegistration', query: { email: email.value, nickname: nickname.value } });
      }
    } else {
      console.log('Registration initiated, confirmation required. Redirecting...');
      router.push({ name: 'ConfirmRegistration', query: { email: email.value, nickname: nickname.value } });
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
};

</script>

<template>
  <div class="flex min-h-full flex-col px-6 py-8 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-800">
        Create your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
      <form class="space-y-6" @submit.prevent="handleRegister">
        <div>
          <label for="nickname" class="block text-sm font-medium leading-6 text-gray-700">Nickname</label>
          <div class="mt-2">
            <input 
              id="nickname" 
              name="nickname" 
              type="text" 
              v-model="nickname" 
              required
              minlength="4"
              maxlength="20"
              pattern="[a-zA-Z0-9_-]*"
              class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6" 
            />
          </div>
          <p v-if="validationErrors.nickname" class="mt-2 text-sm text-red-600">
            {{ validationErrors.nickname }}
          </p>
          <p class="mt-1 text-xs text-gray-500">
            Nickname must be between 4 and 20 characters and can only contain letters, numbers, underscores, and hyphens.
          </p>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-700">Email address</label>
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
          <p v-if="validationErrors.email" class="mt-2 text-sm text-red-600">
            {{ validationErrors.email }}
          </p>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium leading-6 text-gray-700">Password</label>
          <div class="relative mt-2">
            <input 
              id="password" 
              name="password" 
              :type="isPasswordVisible ? 'text' : 'password'" 
              v-model="password" 
              required
              maxlength="256"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$"
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

        <div>
          <label for="confirm-password" class="block text-sm font-medium leading-6 text-gray-700">Confirm Password</label>
          <div class="relative mt-2">
             <input id="confirm-password" name="confirm-password" :type="isPasswordVisible ? 'text' : 'password'" v-model="confirmPassword" autocomplete="new-password" required class="block w-full rounded-md border-0 px-3 py-1.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6" />
             <button type="button" @click="togglePasswordVisibility" class="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none" aria-label="Toggle password visibility">{{ isPasswordVisible ? 'Hide' : 'Show' }}</button>
          </div>
           <p v-if="passwordMismatch" class="mt-2 text-sm text-red-600">Passwords do not match.</p>
        </div>

        <!-- Terms and Privacy Policy Acceptance -->
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="flex h-6 items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                v-model="acceptTerms"
                required
                class="h-4 w-4 rounded border-gray-300 text-gray-700 focus:ring-gray-600"
              />
            </div>
            <div class="ml-3 text-sm leading-6">
              <label for="terms" class="font-medium text-gray-700">
                I accept the
                <RouterLink to="/terms" class="text-gray-600 hover:text-gray-800 underline">Terms of Service</RouterLink>
              </label>
            </div>
          </div>

          <div class="flex items-start">
            <div class="flex h-6 items-center">
              <input
                id="privacy"
                name="privacy"
                type="checkbox"
                v-model="acceptPrivacy"
                required
                class="h-4 w-4 rounded border-gray-300 text-gray-700 focus:ring-gray-600"
              />
            </div>
            <div class="ml-3 text-sm leading-6">
              <label for="privacy" class="font-medium text-gray-700">
                I accept the
                <RouterLink to="/privacy" class="text-gray-600 hover:text-gray-800 underline">Privacy Policy</RouterLink>
              </label>
            </div>
          </div>

          <p v-if="validationErrors.terms" class="mt-2 text-sm text-red-600">
            {{ validationErrors.terms }}
          </p>
        </div>

        <div v-if="errorMessage && !passwordMismatch" class="text-center text-sm text-red-600">
          {{ errorMessage }}
        </div>

        <div>
          <button type="submit" :disabled="isLoading" class="flex w-full justify-center rounded-md bg-gray-700 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition-colors hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700 disabled:cursor-not-allowed disabled:opacity-50" :class="{ 'animate-pulse': isLoading }">
            {{ isLoading ? 'Registering...' : 'Create Account' }}
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-500">
        Already have an account?
        {{ ' ' }}
        <RouterLink to="/login" class="font-semibold leading-6 text-gray-600 hover:text-gray-800">Sign In</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Styles removed - using Tailwind */
</style>