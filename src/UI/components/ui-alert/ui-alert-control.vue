<template>
  <button
    class="ui-alert__control"
    type="button"
    @click="emit('click', $event)"
  >
    <ui-icon :name="icon" />
  </button>
</template>
<script setup lang="ts">
export interface UiAlertRemovePropsImpl {
  /** иконка */
  icon: IconsNamesType;
}

const props = defineProps<UiAlertRemovePropsImpl>();

const emit = defineEmits<{
  /** клик по кнопке */
  (e: 'click', event: MouseEvent): void;
}>();
</script>
<style>
.ui-alert__control {
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: var(--alert-color-dark);
  transition: color .3s ease, background-color .3s ease;
  border-radius: var(--alert-control-border-radius);
  padding: var(--alert-control-padding);
}

.ui-alert__control:hover {
  background-color: var(--alert-color-background-dark-control-hover);
}

.ui-alert--md .ui-alert__control--remove {
  position: absolute;
  top: calc(var(--alert-md-vertical-spacing) - var(--alert-control-padding));
  right: calc(var(--alert-md-horizontal-spacing) - var(--alert-control-padding));
}

.ui-alert--lg .ui-alert__control--remove {
  position: absolute;
  top: calc(var(--alert-lg-vertical-spacing) - var(--alert-control-padding));
  right: calc(var(--alert-lg-horizontal-spacing) - var(--alert-control-padding));
}

.ui-alert--theme-light .ui-alert__control {
  color: var(--alert-color-light);
}

.ui-alert--theme-light .ui-alert__control:hover {
  background-color: var(--alert-color-background-light-control-hover);
}

.ui-alert--fill-bg.ui-alert--type-success .ui-alert__control {
  color: var(--alert-text-color-success);
}

.ui-alert--fill-bg.ui-alert--type-success .ui-alert__control:hover {
  color: var(--alert-text-color-hover-success);
  background-color: var(--alert-background-color-success-control-hover);
}

.ui-alert--fill-bg.ui-alert--type-attention .ui-alert__control {
  color: var(--alert-text-color-attention);
}

.ui-alert--fill-bg.ui-alert--type-attention .ui-alert__control:hover {
  color: var(--alert-text-color-hover-attention);
  background-color: var(--alert-background-color-attention-control-hover);
}

.ui-alert--fill-bg.ui-alert--type-error .ui-alert__control {
  color: var(--alert-text-color-error);
}

.ui-alert--fill-bg.ui-alert--type-error .ui-alert__control:hover {
  color: var(--alert-text-color-hover-error);
  background-color: var(--alert-background-color-error-control-hover);
}

.ui-alert--fill-bg.ui-alert--type-information .ui-alert__control {
  color: var(--alert-text-color-information);
}

.ui-alert--fill-bg.ui-alert--type-information .ui-alert__control:hover {
  color: var(--alert-text-color-hover-information);
  background-color: var(--alert-background-color-information-control-hover);
}
</style>
