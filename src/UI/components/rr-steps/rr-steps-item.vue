<template>
  <div :class="['ui-steps-item']">
    <p
      v-if="!!number"
      :class="['ui-steps-item__number', { 'ui-steps-item__number_active': props.active }]"
    >{{ number }}</p>
    <p
      v-if="!!title"
      :class="['ui-steps-item__title', { 'ui-steps-item__title_active': props.active }]"
    >{{ title }}</p>
  </div>
</template>

<script setup lang="ts">
export interface RrStepsItemPropsImpl {
  active?: boolean,
  number?: number | null,
  title?: string | null,
}

const props = defineProps<RrStepsItemPropsImpl>();
</script>

<style>
.ui-steps-item {
  --steps-item-text-color-secondary: var(--color-text-secondary);
  --steps-item-text-color-primary: var(--color-text-primary);
  --steps-item-text-color-accent: var(--color-primary-500);
  --steps-item-column-gap: var(--spacing-1);

  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: var(--steps-item-column-gap);
  color: var(--steps-item-text-color-secondary);
  text-align: center;
}

.ui-steps-item__number_active {
  color: var(--steps-item-text-color-accent);
}

.ui-steps-item__title_active {
  color: var(--steps-item-text-color-primary);
}
</style>
