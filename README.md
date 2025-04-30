# Vulnerametrics Frontend Documentation
NOTE: the general documentation is [here](https://github.com/manifest0TB/vulnerametrics-lambda-functions/blob/main/README.md#vulnerametrics)
![doc_reference](https://drive.google.com/file/d/1okRClAGmHmrsGPmRlwSoOZyWLfFU4i9E/view?usp=sharing)

## Overview
The Vulnerametrics frontend is a Vue.js application that provides a user interface for searching and generating CVE reports. It integrates with AWS services through a REST API and implements user authentication via Amazon Cognito.

## Project Structure

### Core Directories
* `src/` - Main source code directory
* `assets/` - Static assets (images, icons, etc.)
* `components/` - Reusable Vue components
* `views/` - Page-level components
* `router/` - Vue Router configuration
* `stores/` - State management (Pinia)
* `services/` - API and service integrations
* `utils/` - Utility functions
* `types/` - TypeScript type definitions
* `styles/` - Global styles and Tailwind configuration

### Key Files
* `main.ts` - Application entry point
* `App.vue` - Root component
* `vite.config.ts` - Vite configuration
* `tailwind.config.js` - Tailwind CSS configuration
* `.env` - Environment variables

## Authentication Flow
The frontend implements authentication using Amazon Cognito through the following flow:

* User registration with email verification
* Login with email and password
* Session management
* Protected route handling

## Main Features

### CVE Search
* Search interface for CVE IDs (e.g., CVE-2024-1234)
* Frontend validation for CVE ID format
* Integration with backend API for CVE data retrieval
* Loading state management during API calls

### Report Generation
* Report generation request handling
* Credit system integration
* PDF download functionality
* Error handling for insufficient credits

### User Credits
* Credit balance display
* Integration with DynamoDB through API
* Free trial credit management (3 initial credits)

## Technical Stack
* Vue.js 3 with TypeScript
* Vite as build tool
* Tailwind CSS for styling
* Pinia for state management
* Vue Router for navigation
* AWS Amplify for authentication
* Axios for API communication

## Environment Configuration
The application uses environment variables for configuration:
* AWS Region (VITE\_AWS\_REGION)
* Cognito User Pool ID (VITE\_COGNITO\_USER\_POOL\_ID)
* Cognito Web Client ID (VITE\_COGNITO\_USER\_POOL\_WEB\_CLIENT\_ID)
* Cognito Identity Pool ID (VITE\_COGNITO\_IDENTITY\_POOL\_ID)
* Cognito Domain (VITE\_COGNITO\_DOMAIN)
* API Gateway Endpoint (VITE\_API\_GATEWAY\_ENDPOINT)
* S3 Report Bucket (VITE\_S3\_REPORT\_BUCKET)

## Development Guidelines
* Follow TypeScript best practices
* Use component-based architecture
* Implement proper error handling
* Follow Vue.js composition API patterns
* Maintain consistent styling with Tailwind CSS

## Security Considerations
* All API calls are authenticated
* CORS is configured for specific origins
* Sensitive data is handled securely
* API keys are managed through environment variables

## Integration Points
* AWS Cognito for authentication
* REST API for CVE data and report generation
* S3 for report storage
* DynamoDB for credit management

## Build and Deployment
The application is deployed using AWS Amplify with the following configuration:

* Base directory: `/dist`
* Build settings: Vue.js specific
* Custom domain: vulnerametrics.com
* SSL certificate management
* Automatic deployments from GitHub

This documentation is based on the project's current structure and the general scope document. It provides a high-level overview of the frontend implementation while maintaining alignment with the backend services and overall architecture described in the project scope.