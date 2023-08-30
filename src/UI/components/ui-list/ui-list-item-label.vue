<template>
  <!-- eslint-disable-next-line vuejs-accessibility/label-has-for -->
  <label :class="['ui-list__item-label', { 'text-caption': props.caption }]">
    <!-- @slot слот для размещения контента надписи -->
    <slot />
  </label>
</template>

<script setup lang="ts">
export interface Props {
  /** флаг отвечает за уменьшение текста надписи */
  caption?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  caption: false,
});
</script>
