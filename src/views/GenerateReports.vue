<script setup lang="ts">
// src/views/GenerateReports.vue
import { ref, computed, onUnmounted, watch } from 'vue';
import { useCreditsStore } from '@/stores/credits';
import { apiService } from '@/services/api';
import type { CveDetails, ApiError } from '@/types/api';
import { getUrl } from 'aws-amplify/storage';
import { useAuthStore } from '@/stores/auth';
import { RouterLink } from 'vue-router';

// Initialize stores
const creditsStore = useCreditsStore();
const authStore = useAuthStore();

// Local state
const cveIdInput = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);
const cveDetails = ref<CveDetails | null>(null);
const isGeneratingReport = ref(false);
const reportUrl = ref<string | null>(null);

// Message and animated color for report generation loading
const loadingMessages = [
  'Generating your report…',
  'AI is analyzing the vulnerability…',
  'Almost there! Preparing your PDF…'
];
const loadingColors = [
  'text-[#21C063]',
  'text-[#38BDF8]',
  'text-[#F59E42]'
];
const loadingMessage = ref(loadingMessages[0]);
const loadingColorClass = ref(loadingColors[0]);
let loadingInterval: number | null = null;

watch(
  () => isGeneratingReport.value,
  (newVal) => {
    if (newVal) {
      let i = 0;
      loadingInterval = window.setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        loadingMessage.value = loadingMessages[i];
        loadingColorClass.value = loadingColors[i];
      }, 2000);
    } else if (loadingInterval) {
      clearInterval(loadingInterval);
      loadingInterval = null;
      loadingMessage.value = loadingMessages[0];
      loadingColorClass.value = loadingColors[0];
    }
  }
);
onUnmounted(() => {
  if (loadingInterval) clearInterval(loadingInterval);
});

// Computed properties
const hasEnoughCredits = computed(() => (creditsStore.credits ?? 0) > 0);
const canGenerateReport = computed(() => cveDetails.value && hasEnoughCredits.value);

const userName = computed(() => {
  // Try to get the nickname, otherwise the username
  return (
    authStore.userAttributes?.nickname ||
    authStore.userAttributes?.email ||
    authStore.user?.username ||
    'User'
  );
});

// Validation function for CVE ID format
const isValidCveFormat = (cveId: string): boolean => {
  return /^CVE-\d{4}-\d{4,}$/i.test(cveId);
};

// Handler for CVE search
const handleSearch = async () => {
  if (!isValidCveFormat(cveIdInput.value)) {
    error.value = 'Invalid CVE format. Expected format: CVE-YYYY-NNNN...';
    return;
  }

  isLoading.value = true;
  error.value = null;
  cveDetails.value = null;
  reportUrl.value = null;

  try {
    const details = await apiService.getCveDetails(cveIdInput.value);
    cveDetails.value = details;
  } catch (err) {
    const apiError = err as ApiError;
    error.value = apiError.message || 'Failed to fetch CVE details';
    console.error('Error fetching CVE details:', err);
  } finally {
    isLoading.value = false;
  }
};

// Handler for report generation
const handleGenerateReport = async () => {
  if (!cveDetails.value || !hasEnoughCredits.value) return;

  isGeneratingReport.value = true;
  error.value = null;

  try {
    const reportResponse = await apiService.generateReport(cveIdInput.value);
    // Get the pre-signed URL using Amplify Storage v6
    const { url } = await getUrl({ path: reportResponse.reportKey, options: { expiresIn: 300 } });
    reportUrl.value = url.toString();
    // Refresh credits after generating report
    await creditsStore.fetchCredits();
  } catch (err) {
    const apiError = err as ApiError;
    error.value = apiError.message || 'Failed to generate report';
    console.error('Error generating report:', err);
  } finally {
    isGeneratingReport.value = false;
  }
};

const handleLogout = async () => {
  await authStore.logout();
  // You can redirect if you want
};

// Clean up the blob URL when component is unmounted
onUnmounted(() => {
  if (reportUrl.value) {
    URL.revokeObjectURL(reportUrl.value);
  }
});

// Redirect to login if not authenticated (uncomment if you want)
// const router = useRouter();
// watchEffect(() => {
//   if (!authStore.isAuthenticated) {
//     router.push('/login');
//   }
// });

// Handler to reset the search
const resetSearch = () => {
  cveDetails.value = null;
  reportUrl.value = null;
  error.value = null;
  cveIdInput.value = '';
};
</script>

<template>
  <!-- NAVBAR -->
  <nav class="fixed top-0 left-0 w-full bg-[#161717] shadow z-50 flex items-center justify-between px-8 h-16" style="font-family: 'Roboto', sans-serif;">
    <a href="/" class="flex items-center">
      <img src="@/assets/vmlogo_white.svg" alt="VulneraMetrics Logo" class="h-12 w-auto" />
    </a>
    <div v-if="authStore.isAuthenticated" class="flex items-center space-x-6">
      <span v-if="userName" class="text-white font-medium">Hi, {{ userName }}</span>
      <span v-if="creditsStore.credits !== null" class="text-[#21C063] font-semibold">Credits: {{ creditsStore.credits ?? 0 }}</span>
      <button @click="handleLogout" class="bg-error-text hover:bg-error-text/80 text-white px-4 py-2 rounded-lg shadow transition">Logout</button>
    </div>
    <div v-else class="flex items-center space-x-4">
      <RouterLink
        to="/login"
        class="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg shadow transition"
      >
        Login
      </RouterLink>
      <RouterLink
        to="/register"
        class="bg-dark-card hover:bg-dark-card/80 text-white px-4 py-2 rounded-lg shadow transition"
      >
        Register
      </RouterLink>
    </div>
  </nav>

  <!-- MAIN CONTENT -->
  <div class="pt-24 flex flex-col items-center min-h-screen bg-[#161717]" style="font-family: 'Roboto', sans-serif;">
    <div class="w-full max-w-3xl bg-[#23272F] rounded-3xl shadow-2xl p-16 mb-12 border border-[#23272F] flex flex-col items-center">
      <template v-if="authStore.isAuthenticated">
        <template v-if="!cveDetails && !isGeneratingReport">
          <h2 class="text-4xl font-bold text-white mb-4 text-center">Search CVE</h2>
          <p class="text-[#B0B3B8] mb-10 text-lg text-center">Please, enter a CVE ID (e.g., CVE-2024-1234) to generate an AI-powered report.</p>
        </template>
        <template v-if="!cveDetails">
          <form class="flex flex-col sm:flex-row items-center justify-center w-full gap-4 mb-6" @submit.prevent="handleSearch">
      <input
        type="text"
        v-model="cveIdInput"
              placeholder="CVE-2024-1234"
              class="flex-grow rounded-xl border border-[#23272F] px-6 py-4 text-2xl text-white bg-[#18181B] focus:ring-2 focus:ring-[#21C063] focus:outline-none transition w-full sm:w-auto placeholder-[#B0B3B8]"
              :disabled="!authStore.isAuthenticated"
      />
      <button
        type="submit"
              :disabled="isLoading || !isValidCveFormat(cveIdInput) || !authStore.isAuthenticated"
              class="bg-[#21C063] hover:bg-[#16994A] text-white px-10 py-4 rounded-xl shadow-lg text-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
        :class="{ 'animate-pulse': isLoading }"
      >
        {{ isLoading ? 'Searching...' : 'Search' }}
      </button>
    </form>
        </template>
        <div v-if="error" class="bg-[#2D1B1B] border border-[#EF4444] text-[#EF4444] rounded-lg p-3 mb-4 flex items-center space-x-2">
          <svg class="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          <span>{{ error }}</span>
        </div>
        <template v-if="cveDetails">
          <div class="flex flex-col items-center justify-center w-full relative">
            <!-- Overlay de carga animado -->
            <div v-if="isGeneratingReport" class="absolute inset-0 flex flex-col items-center justify-center bg-[#23272F] bg-opacity-90 rounded-3xl z-10">
              <svg class="animate-spin h-12 w-12 mb-4" :class="loadingColorClass" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <p :class="loadingColorClass" class="text-2xl font-semibold animate-pulse text-center">
                {{ loadingMessage }}
              </p>
            </div>
            <h3 class="text-3xl font-bold text-[#21C063] mb-6 text-center">Vulnerability Found</h3>
            <div class="bg-[#18181B] rounded-xl p-8 mb-6 shadow-sm border border-[#23272F] w-full">
              <h4 class="text-2xl font-medium text-white mb-3 text-center">{{ cveDetails.id }}</h4>
              
              <!-- Basic CVE Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="bg-dark-card rounded-lg p-4">
                  <h5 class="text-sm font-medium text-text-secondary mb-2">Severity</h5>
                  <p class="text-lg font-semibold" :class="{
                    'text-error-text': cveDetails.severity === 'HIGH' || cveDetails.severity === 'CRITICAL',
                    'text-[#F59E42]': cveDetails.severity === 'MEDIUM',
                    'text-[#21C063]': cveDetails.severity === 'LOW'
                  }">
                    {{ cveDetails.severity || 'Not specified' }}
                  </p>
                </div>
                <div class="bg-dark-card rounded-lg p-4">
                  <h5 class="text-sm font-medium text-text-secondary mb-2">Published Date</h5>
                  <p class="text-lg font-semibold text-text-primary">
                    {{ cveDetails.publishedDate ? new Date(cveDetails.publishedDate).toLocaleDateString() : 'Not specified' }}
                  </p>
                </div>
                <div class="bg-dark-card rounded-lg p-4">
                  <h5 class="text-sm font-medium text-text-secondary mb-2">CVSS Score</h5>
                  <p class="text-lg font-semibold" :class="{
                    'text-error-text': cveDetails.cvssScore >= 7.0,
                    'text-[#F59E42]': cveDetails.cvssScore >= 4.0 && cveDetails.cvssScore < 7.0,
                    'text-[#21C063]': cveDetails.cvssScore < 4.0
                  }">
                    {{ cveDetails.cvssScore || 'Not specified' }}
                  </p>
                </div>
                <div class="bg-dark-card rounded-lg p-4">
                  <h5 class="text-sm font-medium text-text-secondary mb-2">Status</h5>
                  <p class="text-lg font-semibold text-text-primary">
                    {{ cveDetails.status || 'Not specified' }}
                  </p>
                </div>
      </div>

              <!-- Description -->
              <div class="mb-6">
                <h5 class="text-sm font-medium text-text-secondary mb-2">Description</h5>
                <p class="text-lg text-text-secondary">{{ cveDetails.description }}</p>
        </div>

              <!-- Additional Information -->
              <div v-if="cveDetails.affectedProducts" class="mb-6">
                <h5 class="text-sm font-medium text-text-secondary mb-2">Affected Products</h5>
                <p class="text-lg text-text-secondary">{{ cveDetails.affectedProducts }}</p>
              </div>
          </div>
            <div class="flex flex-col items-center w-full">
            <button
              v-if="!reportUrl"
              @click="handleGenerateReport"
              :disabled="!canGenerateReport || isGeneratingReport"
                class="bg-[#21C063] hover:bg-[#16994A] text-white px-10 py-4 rounded-xl shadow-lg text-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 mb-4"
              :class="{ 'animate-pulse': isGeneratingReport }"
            >
              {{ isGeneratingReport ? 'Generating...' : 'Generate Report' }}
            </button>
            <a
              v-else
              :href="reportUrl"
                target="_blank"
                rel="noopener"
              download="vulnerability-report.pdf"
                class="bg-[#21C063] hover:bg-[#16994A] text-white px-10 py-4 rounded-xl shadow-lg text-xl font-semibold transition mb-4"
            >
              Download Report
            </a>
              <button
                v-if="reportUrl"
                @click="resetSearch"
                class="mt-4 px-8 py-3 rounded-xl bg-white text-[#18181B] text-lg font-medium shadow hover:bg-[#4B5563] transition"
              >
                Search another CVE
              </button>
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <div class="flex flex-col items-center justify-center py-16 bg-[#23272F] rounded-3xl shadow-2xl p-16 mb-12 border border-[#23272F]">
          <h2 class="text-2xl font-semibold text-white mb-4">You are not authenticated</h2>
          <p class="text-[#B0B3B8] mb-6">
            Please
            <RouterLink to="/login" class="text-[#21C063] underline hover:text-[#16994A]">log in</RouterLink>
            to use VulneraMetrics features.
          </p>
        </div>
      </template>
      </div>
    <!-- Legal links -->
    <div class="flex justify-center space-x-6 mt-8">
      <a href="/privacy" class="text-[#B0B3B8] underline hover:text-[#21C063] transition">Privacy Policy</a>
      <a href="/terms" class="text-[#B0B3B8] underline hover:text-[#21C063] transition">Terms of Service</a>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style> 