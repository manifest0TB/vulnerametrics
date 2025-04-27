<script setup lang="ts">
// src/views/HomePage.vue
import { ref, computed, onUnmounted } from 'vue';
import { useCreditsStore } from '@/stores/credits';
import { apiService } from '@/services/api';
import type { CveDetails, ApiError } from '@/types/api';
import { getUrl } from 'aws-amplify/storage';
import { useAuthStore } from '@/stores/auth';

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

// Computed properties
const hasEnoughCredits = computed(() => (creditsStore.credits ?? 0) > 0);
const canGenerateReport = computed(() => cveDetails.value && hasEnoughCredits.value);

const userName = computed(() => {
  // Intenta obtener el nickname, si no, el username
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
    // Obtener el pre-signed URL usando Amplify Storage v6
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
  // Puedes redirigir si lo deseas
};

// Clean up the blob URL when component is unmounted
onUnmounted(() => {
  if (reportUrl.value) {
    URL.revokeObjectURL(reportUrl.value);
  }
});
</script>

<template>
  <!-- NAVBAR -->
  <nav class="fixed top-0 left-0 w-full bg-[#FAFAFA] shadow z-50 flex items-center justify-between px-8 h-16" style="font-family: 'Roboto', sans-serif;">
    <a href="/" class="flex items-center">
      <img src="@/assets/logo-bw-50.png" alt="Logo" class="h-12 w-auto" style="max-width:60px;" />
    </a>
    <div class="flex items-center space-x-6">
      <span class="text-[#18181B] font-medium">Hi, {{ userName }}</span>
      <span class="text-[#21C063] font-semibold">Credits: {{ creditsStore.credits ?? 0 }}</span>
      <button @click="handleLogout" class="bg-[#21C063] hover:bg-[#16994A] text-white px-4 py-2 rounded-lg shadow transition">Logout</button>
    </div>
  </nav>

  <!-- MAIN CONTENT -->
  <div class="pt-24 flex flex-col items-center min-h-screen bg-[#F4F4F5]" style="font-family: 'Roboto', sans-serif;">
    <div class="w-full max-w-2xl bg-[#FAFAFA] rounded-2xl shadow-lg p-10 mb-8 border border-[#E5E7EB]">
      <h2 class="text-2xl font-semibold text-[#18181B] mb-2">Search CVE</h2>
      <p class="text-[#4B5563] mb-6">Enter a CVE ID (e.g., CVE-2024-1234) to view its details and generate an AI-powered report.</p>
      <form class="flex space-x-2 mb-4" @submit.prevent="handleSearch">
        <input
          type="text"
          v-model="cveIdInput"
          placeholder="CVE-2024-1234"
          class="flex-grow rounded-lg border border-[#E5E7EB] px-4 py-2 text-[#18181B] bg-white focus:ring-2 focus:ring-[#21C063] focus:outline-none transition"
        />
        <button
          type="submit"
          :disabled="isLoading || !isValidCveFormat(cveIdInput)"
          class="bg-[#21C063] hover:bg-[#16994A] text-white px-6 py-2 rounded-lg shadow transition disabled:cursor-not-allowed disabled:opacity-50"
          :class="{ 'animate-pulse': isLoading }"
        >
          {{ isLoading ? 'Searching...' : 'Search' }}
        </button>
      </form>
      <div v-if="error" class="bg-[#FEF2F2] border border-[#EF4444] text-[#EF4444] rounded-lg p-3 mb-4 flex items-center space-x-2">
        <svg class="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        <span>{{ error }}</span>
      </div>
      <div v-if="cveDetails" class="mt-6">
        <div class="bg-white rounded-xl p-6 mb-4 shadow-sm border border-[#E5E7EB]">
          <h3 class="text-lg font-medium text-[#18181B] mb-2">{{ cveDetails.id }}</h3>
          <p class="text-[#4B5563]">{{ cveDetails.description }}</p>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-[#4B5563]">Available Credits: {{ creditsStore.credits ?? 0 }}</span>
          <div class="flex items-center space-x-4">
            <button
              v-if="!reportUrl"
              @click="handleGenerateReport"
              :disabled="!canGenerateReport || isGeneratingReport"
              class="bg-[#21C063] hover:bg-[#16994A] text-white px-4 py-2 rounded-lg shadow transition disabled:cursor-not-allowed disabled:opacity-50"
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
              class="bg-[#21C063] hover:bg-[#16994A] text-white px-4 py-2 rounded-lg shadow transition"
            >
              Download Report
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- FOOTER -->
    <footer class="w-full text-center text-[#4B5563] py-6 text-sm">
      © 2024 VulneraMetrics. All rights reserved.
    </footer>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style>