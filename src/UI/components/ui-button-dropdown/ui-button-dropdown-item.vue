<template>
  <li
    :class="classes"
    @click="onClick"
  >
    <!--@slot слот, если нужно добавить какой-либо кастомный контент-->
    <slot>
      <div
        class="ui-button-dropdown-item__icon"
        v-if="icon"
      >
        <ui-icon :name="icon" />
      </div>
      <div
        class="ui-button-dropdown-item__content"
        v-if="text"
      >
        {{ text }}
      </div>
    </slot>
  </li>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { ClassPropsType } from '../../@types/props';

export interface UiButtonDropdownItemPropsImpl {
  icon?: IconsNamesType;
  text?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<UiButtonDropdownItemPropsImpl>(), {
  disabled: false,
});

const emit = defineEmits<{
  /** Клик по элементу */
  (e: 'click', event: Event): void;
}>();

const onClick = (event: Event) => {
  if (props.disabled) {
    return;
  }
  emit('click', event);
};

const classes = computed<ClassPropsType>(() => [
  'ui-button-dropdown__item',
  { 'ui-button-dropdown__item--disabled': props.disabled },
]);
</script>

<style>
.ui-button-dropdown__item {
  --ui-button-dropdown-item-color: var(--color-text-primary);
  --ui-button-dropdown-item-disabled-color: var(--color-text-light);
  --ui-button-dropdown-item-background-color: var(--color-neutral-0);
  --ui-button-dropdown-item-hover-background-color: var(--color-primary-50);
  --ui-button-dropdown-item-padding: var(--spacing-1-5) var(--spacing-1-5);
  --ui-button-dropdown-item-font-size: var(--subtitle-xs-font-size);
  --ui-button-dropdown-item-gap: var(--spacing-0-5);
  --ui-button-dropdown-item-after-width: calc(100% - var(--spacing-1-5) - var(--spacing-1-5));
  --ui-button-dropdown-item-after-border-color: var(--color-neutral-300);
  --ui-button-dropdown-item-after-border-bottom: 1px solid var(--ui-button-dropdown-item-after-border-color);

  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;
  cursor: pointer;
  text-align: left;
  padding: var(--ui-button-dropdown-item-padding);
  font-size: var(--ui-button-dropdown-item-font-size);
  background-color: var(--ui-button-dropdown-item-background-color);
  gap: var(--ui-button-dropdown-item-gap);
  color: var(--ui-button-dropdown-item-color);
}

.ui-button-dropdown__item:not(:last-child)::after {
  content: '';
  position: absolute;
  width: var(--ui-button-dropdown-item-after-width);
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-bottom: var(--ui-button-dropdown-item-after-border-bottom);
}

.ui-button-dropdown__item:not(.ui-button-dropdown__item--disabled):hover {
  background-color: var(--ui-button-dropdown-item-hover-background-color);
}

.ui-button-dropdown__item--disabled {
  color: var(--ui-button-dropdown-item-disabled-color);
  cursor: not-allowed;
}
</style>
