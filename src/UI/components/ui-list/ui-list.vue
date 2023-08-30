<template>
  <ul :class="classes">
    <!-- @slot слот для размещения элементов списка -->
    <slot />
  </ul>
</template>

<script setup lang="ts">
import { ComputedRef, computed } from 'vue';
import { ClassPropsType } from '../../@types/props';

export interface Props {
  /** флаг добавляет ховер элементам списка */
  hoverable?: boolean;
  /** флаг отображает указатель "палец" при наведении на элемент списка */
  pointer?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hoverable: false,
  pointer: false,
});

const classes = computed<ClassPropsType>(() => [
  'ui-list',
  {
    'ui-list--hoverable': props.hoverable,
    'ui-list--pointer': props.pointer,
  },
]);

</script>
<style>
.ui-list {
  --list-gap-x: var(--spacing-1-5);
  --list-gap-y: var(--spacing-1-5);
  --list-item-hover-color: var(--color-primary-500);
  --list-item-active-color: var(--color-primary-600);
  --list-item-mark-font-size: 6px;
  --list-item-mark-padding-left: calc(var(--list-item-mark-font-size) + var(--spacing-1));
  --list-item-mark-color: var(--color-primary-500);
  --list-item-gap-x: var(--spacing-1-5);
  --list-item-gap-y: var(--spacing-1-5);
  --list-item-font-size: var(--subtitle-xs-font-size);
  --list-item-line-height: var(--subtitle-xs-line-height);
  --list-item-font-weight: var(--subtitle-xs-font-weight);
  --list-item-letter-spacing: var(--subtitle-xs-letter-spacing);
  --list-item-text-color: var(--color-text-primary);
  --list-item-caption-text-color: var(--color-text-placeholder);
  --list-item-caption-font-size: var(--paragraph-xs-font-size);
  --list-item-caption-line-height: var(--paragraph-xs-line-height);
  --list-item-caption-font-weight: var(--paragraph-xs-font-weight);
  --list-item-caption-letter-spacing: var(--paragraph-xs-letter-spacing);

  display: grid;
  gap: var(--list-gap-y) var(--list-gap-x);
  grid-template-columns: 1fr;
  padding: 0;
  margin: 0;
}

.ui-list:focus-visible {
  outline: none;
}

.ui-list__item {
  display: flex;
  align-items: center;
  gap: var(--list-item-gap-y) var(--list-item-gap-x);
  position: relative;
  font-size: var(--list-item-font-size);
  line-height: var(--list-item-line-height);
  font-weight: var(--list-item-font-weight);
  letter-spacing: var(--list-item-letter-spacing);
  color: var(--list-item-text-color);
}

.ui-list__item--marker {
  padding-left: var(--list-item-mark-padding-left);
}

.ui-list__item--marker:before {
  content: "";
  width: 1em;
  height: 1em;
  font-size: var(--list-item-mark-font-size);
  background-color: var(--list-item-mark-color);
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: calc(var(--list-item-line-height)/2 - 0.5em);
}

.ui-list__item-section {
  display: flex;
  flex-direction: column;
}

.ui-list__item-label {
  font-size: var(--list-item-font-size);
  color: var(--list-item-line-height);
}

.ui-list__item-label.text-caption {
  font-size: var(--list-item-caption-font-size);
  color: var(--list-item-caption-text-color);
  font-weight: var(--list-item-caption-font-weight);
  line-height: var(--list-item-caption-line-height);
  letter-spacing: var(--list-item-caption-letter-spacing);
}

.ui-list--pointer .ui-list__item {
  cursor: pointer;
}

.ui-list--hoverable .ui-list__item:focus,
.ui-list--hoverable .ui-list__item:hover {
  color: var(--list-item-hover-color);
}

.ui-list--hoverable .ui-list__item:active {
  color: var(--list-item-active-color);
}
</style>
