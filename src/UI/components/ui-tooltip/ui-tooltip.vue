<template>
  <div :class="classes">
    <div
      class="ui-tooltip__surface"
      ref="surface"
    >
      <!-- @slot контент ко тригеру которого будет появляться подсказка -->
      <slot />
    </div>
    <span
      ref="tooltip"
      class="ui-tooltip__help"
    >
      <!-- @slot слот на случай если вместо текста нужно отобразить кастомный контент в подсказке -->
      <div
        :style="panelStyle"
        class="ui-scrollbar--sm"
      >
        <slot name="content">
          {{ text }}
        </slot>
      </div>
      <div
        class="ui-tooltip__arrow"
        data-popper-arrow
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, ComputedRef, computed } from 'vue';
import { usePopperjs } from 'vue-use-popperjs';
import { Placement } from '@popperjs/core';
import { ClassPropsType } from '../../@types/props';

// FIXME: При первом появлении подсказки у страницы появляется скрол
export interface UiTooltipPropsImpl {
  /** текст подсказки */
  text?: string;
  /** описывает предпочтительное размещение подсказки */
  placement?: Placement;
  /** действие при котором появляется подсказка */
  trigger?: 'hover' | 'click-to-open' | 'click-to-toggle' | 'manual';
  /** смещение подсказки по оси X */
  offsetX?: number | string;
  /** смещение подсказки по оси Y */
  offsetY?: number | string;
  /** описывает используемую стратегию позиционирования */
  strategy?: 'absolute' | 'fixed';
  /** задержка перед появлением подсказки. работает только если trigger = "hover" */
  delayOnMouseover?: number | string;
  /** задержка перед исчезновением подсказки. работает только если trigger = "hover" */
  delayOnMouseout?: number | string;
  /** принудительно показать подсказку */
  forceShow?: boolean;
  /** запретить перенос текста на следующую строку */
  noWrap?: boolean;
  /**
   * модификатор preventOverflow предотвращает обрезание поппера,
   * перемещая его так, чтобы он оставался видимым в пределах своей граничной области
   */
  preventOverflow?: boolean;
  /** Ширина панели тултипа в px */
  panelWidth?: number;
  /** Максимальная высота панели тултипа в px */
  panelMaxHeight?: number;
}

const props = withDefaults(defineProps<UiTooltipPropsImpl>(), {
  placement: 'auto',
  trigger: 'hover',
  delayOnMouseover: 200,
  delayOnMouseout: 200,
  forceShow: false,
  offsetX: 0,
  offsetY: 8,
  preventOverflow: true,
});

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-tooltip',
  {
    'ui-tooltip--no-wrap': props.noWrap,
  },
]);

const surface = ref();
const tooltip = ref();
const panelStyle = computed<string | undefined>(() => {
  const width = props.panelWidth ? `width:${props.panelWidth}px;` : undefined;
  const height = props.panelMaxHeight ? `max-height:${props.panelMaxHeight}px;` : undefined;

  return width || height ? `padding-right:2px; overflow:auto; ${width || ''}${height || ''}` : undefined;
});

usePopperjs(surface, tooltip, {
  trigger: props.trigger,
  placement: props.placement,
  strategy: props.strategy,
  delayOnMouseover: Number(props.delayOnMouseover) || 200,
  delayOnMouseout: Number(props.delayOnMouseout) || 200,
  forceShow: props.forceShow,
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [props.offsetX, props.offsetY],
      },
    },
    {
      name: 'preventOverflow',
      options: {
        mainAxis: props.preventOverflow,
      },
    },
    {
      name: 'flip',
      options: {
        fallbackPlacements: ['top', 'bottom'],
      },
    },
  ],
});

</script>
<style>
.ui-tooltip .vue-use-popperjs-none {
  display: none;
}

.ui-tooltip {
  --tooltip-container: inline-block;
  --tooltip-shadow: var(--shadow-md);
  --tooltip-radius: var(--radius-sm);
  --tooltip-background-color: var(--color-neutral-0);
  --tooltip-font-size: var(--paragraph-xs-font-size);
  --tooltip-line-height: var(--paragraph-xs-line-height);
  --tooltip-font-weight: var(--paragraph-xs-font-weight);
  --tooltip-letter-spacing: var(--paragraph-xs-letter-spacing);
  --tooltip-text-color: var(--color-text-primary);
  --tooltip-spacing: var(--spacing-1-5);
  --tooltip-arrow-width: 8px;
  --tooltip-arrow-height: 8px;
  --tooltip-z-index: 30;

  position: relative;
  display: var(--tooltip-container);
}

.ui-tooltip__help {
  box-shadow: var(--tooltip-shadow);
  border-radius: var(--tooltip-radius);
  background-color: var(--tooltip-background-color);
  font-family: var(--tooltip-font-family);
  font-size: var(--tooltip-font-size);
  line-height: var(--tooltip-line-height);
  font-weight: var(--tooltip-font-weight);
  letter-spacing: var(--tooltip-letter-spacing);
  color: var(--tooltip-text-color);
  padding: var(--tooltip-spacing);
  white-space: normal;
  z-index: var(--tooltip-z-index);
}

.ui-tooltip--no-wrap .ui-tooltip__help {
  white-space: nowrap;
}

.ui-tooltip__arrow,
.ui-tooltip__arrow::before {
  position: absolute;
  width: var(--tooltip-arrow-width);
  height: var(--tooltip-arrow-height);
  background: inherit;
  background-color: var(--tooltip-background-color);
}

.ui-tooltip__arrow {
  visibility: hidden;
}

.ui-tooltip__arrow::before {
  visibility: visible;
  content: '';
  transform: rotate(45deg);
  left: 0;
  top: 0;
}

.ui-tooltip__help[data-popper-placement^='top']>.ui-tooltip__arrow {
  bottom: -4px;
}

.ui-tooltip__help[data-popper-placement^='bottom']>.ui-tooltip__arrow {
  top: -4px;
}

.ui-tooltip__help[data-popper-placement^='left']>.ui-tooltip__arrow {
  right: -4px;
}

.ui-tooltip__help[data-popper-placement^='right']>.ui-tooltip__arrow {
  left: -4px;
}
</style>
