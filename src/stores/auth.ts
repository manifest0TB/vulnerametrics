// src/stores/auth.ts
import { defineStore } from 'pinia';
// Import Amplify Auth functions and types directly for v6+
import {
  signIn,
  signOut,
  signUp,
  getCurrentUser,
  fetchUserAttributes,
  resetPassword,
  confirmResetPassword,
  confirmSignUp,
  type AuthUser,
  type FetchUserAttributesOutput,
  type SignInOutput,
  type SignUpOutput
} from 'aws-amplify/auth';

interface AuthState {
  user: AuthUser | null;
  userAttributes: FetchUserAttributesOutput | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
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
    async checkAuth(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const user = await getCurrentUser();
        const attributes = await fetchUserAttributes();
        this.user = user;
        this.userAttributes = attributes;
        this.isAuthenticated = true;
      } catch (error) {
        console.error('Auth check error:', error);
        this.user = null;
        this.userAttributes = null;
        this.isAuthenticated = false;
        this.error = error instanceof Error ? error.message : 'Authentication error';
      } finally {
        this.loading = false;
      }
    },

    async login(username: string, password: string): Promise<SignInOutput> {
      this.loading = true;
      this.error = null;
      try {
        const result = await signIn({ username, password });
        await this.checkAuth();
        return result;
      } catch (error) {
        console.error('Login error:', error);
        this.error = error instanceof Error ? error.message : 'Login failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        await signOut({ global: true });
        this.user = null;
        this.userAttributes = null;
        this.isAuthenticated = false;
      } catch (error) {
        console.error('Logout error:', error);
        this.error = error instanceof Error ? error.message : 'Logout failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(username: string, password: string, email: string, nickname: string): Promise<SignUpOutput> {
      this.loading = true;
      this.error = null;
      try {
        const result = await signUp({
          username,
          password,
          options: {
            userAttributes: {
              email,
              nickname
            }
          }
        });
        if (result.isSignUpComplete) {
          const user = await getCurrentUser();
          this.user = user;
          this.isAuthenticated = true;
        }
        return result;
      } catch (error) {
        console.error('Registration error:', error);
        this.error = error instanceof Error ? error.message : 'Registration failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async confirmRegistration(username: string, code: string): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        await confirmSignUp({
          username,
          confirmationCode: code
        });
      } catch (error) {
        console.error('Confirmation error:', error);
        this.error = error instanceof Error ? error.message : 'Confirmation failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async forgotPassword(email: string) {
      this.loading = true;
      this.error = null;
      try {
        await resetPassword({ username: email });
        this.error = 'If an account exists with this email, you will receive a verification code.';
      } catch (error) {
        console.error('Error in forgot password:', error);
        this.error = 'Failed to send verification code. Please try again.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async confirmSignUp(username: string, code: string) {
      this.loading = true;
      this.error = null;
      try {
        await confirmSignUp({
          username,
          confirmationCode: code
        });
      } catch (error) {
        console.error('Error in confirm sign up:', error);
        this.error = 'Failed to confirm account. Please try again.';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(username: string, code: string, newPassword: string): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        await confirmResetPassword({
          username,
          confirmationCode: code,
          newPassword
        });
      } catch (error) {
        console.error('Reset password error:', error);
        this.error = error instanceof Error ? error.message : 'Password reset failed';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});