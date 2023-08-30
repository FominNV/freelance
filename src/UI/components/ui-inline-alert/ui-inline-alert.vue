<template>
  <div :class="classes">
    <ui-space
      direction="vertical"
      size="0-5"
      justify="center"
    >
      <ui-space
        size="1"
        align="center"
      >
        <ui-icon
          v-if="!hideIcon"
          :name="icon"
          style="flex-shrink: 0;"
          :color="props.icon ? 'current' : 'none'"
          size="sm"
        />
        <ui-subtitle
          v-if="title"
          :text="title"
          size="sm"
        />
      </ui-space>
      <ui-text
        v-if="text"
        :text="text"
        size="sm"
        v-ui-color:text="'text-secondary'"
        class="ui-inline-alert__caption"
      />
    </ui-space>
    <ui-space
      size="1"
      align="start"
      v-if="$slots['right-container'] || !hideCloseButton"
    >
      <slot name="right-container" />
      <button
        class="ui-inline-alert__close-btn"
        type="button"
        v-if="!hideCloseButton"
        @click="emit('click:close', $event)"
      >
        <ui-icon name="system/xmark-small" />
      </button>
    </ui-space>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ClassPropsType } from '../../@types/props';

export interface UiInlineAlertPropsImpl {
  theme?: 'default' | 'error' | 'primary' | 'warning' | 'success';
  title?: string;
  text?: string;
  hideCloseButton?: boolean;
  hideIcon?: boolean;
  icon?: IconsNamesType,
}

const props = withDefaults(defineProps<UiInlineAlertPropsImpl>(), {
  theme: 'default',
  hideCloseButton: false,
  hideIcon: false,
});

const emit = defineEmits<{
  /** событие клика */
  (e: 'click:close', v: MouseEvent): void;
}>();

const icon = computed<IconsNamesType>(() => {
  if (props.icon) {
    return props.icon;
  }

  switch (props.theme) {
    case 'default': return 'system/information';
    case 'error': return 'system/error-invert';
    case 'success': return 'system/success-invert';
    case 'warning': return 'system/attention-invert';
    case 'primary': return 'system/information-invert';
    default: return 'system/information';
  }
});

const classes = computed<ClassPropsType>(() => [
  'ui-inline-alert',
  `ui-inline-alert--${props.theme}`,
]);

</script>
<style>
.ui-inline-alert {
  --inline-alert-width: 100%;
  --inline-alert-padding: var(--spacing-1-5) var(--spacing-2);
  --inline-alert-border-radius: var(--radius-lg);
  --inline-alert-caption-margin-left: var(--spacing-3);

  --inline-alert-default-border: 1px solid var(--color-neutral-300);
  --inline-alert-default-background-color: var(--color-neutral-100);

  --inline-alert-primary-border: 1px solid var(--color-primary-300);
  --inline-alert-primary-background-color: var(--color-primary-100);

  --inline-alert-success-border: 1px solid var(--color-success-300);
  --inline-alert-success-background-color: var(--color-success-100);

  --inline-alert-warning-border: 1px solid var(--color-warning-300);
  --inline-alert-warning-background-color: var(--color-warning-100);

  --inline-alert-error-border: 1px solid var(--color-error-300);
  --inline-alert-error-background-color: var(--color-error-100);

  --inline-alert-close-button-color: var(--color-text-placeholder);
  --inline-alert-close-button-hover-color: var(--color-text-secondary);
  --inline-alert-close-button-border-radius: var(--radius-sm);
  --inline-alert-close-button-outline: 4px solid var(--color-neutral-300);

  display: flex;
  justify-content: space-between;
  position: relative;
  width: var(--inline-alert-width);
  padding: var(--inline-alert-padding);
  border-radius: var(--inline-alert-border-radius);
}

/** default theme */

.ui-inline-alert--default {
  background-color: var(--inline-alert-default-background-color);
  border: var(--inline-alert-default-border);
}

/** primary theme */

.ui-inline-alert--primary {
  background-color: var(--inline-alert-primary-background-color);
  border: var(--inline-alert-primary-border);
}

/** success theme */

.ui-inline-alert--success {
  background-color: var(--inline-alert-success-background-color);
  border: var(--inline-alert-success-border);
}

/** warning theme */

.ui-inline-alert--warning {
  background-color: var(--inline-alert-warning-background-color);
  border: var(--inline-alert-warning-border);
}

/** error theme */

.ui-inline-alert--error {
  background-color: var(--inline-alert-error-background-color);
  border: var(--inline-alert-error-border);
}

/** close button */

.ui-inline-alert__close-btn {
  display: block;
  background-color: transparent;
  border-radius: var(--inline-alert-close-button-border-radius);
  border: none;
  color: var(--inline-alert-close-button-color);
  transition: color .2s ease;
}

.ui-inline-alert__close-btn:hover {
  cursor: pointer;
  color: var(--inline-alert-close-button-hover-color);
}

.ui-inline-alert__close-btn:focus-visible {
  outline: var(--inline-alert-close-button-outline);
}

.ui-inline-alert__caption {
  margin-left: var(--inline-alert-caption-margin-left);
}
</style>
