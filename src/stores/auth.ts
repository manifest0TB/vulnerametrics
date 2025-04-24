// src/stores/auth.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
// Import Amplify Auth functions and types directly for v6+
import {
  signIn,
  signOut,
  signUp,
  getCurrentUser,
  fetchUserAttributes,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  confirmSignUp,
  type AuthUser,
  type FetchUserAttributesOutput,
  type GetCurrentUserOutput,
  type SignInOutput,
  type SignUpOutput,
  type SignUpInput,
  type ResendSignUpCodeOutput
} from 'aws-amplify/auth';

// Define a type for the user data we want to store
interface AppUser {
  userId: string; // From getCurrentUser().userId (Cognito Sub)
  username: string; // From getCurrentUser().username
  attributes: FetchUserAttributesOutput; // Includes email, nickname, etc.
}

interface AuthState {
  user: AuthUser | null
  userAttributes: FetchUserAttributesOutput | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    userAttributes: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    getUser: (state) => state.user,
    getUserAttributes: (state) => state.userAttributes,
    getIsAuthenticated: (state) => state.isAuthenticated,
    getLoading: (state) => state.loading,
    getError: (state) => state.error
  },

  actions: {
    async checkAuth() {
      this.loading = true
      this.error = null
      try {
        const user = await getCurrentUser()
        const attributes = await fetchUserAttributes()
        this.user = user
        this.userAttributes = attributes
        this.isAuthenticated = true
      } catch (error) {
        this.user = null
        this.userAttributes = null
        this.isAuthenticated = false
        this.error = error instanceof Error ? error.message : 'Authentication error'
      } finally {
        this.loading = false
      }
    },

    async login(username: string, password: string) {
      this.loading = true
      this.error = null
      try {
        const { isSignedIn, nextStep } = await signIn({ username, password })
        if (isSignedIn) {
          const user = await getCurrentUser()
          const attributes = await fetchUserAttributes()
          this.user = user
          this.userAttributes = attributes
          this.isAuthenticated = true
          return user
        }
        throw new Error(`Login requires next step: ${nextStep.signInStep}`)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      this.error = null
      try {
        await signOut()
        this.user = null
        this.userAttributes = null
        this.isAuthenticated = false
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Logout failed'
        throw error
     } finally {
        this.loading = false
      }
    },

    async register(username: string, password: string, email: string, nickname: string) {
      this.loading = true
      this.error = null
      try {
        const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
          password,
          options: {
            userAttributes: {
              email,
              nickname
            }
          }
        })
        if (isSignUpComplete) {
          const user = await getCurrentUser()
          this.user = user
          this.isAuthenticated = true
          return user
        }
        return { userId, nextStep }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Registration failed'
        throw error
    } finally {
        this.loading = false
      }
    },

    async confirmRegistration(username: string, code: string) {
      this.loading = true
      this.error = null
      try {
        await confirmSignUp({
          username,
          confirmationCode: code
        })
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Confirmation failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async forgotPassword(username: string) {
      this.loading = true
      this.error = null
      try {
        await resetPassword({ username })
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Password reset request failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    async resetPassword(username: string, code: string, newPassword: string) {
      this.loading = true
      this.error = null
      try {
      await confirmResetPassword({
        username,
        confirmationCode: code,
          newPassword
        })
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Password reset failed'
        throw error
      } finally {
        this.loading = false
      }
    }
  }
});