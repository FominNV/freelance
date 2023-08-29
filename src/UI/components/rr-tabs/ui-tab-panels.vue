<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
} from 'vue';
import { ClassPropsType } from '../../@types/props';

export interface UiTabsPropsImpl {
  /** тема панели (для установки отступов как у элемента списка табов) */
  theme?: 'default' | 'stroke';
}

const props = withDefaults(defineProps<UiTabsPropsImpl>(), {
  theme: 'default',
});

const classes = computed<ClassPropsType>(() => [
  'ui-tab-panels',
  {
    [`ui-tab-panels--theme-${props.theme}`]: props.theme,
  },
]);

</script>
<style>
.ui-tab-panels {
  --tab-panel-default-spacing-x: var(--spacing-1);
  --tab-panel-default-spacing-y: var(--spacing-1-5);
  --tab-panel-stroke-spacing-x: var(--spacing-0);
  --tab-panel-stroke-spacing-y: var(--spacing-1-5);

  position: relative;
}

.ui-tab-panels--theme-default {
  padding: var(--tab-panel-default-spacing-y) var(--tab-panel-default-spacing-x);
}

.ui-tab-panels--theme-stroke {
  padding: var(--tab-panel-stroke-spacing-y) var(--tab-panel-stroke-spacing-x);
}
</style>
