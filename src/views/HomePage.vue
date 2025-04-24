<script setup lang="ts">
// src/views/HomePage.vue
import { ref, computed, onUnmounted } from 'vue';
import { useCreditsStore } from '@/stores/credits';
import { apiService } from '@/services/api';
import type { CveDetails, ApiError } from '@/types/api';

// Initialize stores
const creditsStore = useCreditsStore();

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
    const reportBlob = await apiService.generateReport(cveIdInput.value);
    // Create a URL for the blob
    reportUrl.value = URL.createObjectURL(reportBlob);
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

// Clean up the blob URL when component is unmounted
onUnmounted(() => {
  if (reportUrl.value) {
    URL.revokeObjectURL(reportUrl.value);
  }
});
</script>

<template>
  <div class="flex flex-col items-center justify-center px-4 py-8">
    <h1 class="mb-6 text-center text-3xl font-semibold text-gray-700">
      Search CVE Information
    </h1>

    <p class="mb-8 max-w-xl text-center text-gray-600">
      Enter a CVE ID (e.g., CVE-2024-1234) to retrieve its details and generate
      an AI-powered analysis report (requires credits).
    </p>

    <form
      @submit.prevent="handleSearch"
      class="mb-8 flex w-full max-w-lg items-center space-x-2 rounded-md border border-gray-300 bg-white p-2 shadow-sm"
    >
      <input
        type="text"
        v-model="cveIdInput"
        placeholder="Enter CVE ID (e.g., CVE-2024-1234)"
        class="flex-grow rounded-l-md border-none px-4 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0"
        aria-label="CVE ID Input"
        required
      />
      <button
        type="submit"
        :disabled="isLoading || !isValidCveFormat(cveIdInput)"
        class="rounded-r-md bg-gray-700 px-6 py-2 text-white transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        :class="{ 'animate-pulse': isLoading }"
      >
        {{ isLoading ? 'Searching...' : 'Search' }}
      </button>
    </form>

    <div class="w-full max-w-2xl">
      <!-- Error Message -->
      <div
        v-if="error"
        class="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-600"
      >
        {{ error }}
      </div>

      <!-- CVE Details -->
      <div
        v-if="cveDetails"
        class="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 class="mb-4 text-xl font-semibold text-gray-800">
          {{ cveDetails.id }}
        </h2>
        <div class="prose prose-sm max-w-none">
          <p class="text-gray-600">{{ cveDetails.description }}</p>
          <!-- Add more CVE details as needed -->
        </div>

        <!-- Report Generation Section -->
        <div class="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-500">Available Credits: {{ creditsStore.credits ?? 0 }}</span>
            <span v-if="!hasEnoughCredits" class="text-sm text-red-500">(Insufficient credits)</span>
          </div>
          <div class="flex items-center space-x-4">
            <button
              v-if="!reportUrl"
              @click="handleGenerateReport"
              :disabled="!canGenerateReport || isGeneratingReport"
              class="rounded bg-gray-700 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
              :class="{ 'animate-pulse': isGeneratingReport }"
            >
              {{ isGeneratingReport ? 'Generating...' : 'Generate Report' }}
            </button>
            <a
              v-else
              :href="reportUrl"
              download="vulnerability-report.pdf"
              class="rounded bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
            >
              Download Report
            </a>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="isLoading"
        class="flex items-center justify-center space-x-2 text-gray-500"
      >
        <span class="text-sm">Loading details...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style>