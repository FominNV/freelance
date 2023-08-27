<template>
  <span :class="classes">
    <span class="ui-badge__text">
      <!-- @slot конент -->
      <slot />
    </span>
  </span>
</template>

<script setup lang="ts">
import { ComputedRef, computed } from 'vue';
import { BadgeThemesType } from './const';
import { ClassPropsType } from '../../@types/props';

export interface UiBadgePropsImpl {
  /** тема бейджа */
  theme?: BadgeThemesType;
  /** тип бейджа */
  type?: 'fill' | 'outlined';
}

const props = withDefaults(defineProps<UiBadgePropsImpl>(), {
  theme: 'default',
  type: 'fill',
});

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-badge',
  {
    [`ui-badge--theme-${props.theme}`]: props.theme,
    'ui-badge--type-outlined': props.type === 'outlined',
  },
]);

</script>
<style>
.ui-badge {
  --badge-border-color: var(--color-neutral-0);

  --badge-default-background-color: var(--color-primary-500);
  --badge-default-border-color: var(--color-primary-500);
  --badge-default-color: var(--color-text-inversion);

  --badge-font-size: var(--subtitle-xs-font-size);
  --badge-line-height: var(--subtitle-xs-line-height);
  --badge-font-weight: var(--subtitle-xs-font-weight);
  --badge-letter-spacing: var(--subtitle-xs-letter-spacing);

  --badge-padding: var(--spacing-0-25) var(--spacing-0-75);
  --badge-text-spacing: var(--spacing-0-75);

  --badge-success-background-color: var(--color-success-500);
  --badge-success-border-color: var(--color-success-500);
  --badge-success-text-color: var(--color-text-inversion);

  --badge-warning-background-color: var(--color-warning-500);
  --badge-warning-border-color: var(--color-warning-500);
  --badge-warning-text-color: var(--color-text-inversion);

  --badge-error-background-color: var(--color-error-500);
  --badge-error-border-color: var(--color-error-500);
  --badge-error-text-color: var(--color-text-inversion);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: var(--badge-font-size);
  font-weight: var(--badge-font-weight);
  line-height: var(--badge-line-height);
  letter-spacing: var(--badge-letter-spacing);
  color: var(--badge-default-color);
  background-color: var(--badge-default-background-color);
  border: 1px solid var(--badge-border-color);
  padding: var(--badge-padding);
  min-width: 16px;
  width: fit-content;
  height: 18px;
  border-radius: 20px;
  vertical-align: middle;
}

.ui-badge .ui-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
}

.ui-badge__text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0 var(--badge-text-spacing);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ui-badge--theme-success {
  background-color: var(--badge-success-background-color);
  color: var(--badge-success-text-color);
}

.ui-badge--theme-warning {
  background-color: var(--badge-warning-background-color);
  color: var(--badge-warning-text-color);
}

.ui-badge--theme-error {
  background-color: var(--badge-error-background-color);
  color: var(--badge-error-text-color);
}

.ui-badge--type-outlined {
  background-color: transparent;
}

.ui-badge--theme-default.ui-badge--type-outlined {
  color: var(--badge-default-border-color);
  border-color: var(--badge-default-border-color);
}

.ui-badge--theme-success.ui-badge--type-outlined {
  color: var(--badge-success-border-color);
  border-color: var(--badge-success-border-color);
}

.ui-badge--theme-warning.ui-badge--type-outlined {
  color: var(--badge-warning-border-color);
  border-color: var(--badge-warning-border-color);
}

.ui-badge--theme-error.ui-badge--type-outlined {
  color: var(--badge-error-border-color);
  border-color: var(--badge-error-border-color);
}
</style>
