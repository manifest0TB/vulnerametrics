<script setup lang="ts">
// Privacy Policy page component
</script>

<template>
  <div class="flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-8 bg-[#161717]" style="font-family: 'Roboto', sans-serif;">
    <div class="w-full max-w-4xl">
      <h1 class="mb-6 sm:mb-8 text-center text-2xl sm:text-3xl font-semibold text-white">
        Privacy Policy
      </h1>
      <RouterLink
        to="/"
        class="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl shadow-lg font-semibold transition flex items-center justify-center mx-auto mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 0a2 2 0 002-2v-7a2 2 0 00-.59-1.41l-7-7a2 2 0 00-2.82 0l-7 7A2 2 0 003 12v7a2 2 0 002 2h3" />
        </svg>
        Home
      </RouterLink>

      <div class="space-y-4 sm:space-y-6 text-[#B0B3B8]">
        <section class="rounded-lg bg-[#23272F] p-4 sm:p-6 shadow-sm">
          <h2 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">1. Information We Collect</h2>
          <p class="mb-3 sm:mb-4 text-xs sm:text-sm">
            We collect information that you provide directly to us, including when you:
          </p>
          <ul class="list-inside list-disc space-y-1 sm:space-y-2 pl-4 text-xs sm:text-sm">
            <li>Create an account</li>
            <li>Use our services</li>
            <li>Contact our support team</li>
            <li>Subscribe to our newsletters</li>
          </ul>
        </section>

        <section class="rounded-lg bg-[#23272F] p-4 sm:p-6 shadow-sm">
          <h2 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">2. How We Use Your Information</h2>
          <p class="mb-3 sm:mb-4 text-xs sm:text-sm">
            We use the information we collect to:
          </p>
          <ul class="list-inside list-disc space-y-1 sm:space-y-2 pl-4 text-xs sm:text-sm">
            <li>Provide and maintain our services</li>
            <li>Process your transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Communicate with you about products, services, and events</li>
          </ul>
        </section>

        <section class="rounded-lg bg-[#23272F] p-4 sm:p-6 shadow-sm">
          <h2 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">3. Information Sharing</h2>
          <p class="mb-3 sm:mb-4 text-xs sm:text-sm">
            We do not sell or rent your personal information to third parties. We may share your information with:
          </p>
          <ul class="list-inside list-disc space-y-1 sm:space-y-2 pl-4 text-xs sm:text-sm">
            <li>Service providers who assist in our operations</li>
            <li>Law enforcement when required by law</li>
            <li>Other parties with your consent</li>
          </ul>
        </section>

        <section class="rounded-lg bg-[#23272F] p-4 sm:p-6 shadow-sm">
          <h2 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">4. Data Security</h2>
          <p class="mb-3 sm:mb-4 text-xs sm:text-sm">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section class="rounded-lg bg-[#23272F] p-4 sm:p-6 shadow-sm">
          <h2 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">5. Your Rights</h2>
          <p class="mb-3 sm:mb-4 text-xs sm:text-sm">
            You have the right to:
          </p>
          <ul class="list-inside list-disc space-y-1 sm:space-y-2 pl-4 text-xs sm:text-sm">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section class="rounded-lg bg-[#23272F] p-4 sm:p-6 shadow-sm">
          <h2 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">6. Contact Us</h2>
          <p class="mb-3 sm:mb-4 text-xs sm:text-sm">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p class="text-[#21C063] text-xs sm:text-sm">
            Email: contact@vulnerametrics.com
          </p>
        </section>

        <section class="rounded-lg bg-[#23272F] p-4 sm:p-6 shadow-sm">
          <h2 class="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">7. Updates to This Policy</h2>
          <p class="mb-3 sm:mb-4 text-xs sm:text-sm">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
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