<template>
  <component
    class="ui-title"
    :is="tagName"
    v-ui-typo="{ type: 'title', size }"
  >
    <!-- @slot слот для размещения контента перед заголовком -->
    <slot name="prepend" />
    {{ text }}
    <!-- @slot слот для размещения контента после заголовка -->
    <slot name="append" />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PropsSizeType } from '../../@types/size';
import { TitleSizesType } from './const';

export interface UiTitlePropsImpl {
  /** уровень заголовка */
  level?: 1 | 2 | 3;
  /** текст заголовка */
  text?: string;
  /** размер заголовка */
  size?: PropsSizeType<TitleSizesType>;
}

const props = withDefaults(defineProps<UiTitlePropsImpl>(), {
  level: 2,
  size: 'sm',
});

const tagName = computed(() => `h${props.level}`);

</script>
<style>
.ui-title {
  --title-gap: var(--spacing-1-5);
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--title-gap);
}
</style>
