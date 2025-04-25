// src/router/index.ts

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { getCurrentUser } from 'aws-amplify/auth'

// Import view components
// It's good practice to use dynamic imports for route components (code splitting),
// but for simplicity in this initial setup, we'll use static imports.
// We can optimize this later.
import HomePage from '@/views/HomePage.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import ConfirmRegistrationPage from '@/views/ConfirmRegistrationPage.vue'
import ForgotPasswordPage from '@/views/ForgotPasswordPage.vue'
import ResetPasswordPage from '@/views/ResetPasswordPage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'
import PrivacyPolicyPage from '@/views/PrivacyPolicyPage.vue'
import TermsOfServicePage from '@/views/TermsOfServicePage.vue'

// Define application routes
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/confirm-registration',
    name: 'ConfirmRegistration',
    component: ConfirmRegistrationPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    component: PrivacyPolicyPage,
  },
  {
    path: '/terms-of-service',
    name: 'TermsOfService',
    component: TermsOfServicePage,
  },
  {
    // Catch-all route for 404 Not Found pages
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
  },
]

// Create the router instance
const router = createRouter({
  // Use HTML5 history mode (no hash in URLs)
  // This requires server-side configuration for single-page applications.
  // AWS Amplify Hosting handles this automatically with its rewrite rules.
  history: createWebHistory(import.meta.env.BASE_URL),
  routes, // short for `routes: routes`
})

// Navigation guard
router.beforeEach(async (to, _from, next) => {
  try {
    const user = await getCurrentUser()
    const isAuthenticated = !!user

    // Handle routes that require authentication
    if (to.meta.requiresAuth && !isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }

    // Handle routes that require guest status
    if (to.meta.requiresGuest && isAuthenticated) {
      next({ name: 'Home' })
      return
    }

    next()
  } catch (error) {
    // If there's an error checking auth status, treat as not authenticated
    if (to.meta.requiresAuth) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  }
})

// Export the router instance to be used in the main application file
export default router