<template>
  <div :class="classes">
    <!-- @slot слот для размещения кнопок которые будут объединены в группу -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, computed } from 'vue';
import { ClassPropsType } from '../../@types/props';

export interface UiButtonGroupPropsImpl {
  /** флаг отвечающий за отображение границ между кнопками */
  borders?: boolean;
}

const props = withDefaults(defineProps<UiButtonGroupPropsImpl>(), {
  //
});

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-button-group',
  {
    'ui-button-group--bordered': props.borders,
  },
]);

</script>
<style>
/** TODO: нужно отрефакторить стили */
.ui-button-group {
  position: relative;
  display: inline-flex;
  align-items: stretch;
  justify-content: center;
}

.ui-button-group--bordered {
  gap: 0 1px;
}

.ui-button-group>.ui-button:not(:first-child, :last-child) {
  border-radius: 0;
}

.ui-button-group>.ui-button:not(:first-child, :last-child):is([class*="-outlined"]) {
  border-left: none;
  border-right: none;
}

.ui-button-group--bordered>.ui-button+.ui-popover .ui-button:before,
.ui-button-group--bordered>.ui-button+.ui-popover .ui-button:after,
.ui-button-group--bordered>.ui-popover+.ui-button:before,
.ui-button-group--bordered>.ui-popover+.ui-button:after,
.ui-button-group--bordered>.ui-popover+.ui-popover .ui-button:before,
.ui-button-group--bordered>.ui-popover+.ui-popover .ui-button:after,
.ui-button-group--bordered>.ui-tooltip+.ui-tooltip .ui-button:before,
.ui-button-group--bordered>.ui-tooltip+.ui-tooltip .ui-button:after,
.ui-button-group--bordered>.ui-button+.ui-button:before,
.ui-button-group--bordered>.ui-button+.ui-button:after {
  content: '';
  position: absolute;
  width: 1px;
}
.ui-button-group>.ui-popover+.ui-button:before,
.ui-button-group>.ui-button+.ui-popover .ui-button:before,
.ui-button-group>.ui-popover+.ui-popover .ui-button:before,
.ui-button-group>.ui-tooltip+.ui-tooltip .ui-button:before,
.ui-button-group>.ui-button+.ui-button:before {
  height: 100%;
  left: -1px;
  top: 0;
}

.ui-button-group>.ui-popover+.ui-button::after,
.ui-button-group>.ui-button+.ui-popover .ui-button::after,
.ui-button-group>.ui-popover+.ui-popover .ui-button::after,
.ui-button-group>.ui-tooltip+.ui-tooltip .ui-button::after,
.ui-button-group>.ui-button+.ui-button:after {
  height: 70%;
  left: 0;
  top: 50%;
  transform: translate(-1px, -50%);
}

.ui-button-group>.ui-popover+.ui-popover .ui-button.ui-button--theme-default:before,
.ui-button-group>.ui-tooltip+.ui-tooltip .ui-button.ui-button--theme-default:before,
.ui-button-group>.ui-button+.ui-button.ui-button--theme-default:before {
  background-color: var(--button-default-background-color);
}

.ui-button-group>.ui-popover+.ui-popover .ui-button.ui-button--theme-default:after,
.ui-button-group>.ui-tooltip+.ui-tooltip .ui-button.ui-button--theme-default:after,
.ui-button-group>.ui-button+.ui-button.ui-button--theme-default:after {
  background-color: var(--color-neutral-300);
}

.ui-button-group>.ui-popover+.ui-popover .ui-button.ui-button--theme-default-outlined:before,
.ui-button-group>.ui-tooltip+.ui-tooltip .ui-button.ui-button--theme-default-outlined:before,
.ui-button-group>.ui-button+.ui-button.ui-button--theme-default-outlined:before {
  top: -1px;
  border-top: 1px solid var(--button-default-background-color);
  border-bottom: 1px solid var(--button-default-background-color);
}

.ui-button-group>.ui-popover+.ui-popover .ui-button.ui-button--theme-default-outlined:after,
.ui-button-group>.ui-tooltip+.ui-tooltip .ui-button.ui-button--theme-default-outlined:after,
.ui-button-group>.ui-button+.ui-button.ui-button--theme-default-outlined:after {
  background-color: var(--button-default-background-color);
}

.ui-button-group>.ui-popover+.ui-popover .ui-button.ui-button--theme-primary:before,
.ui-button-group>.ui-tooltip+.ui-tooltip .ui-button.ui-button--theme-primary:before,
.ui-button-group>.ui-button+.ui-button.ui-button--theme-primary:before {
  background-color: var(--button-primary-background-color);
}

.ui-button-group>.ui-popover+.ui-popover .ui-button.ui-button--theme-primary:after,
.ui-button-group>.ui-tooltip+.ui-tooltip .ui-button.ui-button--theme-primary:after,
.ui-button-group>.ui-button+.ui-button.ui-button--theme-primary:after {
  background-color: var(--button-primary-focus-border-color);
}

.ui-button-group>.ui-popover+.ui-popover .ui-button.ui-button--theme-primary-outlined:before,
.ui-button-group>.ui-tooltip+.ui-tooltip .ui-button.ui-button--theme-primary-outlined:before,
.ui-button-group>.ui-button+.ui-button.ui-button--theme-primary-outlined:before {
  top: -1px;
  border-top: 1px solid var(--button-primary-background-color);
  border-bottom: 1px solid var(--button-primary-background-color);
}

.ui-button-group>.ui-popover+.ui-popover .ui-button.ui-button--theme-primary-outlined::after,
.ui-button-group>.ui-tooltip+.ui-tooltip .ui-button.ui-button--theme-primary-outlined::after,
.ui-button-group>.ui-button+.ui-button.ui-button--theme-primary-outlined:after {
  background-color: var(--button-primary-background-color);
}

.ui-button-group>.ui-button+.ui-popover .ui-button.ui-button--theme-toolbar:before,
.ui-button-group>.ui-popover+.ui-popover .ui-button.ui-button--theme-toolbar:before,
.ui-button-group>.ui-popover+.ui-button.ui-button--theme-toolbar:before,
.ui-button-group>.ui-tooltip+.ui-tooltip .ui-button.ui-button--theme-toolbar:before,
.ui-button-group>.ui-button+.ui-button.ui-button--theme-toolbar:before {
  background-color: var(--button-toolbar-background-color);
}

.ui-button-group>.ui-button+.ui-popover .ui-button.ui-button--theme-toolbar:after,
.ui-button-group>.ui-popover+.ui-popover .ui-button.ui-button--theme-toolbar:after,
.ui-button-group>.ui-popover+.ui-button.ui-button--theme-toolbar:after,
.ui-button-group>.ui-tooltip+.ui-tooltip .ui-button.ui-button--theme-toolbar:after,
.ui-button-group>.ui-button+.ui-button.ui-button--theme-toolbar:after {
  background-color: var(--color-neutral-300);
}

.ui-button-group>.ui-popover:first-child>.ui-button,
.ui-button-group>.ui-tooltip:first-child .ui-button,
.ui-button-group>.ui-button:first-child {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}

.ui-button-group>.ui-popover:last-child>.ui-button,
.ui-button-group>.ui-tooltip:last-child .ui-button,
.ui-button-group>.ui-button:last-child {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: none;
}
</style>
