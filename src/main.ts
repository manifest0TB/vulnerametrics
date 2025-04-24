// src/main.ts
import { createApp } from 'vue'
import { Amplify } from 'aws-amplify'
import { createPinia } from 'pinia'
import { generateClient } from 'aws-amplify/api'
import App from './App.vue'
import router from './router/index.ts'
import './styles/main.css'

// --- AWS Amplify Configuration ---
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_WEB_CLIENT_ID,
      identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID,
    }
  },
  API: {
    REST: {
      VulnerametricsAPI: {
        endpoint: import.meta.env.VITE_API_GATEWAY_ENDPOINT,
        region: import.meta.env.VITE_AWS_REGION
      }
    }
  }
}

// Basic validation to ensure variables are loaded
if (!amplifyConfig.Auth.Cognito.userPoolId || !amplifyConfig.API.REST.VulnerametricsAPI.endpoint || !amplifyConfig.Auth.Cognito.userPoolClientId || !amplifyConfig.Auth.Cognito.identityPoolId || !amplifyConfig.API.REST.VulnerametricsAPI.region) {
   console.error("ERROR: Missing one or more required environment variables for Amplify configuration.")
} else {
   console.log("Amplify configuration loaded from environment variables.")
   Amplify.configure(amplifyConfig)
   console.log("Amplify configured successfully.")
}

// --- Error Handling Configuration ---
const app = createApp(App)

// Global error handler
app.config.errorHandler = (err: unknown, vm: unknown, info: string) => {
  console.error('Global error:', err)
  console.error('Error info:', info)
}

// API Client setup
const client = generateClient()

// Create Pinia instance
const pinia = createPinia()

// Use Vue Router
app.use(router)

// Use Pinia for state management
app.use(pinia)

// Mount the application
app.mount('#app')