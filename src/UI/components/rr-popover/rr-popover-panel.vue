<template>
  <div :class="classes">
    <div
      class="ui-popover-panel__arrow"
      data-popper-arrow
      v-if="useArrow"
    />
    <div
      class="ui-popover-panel__container-wrapper"
      :style="{ maxHeight: `${maxHeight}px`, width: `${width}px` }"
    >
      <div class="ui-popover-panel__container ui-scrollbar--sm ui-scrollbar--margin">
        <!-- @slot контент панели -->
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComputedRef, computed } from 'vue';
import { ClassPropsType } from '../../@types/props';
// TODO: Проработать анимации панели
export interface RrPopoverPropsImpl {
  /** максимальная высота панели */
  maxHeight?: number;
  /** фиксированная ширина панели */
  width?: number;
  /** добавить анимацию появляния панели */
  animateShowing?: boolean;
  /** показывать стрелку */
  useArrow?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<RrPopoverPropsImpl>(), {
  maxHeight: 280,
  useArrow: false,
});

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-popover-panel',
  {
    'ui-popover-panel--animated': props.animateShowing,
  },
]);

</script>

<style>
.ui-popover-panel.vue-use-popperjs-none {
  display: none;
}

.ui-popover-panel {
  --popover-panel-background-color: var(--color-neutral-0);
  --popover-panel-border: 1px solid var(--color-neutral-200);
  --popover-panel-box-shadow: var(--shadow-sm);
  --popover-panel-border-radius: var(--radius-sm);

  --popover-panel-arrow-width: 8px;
  --popover-panel-arrow-height: 8px;

  z-index: 51;
}

.ui-popover-panel--animated {
  animation: popover-slide-in-top-anim .4s ease;
}

.ui-popover-panel__container-wrapper {
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: stretch;
  min-width: 100%;
  background-color: var(--popover-panel-background-color);
  border-radius: var(--popover-panel-border-radius);
  box-shadow: var(--popover-panel-box-shadow);
  border: var(--popover-panel-border);
  border-radius: var(--popover-panel-border-radius);
}

.ui-popover-panel__container {
  width: 100%;
  overflow-y: auto;
  z-index: 1;
}

/** Arrow */

.ui-popover-panel__arrow,
.ui-popover-panel__arrow::before {
  position: absolute;
  width: var(--popover-panel-arrow-width);
  height: var(--popover-panel-arrow-height);
  z-index: 1;
}

.ui-popover-panel__arrow::before {
  visibility: visible;
  content: '';
  transform: rotate(45deg);
  background-color: var(--popover-panel-background-color);
  left: 0;
  top: 0;
}

.ui-popover-panel[data-popper-placement^='top']>.ui-popover-panel__arrow {
  bottom: -4px;
}

.ui-popover-panel[data-popper-placement^='top']>.ui-popover-panel__arrow:before {
  border-right: var(--popover-panel-border);
  border-bottom: var(--popover-panel-border);
}

.ui-popover-panel[data-popper-placement^='bottom']>.ui-popover-panel__arrow {
  top: -4px;
}

.ui-popover-panel[data-popper-placement^='bottom']>.ui-popover-panel__arrow:before {
  border-left: var(--popover-panel-border);
  border-top: var(--popover-panel-border);
}

.ui-popover-panel[data-popper-placement^='left']>.ui-popover-panel__arrow {
  right: -4px;
}

.ui-popover-panel[data-popper-placement^='left']>.ui-popover-panel__arrow:before {
  border-top: var(--popover-panel-border);
  border-bottom: var(--popover-panel-border);
}

.ui-popover-panel[data-popper-placement^='right']>.ui-popover-panel__arrow {
  left: -4px;
}

.ui-popover-panel[data-popper-placement^='right']>.ui-popover-panel__arrow:before {
  border-left: var(--popover-panel-border);
  border-right: var(--popover-panel-border);
}
</style>
