<script setup lang="ts">
// Terms of Service page component
</script>

<template>
  <div class="flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-8 bg-[#161717]" style="font-family: 'Roboto', sans-serif;">
    <div class="w-full max-w-4xl">
      <RouterLink
        to="/"
        class="bg-primary hover:bg-primary-hover text-white p-3 rounded-xl shadow-lg transition flex items-center justify-center mx-auto mb-6"
        aria-label="Return to home"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l-9 9" />
        </svg>
      </RouterLink>
      <h1 class="mb-6 sm:mb-8 text-center text-2xl sm:text-3xl font-semibold text-white">
        Terms of Service
      </h1>

      <div class="space-y-4 sm:space-y-6 text-[#B0B3B8]">
        <section class="rounded-lg bg-[#23272F] p-4 sm:p-6 shadow-sm">
          <h2 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">1. Acceptance of Terms</h2>
          <p class="mb-3 sm:mb-4 text-xs sm:text-sm">
            By accessing and using VulneraMetrics, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section class="rounded-lg bg-[#23272F] p-4 sm:p-6 shadow-sm">
          <h2 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">2. Use License</h2>
          <p class="mb-3 sm:mb-4 text-xs sm:text-sm">
            VulneraMetrics offers you a permissive license to use, modify, and share any reports or materials generated on our platform, for both personal and commercial purposes—provided your use is responsible, ethical, and not intended to harm others or organizations. Please note: all use must also comply with the <a href="https://www-cdn.anthropic.com/6b68a6508f0210c5fe08f0199caa05c4ee6fb4dc/Anthropic-on-Bedrock-Commercial-Terms-of-Service_Dec_2023.pdf" target="_blank" class="underline text-[#21C063]">Anthropic on Bedrock Commercial Terms of Service</a>.
          </p>
          <ul class="list-inside list-disc space-y-1 sm:space-y-2 pl-4 text-xs sm:text-sm">
            <li>You may use, modify, and share generated reports without restriction</li>
            <li>Commercial and personal use are both permitted</li>
            <li>Use must not be intended to harm individuals, organizations, or commercial entities</li>
            <li>We encourage attribution but do not require it</li>
            <li>All use must comply with the <a href="https://www-cdn.anthropic.com/6b68a6508f0210c5fe08f0199caa05c4ee6fb4dc/Anthropic-on-Bedrock-Commercial-Terms-of-Service_Dec_2023.pdf" target="_blank" class="underline text-[#21C063]">Anthropic on Bedrock Commercial Terms of Service</a></li>
          </ul>
        </section>

        <section class="rounded-lg bg-[#23272F] p-4 sm:p-6 shadow-sm">
          <h2 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">3. User Account</h2>
          <p class="mb-3 sm:mb-4 text-xs sm:text-sm">
            To access certain features of VulneraMetrics, you must register for an account. You agree to:
          </p>
          <ul class="list-inside list-disc space-y-1 sm:space-y-2 pl-4 text-xs sm:text-sm">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Notify us immediately of any unauthorized use</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>
        </section>

        <section class="rounded-lg bg-[#23272F] p-4 sm:p-6 shadow-sm">
          <h2 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">4. Service Usage</h2>
          <p class="mb-3 sm:mb-4 text-xs sm:text-sm">
            VulneraMetrics provides vulnerability assessment and reporting services. You agree to:
          </p>
          <ul class="list-inside list-disc space-y-1 sm:space-y-2 pl-4 text-xs sm:text-sm">
            <li>Use the service only for legitimate security assessments</li>
            <li>Not attempt to bypass any security measures</li>
            <li>Not use the service for malicious purposes</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
        </section>

        <section class="rounded-lg bg-[#23272F] p-4 sm:p-6 shadow-sm">
          <h2 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">5. Disclaimer</h2>
          <p class="mb-3 sm:mb-4 text-xs sm:text-sm">
            The materials on VulneraMetrics are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section class="rounded-lg bg-[#23272F] p-4 sm:p-6 shadow-sm">
          <h2 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">6. Limitations</h2>
          <p class="mb-3 sm:mb-4 text-xs sm:text-sm">
            In no event shall VulneraMetrics or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on VulneraMetrics.
          </p>
        </section>

        <section class="rounded-lg bg-[#23272F] p-4 sm:p-6 shadow-sm">
          <h2 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">7. Revisions and Errata</h2>
          <p class="mb-3 sm:mb-4 text-xs sm:text-sm">
            The materials appearing on VulneraMetrics could include technical, typographical, or photographic errors. We do not warrant that any of the materials on our website are accurate, complete, or current. We may make changes to the materials contained on our website at any time without notice.
          </p>
        </section>

        <section class="rounded-lg bg-[#23272F] p-4 sm:p-6 shadow-sm">
          <h2 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">8. Contact Information</h2>
          <p class="mb-3 sm:mb-4 text-xs sm:text-sm">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p class="text-[#21C063] text-xs sm:text-sm">
            Email: contact@vulnerametrics.com
          </p>
        </section>

        <section class="rounded-lg bg-[#23272F] p-4 sm:p-6 shadow-sm">
          <h2 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">9. Updates to Terms</h2>
          <p class="mb-3 sm:mb-4 text-xs sm:text-sm">
            We may update these Terms of Service from time to time. We will notify you of any changes by posting the new Terms of Service on this page and updating the "Last Updated" date.
          </p>
          <p class="text-xs text-[#B0B3B8]">
            Last Updated: April 2025
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style>