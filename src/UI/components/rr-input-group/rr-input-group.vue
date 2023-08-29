<template>
  <div :class="classes">
    <!-- @slot слот для размещения инпутов которые будут сгруппированы -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ClassPropsType } from '../../@types/props';

const classes = computed<ClassPropsType>(() => [
  'ui-input-group',
]);

</script>
<style>
.ui-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.ui-input-group > .ui-input:first-child input {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.ui-input-group > .ui-input:not(:first-child, :last-child) input {
  border-radius: 0;
}

.ui-input-group > .ui-input + .ui-input:not(:first-child, :last-child) input {
  border-left: none;
}
.ui-input-group > .ui-input + .ui-input:nth-last-child(2) input {
  border-right: none;
}

.ui-input-group > .ui-input:last-child input {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
