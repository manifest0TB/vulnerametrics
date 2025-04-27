<script setup lang="ts">
// src/views/RegisterPage.vue
import { ref, computed } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Import the auth store
import { validateNickname, validateEmail, validatePassword } from '@/utils/inputValidation';

// Initialize store and router
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

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

    const redirect = route.query.redirect as string | undefined;

    if ('isSignUpComplete' in result) {
      if (result.isSignUpComplete) {
        console.log('Registration complete and user likely auto-signed in. Redirecting...');
        if (redirect) {
          router.push(redirect);
        } else {
          router.push({ name: 'Home' });
        }
      } else {
        console.log('Registration initiated, confirmation required. Redirecting...');
        router.push({ name: 'ConfirmRegistration', query: { email: email.value, nickname: nickname.value, ...(redirect ? { redirect } : {}) } });
      }
    } else {
      console.log('Registration initiated, confirmation required. Redirecting...');
      router.push({ name: 'ConfirmRegistration', query: { email: email.value, nickname: nickname.value, ...(redirect ? { redirect } : {}) } });
    }
  } catch (error) {
    console.error('Registration error:', error);
  }
};

</script>

<template>
  <div class="flex min-h-full flex-col px-6 py-8 lg:px-8 bg-[#161717]" style="font-family: 'Roboto', sans-serif;">
    <div class="sm:mx-auto sm:w-full sm:max-w-md bg-[#23272F] rounded-2xl shadow-lg p-10">
      <h2 class="text-center text-3xl font-bold text-white mb-6">Create your account</h2>
      <form class="space-y-6" @submit.prevent="handleRegister">
        <div>
          <label for="nickname" class="block text-sm font-medium text-[#B0B3B8]">Nickname</label>
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
              class="block w-full rounded-md border-0 px-3 py-2 text-white bg-[#18181B] shadow-sm ring-1 ring-inset ring-[#23272F] placeholder:text-[#B0B3B8] focus:ring-2 focus:ring-inset focus:ring-[#21C063] focus:outline-none sm:text-base"
            />
          </div>
          <p v-if="validationErrors.nickname" class="mt-2 text-sm text-[#EF4444]">
            {{ validationErrors.nickname }}
          </p>
          <p class="mt-1 text-xs text-[#B0B3B8]">
            Nickname must be between 4 and 20 characters and can only contain letters, numbers, underscores, and hyphens.
          </p>
        </div>
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
              maxlength="254"
              :pattern="emailPattern"
              class="block w-full rounded-md border-0 px-3 py-2 text-white bg-[#18181B] shadow-sm ring-1 ring-inset ring-[#23272F] placeholder:text-[#B0B3B8] focus:ring-2 focus:ring-inset focus:ring-[#21C063] focus:outline-none sm:text-base"
            />
          </div>
          <p v-if="validationErrors.email" class="mt-2 text-sm text-[#EF4444]">
            {{ validationErrors.email }}
          </p>
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-[#B0B3B8]">Password</label>
          <div class="relative mt-2">
            <input
              id="password"
              name="password"
              :type="isPasswordVisible ? 'text' : 'password'"
              v-model="password"
              required
              maxlength="256"
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$"
              class="block w-full rounded-md border-0 px-3 py-2 pr-10 text-white bg-[#18181B] shadow-sm ring-1 ring-inset ring-[#23272F] placeholder:text-[#B0B3B8] focus:ring-2 focus:ring-inset focus:ring-[#21C063] focus:outline-none sm:text-base"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5 text-[#B0B3B8] hover:text-[#21C063] focus:outline-none"
            >
              {{ isPasswordVisible ? 'Hide' : 'Show' }}
            </button>
          </div>
          <p v-if="validationErrors.password" class="mt-2 text-sm text-[#EF4444]">
            {{ validationErrors.password }}
          </p>
        </div>
        <div class="mt-2 space-y-1">
          <p class="text-sm font-medium text-[#B0B3B8]">Password requirements:</p>
          <ul class="text-xs text-[#B0B3B8] space-y-1">
            <li>At least 8 characters long</li>
            <li>Contains at least 1 number</li>
            <li>Contains at least 1 lowercase letter</li>
            <li>Contains at least 1 uppercase letter</li>
            <li>Contains at least 1 special character</li>
          </ul>
        </div>
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-[#B0B3B8]">Confirm Password</label>
          <div class="mt-2">
            <input
              id="confirmPassword"
              name="confirmPassword"
              :type="isPasswordVisible ? 'text' : 'password'"
              v-model="confirmPassword"
              required
              maxlength="256"
              class="block w-full rounded-md border-0 px-3 py-2 text-white bg-[#18181B] shadow-sm ring-1 ring-inset ring-[#23272F] placeholder:text-[#B0B3B8] focus:ring-2 focus:ring-inset focus:ring-[#21C063] focus:outline-none sm:text-base"
            />
          </div>
          <p v-if="passwordMismatch" class="mt-2 text-sm text-[#EF4444]">
            Passwords do not match
          </p>
        </div>
        <div class="flex flex-col items-center space-y-2 mt-4">
          <label class="flex items-center gap-2 text-sm text-[#B0B3B8]">
            <input type="checkbox" v-model="acceptTerms" required class="h-4 w-4 accent-[#21C063]" />
            I accept the
            <RouterLink to="/terms" class="underline hover:text-[#21C063] ml-1">Terms of Service</RouterLink>
          </label>
          <label class="flex items-center gap-2 text-sm text-[#B0B3B8]">
            <input type="checkbox" v-model="acceptPrivacy" required class="h-4 w-4 accent-[#21C063]" />
            I accept the
            <RouterLink to="/privacy" class="underline hover:text-[#21C063] ml-1">Privacy Policy</RouterLink>
          </label>
        </div>
        <p v-if="validationErrors.terms" class="mt-2 text-sm text-[#EF4444]">
          {{ validationErrors.terms }}
        </p>
        <div v-if="errorMessage && !passwordMismatch" class="text-center text-sm text-[#EF4444]">
          {{ errorMessage }}
        </div>
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="flex w-full justify-center rounded-md bg-[#21C063] px-3 py-2 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#16994A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21C063] disabled:cursor-not-allowed disabled:opacity-50"
            :class="{ 'animate-pulse': isLoading }"
          >
            {{ isLoading ? 'Registering...' : 'Register' }}
          </button>
        </div>
      </form>
      <p class="mt-10 text-center text-sm text-[#B0B3B8]">
        Already have an account?
        <RouterLink
          :to="{ name: 'Login', query: route.query.redirect ? { redirect: route.query.redirect } : undefined }"
          class="font-semibold text-[#21C063] hover:underline"
        >
          Sign in here
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Styles removed - using Tailwind */
</style>