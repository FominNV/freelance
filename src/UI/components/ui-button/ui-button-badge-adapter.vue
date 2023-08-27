<template>
  <ui-badge
    :theme="theme"
    :type="type"
  >
    {{ text }}
  </ui-badge>
</template>
<script setup lang="ts">
import { BadgeThemesType } from '../ui-badge/const';

export interface ButtonBadgePropsImpl {
  /** тема бейджа */
  theme?: BadgeThemesType;
  /** текст бейджа */
  text?: string | number;
  /** тип бейджа */
  type?: 'fill' | 'outlined';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<ButtonBadgePropsImpl>(), {
  theme: 'default',
  type: 'fill',
});

</script>
