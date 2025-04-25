// src/main.ts
import { createApp } from 'vue'
import { Amplify } from 'aws-amplify'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.ts'
import './styles/main.css'

// --- AWS Amplify Configuration ---
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID as string,
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_WEB_CLIENT_ID as string,
      identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID as string,
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
        phone: false,
        username: true
      }
    },
    cookieStorage: {
      domain: window.location.hostname,
      path: '/',
      expires: 365,
      secure: true,
      sameSite: 'strict'
    },
    tokenProvider: {
      storage: 'cookieStorage'
    },
    oauth: {
      domain: import.meta.env.VITE_COGNITO_DOMAIN as string,
      scope: ['email', 'openid', 'profile'],
      redirectSignIn: window.location.origin,
      redirectSignOut: window.location.origin,
      responseType: 'code'
    }
  },
  API: {
    REST: {
      VulnerametricsAPI: {
        endpoint: 'https://wg77sau8q5.execute-api.us-east-1.amazonaws.com/prod',
        region: 'us-east-1'
      }
    }
  }
}

// Basic validation to ensure variables are loaded
if (!amplifyConfig.Auth.Cognito.userPoolId || !amplifyConfig.Auth.Cognito.userPoolClientId || !amplifyConfig.Auth.Cognito.identityPoolId) {
   console.error("ERROR: Missing one or more required environment variables for Amplify configuration.")
} else {
   console.log("Amplify configuration loaded from environment variables.")
   Amplify.configure(amplifyConfig)
   console.log("Amplify configured successfully.")
}

// --- Error Handling Configuration ---
const app = createApp(App)

// Global error handler
app.config.errorHandler = (err: unknown, _vm: unknown, info: string) => {
  console.error('Global error:', err)
  console.error('Error info:', info)
}

// Create Pinia instance
const pinia = createPinia()

// Use Vue Router
app.use(router)

// Use Pinia for state management
app.use(pinia)

// Mount the application
app.mount('#app')