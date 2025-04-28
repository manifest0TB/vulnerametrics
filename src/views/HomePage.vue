<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';

const fullTitle = 'Welcome to VulneraMetrics!';
const animatedTitle = ref('');

onMounted(() => {
  let i = 0;
  const speed = 40; // ms per character
  function typeWriter() {
    if (i < fullTitle.length) {
      animatedTitle.value += fullTitle.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    } else {
      setTimeout(() => {
        animatedTitle.value = '';
        i = 0;
        setTimeout(typeWriter, 600); // small pause before restarting
      }, 1200); // pause after finishing
    }
  }
  typeWriter();
});
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-[#161717]" style="font-family: 'Roboto', sans-serif;">
    <div class="w-full max-w-2xl bg-[#23272F] rounded-3xl shadow-2xl p-16 flex flex-col items-center mt-24 mb-12 border border-[#23272F]">
      <img src="@/assets/vmlogo_green.svg" alt="VulneraMetrics Logo" class="h-20 w-auto mb-8" />
      <h1 class="text-4xl font-bold text-white mb-4 text-center typewriter">
        {{ animatedTitle }}<span v-if="animatedTitle.length < fullTitle.length" class="typewriter-cursor">|</span>
      </h1>
      <p class="text-lg text-[#B0B3B8] mb-8 text-center">
        VulneraMetrics is a cybersecurity tool to generate CVEs reports using Claude 3.7 Sonnet on AWS Bedrock. 
      </p>
      <RouterLink
        to="/generate-reports"
        class="bg-primary hover:bg-primary-hover text-white w-full max-w-xs sm:w-auto px-4 py-2 text-base sm:px-7 sm:py-3 sm:text-lg rounded-xl shadow-lg font-semibold transition cta-glow"
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
.typewriter {
  min-height: 3.5rem;
  letter-spacing: 0.01em;
  white-space: nowrap;
  overflow: hidden;
}
.typewriter-cursor {
  display: inline-block;
  width: 1ch;
  color: #21C063;
  animation: blink 0.8s steps(1) infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.cta-glow {
  box-shadow: 0 0 4px 0 #21C06344, 0 0 8px 0 #21C06322;
  animation: glow-pulse 2.2s infinite alternate;
}
@keyframes glow-pulse {
  0% {
    box-shadow: 0 0 4px 0 #21C06344, 0 0 8px 0 #21C06322;
    filter: brightness(1.01);
  }
  100% {
    box-shadow: 0 0 10px 2px #21C06333, 0 0 16px 4px #21C06322;
    filter: brightness(1.06);
  }
}
</style>