<template lang="pug">
div.default-layout(:class="theme")
</template>

<script setup lang="ts">
import { ref } from 'vue';

const theme = ref<string>('default');

function changeTheme() {
  theme.value = theme.value === 'light' ? 'default' : 'light';
  console.log('click', theme.value);
}
</script>

<style lang="scss">
@import '../scss/import.css';

.default-layout {
  min-height: 100vh;
  background: var(--dark);
  transition: all 0.5s;
}
</style>