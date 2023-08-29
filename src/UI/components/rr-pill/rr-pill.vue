<template>
  <span
    :class="classes"
    v-on="$listeners"
    @click="emit('click', $event)"
  >
    <!--@slot Слот на случай, если нужно что-либо вывести вместо текста-->
    <slot>
      {{ props.text }}
    </slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ClassPropsType } from '../../@types/props';

export interface RrPillPropsImpl {
  /** Текст для отображения в компоненте */
  text?: string;
  /** Тип отображения компонента */
  type?: 'primary' | 'secondary';
  /** Тема компонента */
  theme?: 'default' | 'accent' | 'success' | 'warning' | 'error' | 'cyan' | 'purple' | 'orange';
  /** Скрыть маркер (работает только с типом secondary) */
  hideMarker?: boolean;
  /** Растянуть на всю ширину */
  stretch?: boolean;
  /** Курсор pointer */
  pointer?: boolean;
}

const props = withDefaults(defineProps<RrPillPropsImpl>(), {
  type: 'primary',
  theme: 'default',
  hideMarker: false,
  stretch: false,
  pointer: false,
});

const emit = defineEmits<{
  /** Событие клика */
  (e: 'click', value: Event): void;
}>();

const classes = computed<ClassPropsType>(() => [
  'ui-pill',
  `ui-pill--${props.type}`,
  `ui-pill--${props.theme}`,
  [
    { 'ui-pill--hide-marker': props.hideMarker },
    { 'ui-pill--stretch': props.stretch },
    { 'ui-pill--pointer': props.pointer },
  ],
]);
</script>

<style>
.ui-pill {
  --pill-height: 23px;
  --pill-gap: var(--spacing-0-5);
  --pill-border-radius: var(--radius-xxl);

  /** ui-pill marker */

  --pill-marker-width: 6px;
  --pill-marker-height: 6px;
  --pill-marker-border-radius: var(--radius-round);

  /** ui-pill primary type */

  --pill-primary-paddings: var(--spacing-0-5) var(--spacing-1-5);

  /** ui-pill secondary type */

  --pill-secondary-background-color: var(--color-neutral-0);
  --pill-secondary-paddings: var(--spacing-0-5) var(--spacing-1);
  --pill-secondary-hide-marker-paddings: var(--pill-primary-paddings);
  --pill-secondary-color: var(--color-text-primary);
  --pill-secondary-border-color: var(--color-neutral-200);
  --pill-secondary-border: 1px solid var(--pill-secondary-border-color);

  /** ui-pill font */

  --pill-font-size: var(--paragraph-sm-font-size);
  --pill-font-weight: var(--paragraph-sm-font-weight);

  /** ui-pill default theme */
  --ui-pill-default-background-color: var(--color-neutral-200);
  --ui-pill-default-color: var(--color-text-primary);
  --ui-pill-default-marker-color: var(--color-text-secondary);

  /** ui-pill accent theme */
  --ui-pill-accent-background-color: var(--color-primary-100);
  --ui-pill-accent-color: var(--color-primary-500);
  --ui-pill-accent-marker-color: var(--color-primary-500);

  /** ui-pill error theme */
  --ui-pill-error-background-color: var(--color-error-100);
  --ui-pill-error-color: var(--color-error-500);
  --ui-pill-error-marker-color: var(--color-error-500);

  /** ui-pill success theme */
  --ui-pill-success-background-color: var(--color-success-100);
  --ui-pill-success-color: var(--color-success-500);
  --ui-pill-success-marker-color: var(--color-success-500);

  /** ui-pill warning theme */
  --ui-pill-warning-background-color: var(--color-warning-100);
  --ui-pill-warning-color: var(--color-warning-500);
  --ui-pill-warning-marker-color: var(--color-warning-500);

  /** ui-pill purple theme */
  --ui-pill-purple-background-color: var(--color-purple-100);
  --ui-pill-purple-color: var(--color-purple-500);
  --ui-pill-purple-marker-color: var(--color-purple-500);

  /** ui-pill cyan theme */
  --ui-pill-cyan-background-color: var(--color-cyan-100);
  --ui-pill-cyan-color: var(--color-cyan-500);
  --ui-pill-cyan-marker-color: var(--color-cyan-500);

  /** ui-pill orange theme */
  --ui-pill-orange-background-color: var(--color-orange-100);
  --ui-pill-orange-color: var(--color-orange-500);
  --ui-pill-orange-marker-color: var(--color-orange-500);

  /** ui-pill custom theme */
  --ui-pill-custom-background-color: var(--ui-pill-default-background-color);
  --ui-pill-custom-color: var(--ui-pill-default-color);
  --ui-pill-custom-marker-color: var(--ui-pill-default-marker-color);

  border-radius: var(--pill-border-radius);
  font-size: var(--pill-font-size);
  font-weight: var(--pill-font-weight);
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: var(--pill-gap);
  height: var(--pill-height);
}

.ui-pill--stretch {
  width: 100%;
}

.ui-pill--pointer {
  cursor: pointer;
}

/** ui-pill types */

.ui-pill--primary {
  padding: var(--pill-primary-paddings);
  color: var(--pill-default-color);
}

.ui-pill--secondary {
  padding: var(--pill-secondary-paddings);
  background-color: var(--pill-secondary-background-color);
  color: var(--pill-secondary-color);
  border: var(--pill-secondary-border);
}

.ui-pill--secondary:is(.ui-pill--hide-marker) {
  padding: var(--pill-secondary-hide-marker-paddings);
}

.ui-pill--secondary:not(.ui-pill--hide-marker)::before {
  content: '';
  width: var(--pill-marker-width);
  height: var(--pill-marker-height);
  border-radius: var(--pill-marker-border-radius);
}

/** ui-pill default theme */

.ui-pill--default:is(.ui-pill--primary) {
  background-color: var(--ui-pill-default-background-color);
  color: var(--ui-pill-default-color);
}

.ui-pill--default:is(.ui-pill--secondary)::before {
  background-color: var(--ui-pill-default-marker-color);
}

/** ui-pill success theme */

.ui-pill--success:is(.ui-pill--primary) {
  background-color: var(--ui-pill-success-background-color);
  color: var(--ui-pill-success-color);
}

.ui-pill--success:is(.ui-pill--secondary)::before {
  background-color: var(--ui-pill-success-marker-color);
}

/** ui-pill warning theme */

.ui-pill--warning:is(.ui-pill--primary) {
  background-color: var(--ui-pill-warning-background-color);
  color: var(--ui-pill-warning-color);
}

.ui-pill--warning:is(.ui-pill--secondary)::before {
  background-color: var(--ui-pill-warning-marker-color);
}

/** ui-pill accent theme */

.ui-pill--accent:is(.ui-pill--primary) {
  background-color: var(--ui-pill-accent-background-color);
  color: var(--ui-pill-accent-color);
}

.ui-pill--accent:is(.ui-pill--secondary)::before {
  background-color: var(--ui-pill-accent-marker-color);
}

/** ui-pill error theme */

.ui-pill--error:is(.ui-pill--primary) {
  background-color: var(--ui-pill-error-background-color);
  color: var(--ui-pill-error-color);
}

.ui-pill--error:is(.ui-pill--secondary)::before {
  background-color: var(--ui-pill-error-marker-color);
}

/** ui-pill purple theme */

.ui-pill--purple:is(.ui-pill--primary) {
  background-color: var(--ui-pill-purple-background-color);
  color: var(--ui-pill-purple-color);
}

.ui-pill--purple:is(.ui-pill--secondary)::before {
  background-color: var(--ui-pill-purple-marker-color);
}

/** ui-pill cyan theme */

.ui-pill--cyan:is(.ui-pill--primary) {
  background-color: var(--ui-pill-cyan-background-color);
  color: var(--ui-pill-cyan-color);
}

.ui-pill--cyan:is(.ui-pill--secondary)::before {
  background-color: var(--ui-pill-cyan-marker-color);
}

/** ui-pill orange theme */

.ui-pill--orange:is(.ui-pill--primary) {
  background-color: var(--ui-pill-orange-background-color);
  color: var(--ui-pill-orange-color);
}

.ui-pill--orange:is(.ui-pill--secondary)::before {
  background-color: var(--ui-pill-orange-marker-color);
}

/** ui-pill custom theme */

.ui-pill--custom:is(.ui-pill--primary) {
  background-color: var(--ui-pill-custom-background-color);
  color: var(--ui-pill-custom-color);
}

.ui-pill--custom:is(.ui-pill--secondary)::before {
  background-color: var(--ui-pill-custom-marker-color);
}
</style>
