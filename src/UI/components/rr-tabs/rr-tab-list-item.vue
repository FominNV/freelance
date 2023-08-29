<template>
  <li
    :class="classes"
    @click="emit('click')"
  >
    <!-- @slot слот для смены контента элемента таба -->
    <slot
      :title="title"
      :active="active"
      :disabled="disabled"
    >
      <span>{{ title }}</span>
    </slot>
  </li>
</template>

<script setup lang="ts">
import {
  computed,
} from 'vue';
import { ClassPropsType } from '../../@types/props';

export interface RrTabsPropsImpl {
  /** неактивный таб */
  disabled?: boolean;
  /** текст таба */
  title?: string;
  /** флаг выбранного таба */
  active?: boolean;
  /** тема таба */
  theme?: 'default' | 'stroke';
}

const props = withDefaults(defineProps<RrTabsPropsImpl>(), {
  theme: 'default',
});

const emit = defineEmits<{
  /** Событие клика по табу */
  (e: 'click'): void;
}>();

const classes = computed<ClassPropsType>(() => [
  'ui-tab-list-item',
  {
    'ui-tab-list-item--active': props.active,
    'ui-tab-list-item--disabled': props.disabled,
    [`ui-tab-list-item--theme-${props.theme}`]: props.theme,
  },
]);

</script>
<style>
.ui-tab-list-item {
  --tab-list-item-default-font-size: var(--paragraph-xs-font-size);
  --tab-list-item-default-line-height: var(--paragraph-xs-line-height);
  --tab-list-item-default-font-weight: var(--paragraph-xs-font-weight);
  --tab-list-item-default-letter-spacing: var(--paragraph-xs-letter-spacing);
  --tab-list-item-default-text-transform: none;
  --tab-list-item-default-background-color: transparent;
  --tab-list-item-default-text-color: var(--color-text-secondary);
  --tab-list-item-default-border: none;
  --tab-list-item-default-background-color-hover: var(--color-neutral-100);
  --tab-list-item-default-text-color-hover: var(--color-text-primary);
  --tab-list-item-default-border-hover: none;
  --tab-list-item-default-background-color-active: var(--color-neutral-200);
  --tab-list-item-default-text-color-active: var(--color-text-primary);
  --tab-list-item-default-border-active: none;
  --tab-list-item-default-background-color-disabled: transparent;
  --tab-list-item-default-text-color-disabled: var(--color-text-light);
  --tab-list-item-default-border-disabled: none;
  --tab-list-item-default-radius: var(--radius-xs);
  --tab-list-item-default-spacing-x: var(--spacing-1);
  --tab-list-item-default-spacing-y: var(--spacing-0-5);

  --tab-list-item-stroke-font-size: var(--action-sm-font-size);
  --tab-list-item-stroke-line-height: var(--action-sm-line-height);
  --tab-list-item-stroke-font-weight: var(--action-sm-font-weight);
  --tab-list-item-stroke-letter-spacing: var(--action-sm-letter-spacing);
  --tab-list-item-stroke-text-transform: none;
  --tab-list-item-stroke-background-color: transparent;
  --tab-list-item-stroke-text-color: var(--color-text-secondary);
  --tab-list-item-stroke-border-bottom: 1px solid transparent;
  --tab-list-item-stroke-background-color-hover: transparent;
  --tab-list-item-stroke-text-color-hover: var(--color-primary-300);
  --tab-list-item-stroke-border-bottom-hover: 1px solid transparent;
  --tab-list-item-stroke-background-color-active: transparent;
  --tab-list-item-stroke-text-color-active: var(--color-primary-500);
  --tab-list-item-stroke-border-bottom-active: 1px solid var(--color-primary-500);
  --tab-list-item-stroke-background-color-disabled: transparent;
  --tab-list-item-stroke-text-color-disabled: var(--color-text-light);
  --tab-list-item-stroke-border-disabled: none;
  --tab-list-item-stroke-radius: 0;
  --tab-list-item-stroke-spacing-x: var(--spacing-1-5);
  --tab-list-item-stroke-spacing-y: var(--spacing-0-5);

  position: relative;
  cursor: pointer;
}

.ui-tab-list-item--disabled {
  pointer-events: none;
}

.ui-tab-list-item--theme-default {
  font-size: var(--tab-list-item-default-font-size);
  line-height: var(--tab-list-item-default-line-height);
  font-weight: var(--tab-list-item-default-font-weight);
  letter-spacing: var(--tab-list-item-default-letter-spacing);
  text-transform: var(--tab-list-item-default-text-transform);
  padding: var(--tab-list-item-default-spacing-y) var(--tab-list-item-default-spacing-x);
  background-color: var(--tab-list-item-default-background-color);
  color: var(--tab-list-item-default-text-color);
  border-radius: var(--tab-list-item-default-radius);
  border: var(--tab-list-item-default-border);
}

.ui-tab-list-item--theme-default.ui-tab-list-item--disabled,
.ui-tab-list-item--theme-default.ui-tab-list-item--disabled:not(.ui-tab-list-item--active):hover {
  background-color: var(--tab-list-item-default-background-color-disabled);
  color: var(--tab-list-item-default-text-color-disabled);
  border: var(--tab-list-item-default-border-disabled);
}

.ui-tab-list-item--theme-default:not(.ui-tab-list-item--active):hover {
  background-color: var(--tab-list-item-default-background-color-hover);
  color: var(--tab-list-item-default-text-color-hover);
  border: var(--tab-list-item-default-border-hover);
}

.ui-tab-list-item--theme-default.ui-tab-list-item--active {
  background-color: var(--tab-list-item-default-background-color-active);
  color: var(--tab-list-item-default-text-color-active);
  border: var(--tab-list-item-default-border-active);
}

.ui-tab-list-item--theme-stroke.ui-tab-list-item--disabled,
.ui-tab-list-item--theme-stroke.ui-tab-list-item--disabled:not(.ui-tab-list-item--active):hover {
  background-color: var(--tab-list-item-stroke-background-color-disabled);
  color: var(--tab-list-item-stroke-text-color-disabled);
  border: var(--tab-list-item-stroke-border-disabled);
}

.ui-tab-list-item--theme-stroke {
  font-size: var(--tab-list-item-stroke-font-size);
  line-height: var(--tab-list-item-stroke-line-height);
  font-weight: var(--tab-list-item-stroke-font-weight);
  letter-spacing: var(--tab-list-item-stroke-letter-spacing);
  text-transform: var(--tab-list-item-stroke-text-transform);
  padding: var(--tab-list-item-stroke-spacing-y) var(--tab-list-item-stroke-spacing-x);
  background-color: var(--tab-list-item-stroke-background-color);
  color: var(--tab-list-item-stroke-text-color);
  border-radius: var(--tab-list-item-stroke-radius);
  border-bottom: var(--tab-list-item-stroke-border-bottom);
}

.ui-tab-list-item--theme-stroke:not(.ui-tab-list-item--active):hover {
  background-color: var(--tab-list-item-stroke-background-color-hover);
  color: var(--tab-list-item-stroke-text-color-hover);
  border-bottom: var(--tab-list-item-stroke-border-bottom-hover);
}

.ui-tab-list-item--theme-stroke.ui-tab-list-item--active {
  background-color: var(--tab-list-item-stroke-background-color-active);
  color: var(--tab-list-item-stroke-text-color-active);
  border-bottom: var(--tab-list-item-stroke-border-bottom-active);
}
</style>
