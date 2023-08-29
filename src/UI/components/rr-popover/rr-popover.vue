<template>
  <div
    :class="classes"
    ref="component"
    v-click-outside="onOutsideClick"
  >
    <slot
      name="trigger"
      v-bind="slotOptions"
    />
    <ui-popover-panel
      :class="panelClasses"
      :max-height="panelMaxHeight"
      :animate-showing="panelAnimateShowing"
      :width="panelWidth"
      :use-arrow="useArrow"
      ref="panel"
    >
      <slot
        name="content"
        v-bind="slotOptions"
      />
    </ui-popover-panel>
  </div>
</template>

<script setup lang="ts">
import {
  onBeforeUnmount,
  ComputedRef,
  computed,
  ref,
} from 'vue';
import { usePopperjs } from 'vue-use-popperjs';
import { ClassPropsType } from '../../@types/props';
import RrPopoverPanel from './ui-popover-panel.vue';

export interface RrPopoverPropsImpl {
  /** расположение панели */
  placement?: 'bottom' | 'bottom-start' | 'bottom-end';
  /** фиксированная ширина панели */
  panelWidth?: number;
  /** максимальная высота панели */
  panelMaxHeight?: number;
  /** добавить анимацию появляния панели */
  panelAnimateShowing?: boolean;
  /** описывает используемую стратегию позиционирования */
  strategy?: 'absolute' | 'fixed';
  /** смещение подсказки по оси X */
  offsetX?: number | string;
  /** смещение подсказки по оси Y */
  offsetY?: number | string;
  /** показывать стрелку панели */
  useArrow?: boolean;
  /** закрыть по клику вну поповера */
  closeByClickOutside?: boolean;
}

const props = withDefaults(defineProps<RrPopoverPropsImpl>(), {
  placement: 'bottom',
  offsetX: 0,
  offsetY: 0,
  closeByClickOutside: true,
});

const emit = defineEmits<{
  /** Событие при отображении панели */
  (e: 'onShow'): void;
  /** Событие при скрытии панели */
  (e: 'onHide'): void;
}>();

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-popover',
  {

  },
]);

const component = ref();
const trigger = computed(() => {
  const customTrigger = component.value.querySelector('[data-ui-popover-trigger]');
  const triggerElement = customTrigger || component.value.querySelector('.ui-popover > *:first-child');
  return triggerElement;
});
const panel = ref();
const { instance, visible } = usePopperjs(trigger, panel, {
  trigger: 'manual',
  placement: props.placement,
  strategy: props.strategy,
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
        mainAxis: true,
      },
    },
    {
      name: 'flip',
      options: {
        fallbackPlacements: ['top', 'bottom'],
      },
    },
  ],
  onShow: () => {
    emit('onShow');
  },
  onHide: () => {
    emit('onHide');
  },
});

const panelClasses = ref(['ui-popover__panel']);

const toggle = () => {
  visible.value = !visible.value;
};

const shake = (timeout: number = 500) => {
  setTimeout(() => {
    panelClasses.value.push('ui-popover__panel--shake');
    setTimeout(() => {
      panelClasses.value.splice(1, 1);
    }, timeout);
  }, 300);
};

const open = (delay: number = 0) => {
  setTimeout(() => {
    visible.value = true;
  }, delay);
};

const close = (delay: number = 0) => {
  setTimeout(() => {
    visible.value = false;
  }, delay);
};

const onOutsideClick = () => {
  if (props.closeByClickOutside) {
    close();
  }
};

const slotOptions = {
  isShow: visible,
  toggle,
  open,
  close,
  update: () => instance.value?.forceUpdate(),
};
onBeforeUnmount(() => {
  instance.value?.destroy();
});

defineExpose({
  visible,
  open,
  toggle,
  close,
  shake,
});
</script>
<style>
.ui-popover {
  position: relative;
  width: fit-content;
}

.ui-popover__panel--shake .ui-popover-panel__container-wrapper {
  animation: horizontal-shaking .5s ease;
  animation-iteration-count: infinite;
}
</style>
