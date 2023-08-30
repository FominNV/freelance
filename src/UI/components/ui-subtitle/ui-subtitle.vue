<template>
  <component
    class="ui-subtitle"
    :is="tagName"
    v-ui-typo="{ type: 'subtitle', size }"
  >
    <!-- @slot слот для размещения контента перед подзаголовком -->
    <slot name="prepend" />
    {{ text }}
    <!-- @slot слот для размещения контента после подзаголовка -->
    <slot name="append" />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PropsSizeType } from '../../@types/size';
import { SubtitleSizesType } from './const';

export interface UiSubtitlePropsImpl {
  /** уровень подзаголовка */
  level?: 4 | 5 | 6;
  /** текст подзаголовка */
  text?: string;
  /** размер подзаголовка */
  size?: PropsSizeType<SubtitleSizesType>;
}

const props = withDefaults(defineProps<UiSubtitlePropsImpl>(), {
  level: 4,
  size: 'md',
});

const tagName = computed(() => `h${props.level}`);

</script>
<style>
.ui-subtitle {
  --subtitle-gap: var(--spacing-1);
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--subtitle-gap);
}
</style>
