<template>
  <ui-list-item
    :class="classes"
    @click="emit('click', $event)"
  >
    <!-- @slot контент элемента списка -->
    <span>
      <slot>{{ text }}</slot>
    </span>
  </ui-list-item>
</template>

<script setup lang="ts">
import { ComputedRef, computed } from 'vue';
import { ClassPropsType } from '../../@types/props';

export interface Props {
  /** текст элемента списка */
  text?: boolean;
  /** активный пукт списка */
  selected?: boolean;
  /**
   * флаг отображающий маркер пункта меню
   * @params none - отключить отображение маркера
   * @params on-hover - показывать маркер только при ховере
   * @params always - всегда показывать маркер
   */
  showMarker?: 'none' | 'on-hover' | 'always';
  animateSelection?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  showMarker: 'on-hover',
  animateSelection: false,
});
const emit = defineEmits<{
  /** Событие клика по элементу списка */
  (e: 'click', value: MouseEvent): void;
}>();

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-popover-list-item',
  {
    'ui-popover-list-item--selected': props.selected,
    'ui-popover-list-item--animate-selection': props.animateSelection,
    [`ui-popover-list-item--marker-${props.showMarker}`]: props.showMarker !== 'none',
  },
]);
</script>

<style>
.ui-popover-list-item {
  --list-item-font-size: var(--paragraph-sm-font-size);
  --list-item-line-height: var(--paragraph-sm-line-height);
  --list-item-font-weight: var(--paragraph-sm-font-weight);
  --list-item-letter-spacing: var(--paragraph-sm-letter-spacing);

  --popover-list-item-padding: var(--spacing-1-5);
  --popover-list-item-selected-background-color: var(--color-primary-50);
  --popover-list-item-selected-text-color: var(--color-primary-500);
  --popover-list-item-marker-position: absolute;
  --popover-list-item-marker-width: 4px;
  --popover-list-item-marker-height: 100%;
  --popover-list-item-marker-left: 0;
  --popover-list-item-marker-top: 0;
  --popover-list-item-marker-background-color: var(--color-primary-100);

  padding: var(--popover-list-item-padding);
  user-select: none;
}

.ui-popover-list-item span {
  position: relative;
}

.ui-popover-list-item--animate-selection.ui-popover-list-item--marker-always:before,
.ui-list--hoverable .ui-popover-list-item--animate-selection.ui-popover-list-item--marker-on-hover:before {
  animation: slide-in-left-anim .4s cubic-bezier(0.65, 0, 0.35, 1);
  animation-fill-mode: forwards;
}

.ui-popover-list-item--marker-always:before,
.ui-list--hoverable .ui-popover-list-item--marker-on-hover:before {
  content: '';
  display: none;
  position: var(--popover-list-item-marker-position);
  width: var(--popover-list-item-marker-width);
  height: var(--popover-list-item-marker-height);
  left: var(--popover-list-item-marker-left);
  top: var(--popover-list-item-marker-top);
  background-color: var(--popover-list-item-marker-background-color);
}

.ui-list--hoverable .ui-popover-list-item--marker-always:before,
.ui-list--hoverable .ui-popover-list-item--marker-on-hover:hover:before {
  display: block;
}

.ui-popover-list-item--selected,
.ui-list--hoverable .ui-popover-list-item--selected:is(:hover, :active) {
  transition: background-color .1s ease;
  background-color: var(--popover-list-item-selected-background-color);
  color: var(--popover-list-item-selected-text-color);
}

.ui-popover-list-item--animate-selection.ui-popover-list-item--selected,
.ui-list--hoverable .ui-popover-list-item--animate-selection.ui-popover-list-item--selected:is(.ui-popover-list-item--marker-on-hover, .ui-popover-list-item--marker-always):is(:hover, :active) {
  transition-delay: .2s;
}

.ui-list--hoverable .ui-popover-list-item--animate-selection.ui-popover-list-item--marker-always.ui-popover-list-item--selected:before,
.ui-list--hoverable .ui-popover-list-item--animate-selection.ui-popover-list-item--marker-on-hover.ui-popover-list-item--selected:before {
  display: block;
  animation: fill-to-right-anim .3s cubic-bezier(0.32, 0, 0.67, 0);
}
</style>
