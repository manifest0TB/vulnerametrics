<script setup lang="ts">
// src/views/HomePage.vue
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

// Mensaje y color animado para la carga del reporte
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
  <div class="flex flex-col items-center justify-center min-h-screen bg-[#161717]" style="font-family: 'Roboto', sans-serif;">
    <div class="w-full max-w-2xl bg-[#23272F] rounded-3xl shadow-2xl p-16 flex flex-col items-center mt-24 mb-12 border border-[#23272F]">
      <img src="@/assets/vmlogo_white.svg" alt="VulneraMetrics Logo" class="h-20 w-auto mb-8" />
      <h1 class="text-4xl font-bold text-white mb-4 text-center">Welcome to VulneraMetrics</h1>
      <p class="text-lg text-[#B0B3B8] mb-8 text-center">
        VulneraMetrics is your AI-powered platform for analyzing software vulnerabilities (CVEs) and generating actionable security reports. Search for any CVE and instantly get a detailed, professional PDF report.
      </p>
      <RouterLink
        to="/generate-reports"
        class="bg-primary hover:bg-primary-hover text-white px-10 py-4 rounded-xl shadow-lg text-xl font-semibold transition"
      >
        Search CVE
      </RouterLink>
    </div>
    <div class="flex justify-center space-x-6 mt-8">
      <RouterLink to="/privacy" class="text-[#B0B3B8] underline hover:text-[#21C063] transition">Privacy Policy</RouterLink>
      <RouterLink to="/terms" class="text-[#B0B3B8] underline hover:text-[#21C063] transition">Terms of Service</RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style>