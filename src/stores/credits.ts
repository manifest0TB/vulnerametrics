import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '@/services/api';

export const useCreditsStore = defineStore('credits', () => {
  const credits = ref<number | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchCredits() {
    loading.value = true;
    error.value = null;
    try {
      const response = await apiService.checkCredits();
      credits.value = response.creditBalance;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch credits';
      console.error('Error fetching credits:', err);
    } finally {
      loading.value = false;
    }
  }

  return {
    credits,
    loading,
    error,
    fetchCredits
  };
}); 