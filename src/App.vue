<script setup lang="ts">
// src/App.vue

import AppHeader from '@/components/AppHeader.vue';
import AppFooter from '@/components/AppFooter.vue';
import { RouterView } from 'vue-router';

</script>

<template>
  <div id="app" class="flex min-h-screen flex-col bg-gray-100 text-gray-900">
    <AppHeader />

    <main class="container mx-auto flex-grow px-4 py-8 pt-16">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>