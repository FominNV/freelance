<template>
  <div
    :class="containerClassList"
    @click="onBarClick"
    ref="containerRef"
  >
    <span
      class="ui-slider__range"
      :style="rangeStyle"
    />
    <!-- eslint-disable-next-line -->
    <span
      v-if="!range"
      class="ui-slider__handle"
      :style="handleStyle"
      @touchstart="onDragStart($event, 0)"
      @touchmove="onDrag($event)"
      @touchend="onDragEnd"
      @mousedown="onMouseDown($event, 0)"
      role="slider"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="`${modelValue}`"
      :aria-labelledby="ariaLabelledby"
      :aria-label="ariaLabel"
      :aria-orientation="direction"
    />
    <!-- eslint-disable-next-line -->
    <span
      v-if="range"
      class="ui-slider__handle"
      :style="rangeStartHandleStyle"
      @touchstart="onDragStart($event, 0)"
      @touchmove="onDrag($event)"
      @touchend="onDragEnd"
      @mousedown="onMouseDown($event, 0)"
      role="slider"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-labelledby="ariaLabelledby"
      :aria-label="ariaLabel"
      :aria-orientation="direction"
    />
    <!-- eslint-disable-next-line -->
    <span
      v-if="range"
      class="ui-slider__handle"
      :style="rangeEndHandleStyle"
      @touchstart="onDragStart($event, 1)"
      @touchmove="onDrag($event)"
      @touchend="onDragEnd"
      @mousedown="onMouseDown($event, 1)"
      role="slider"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-labelledby="ariaLabelledby"
      :aria-label="ariaLabel"
      :aria-orientation="direction"
    />
  </div>
</template>

<script setup lang="ts">
// TODO: отрефакторить
import {
  computed, reactive, onBeforeUnmount, ref, StyleValue,
} from 'vue';
import { ClassPropsType } from '../../@types/props';
import { UiSliderModelImpl } from './UiSliderModelImpl';

export interface UiSliderPropsImpl {
  /** модель значений */
  modelValue?: number | number[];
  /** минимальное значение */
  min?: number;
  /** максимальное значение */
  max?: number;
  /** направление слайдера */
  direction?: 'horizontal' | 'vertical';
  /**
   * Размер слайдера
   * @param md 240px
   * @param lg 360px
   * @param stretch растягивается под размер родителя
   */
  size?: 'md' | 'lg' | 'stretch'
  /** шаг слайдера */
  step?: number;
  /** для установки диапазона: при true возвращает [number, number] */
  range?: boolean;
  /** отключение слайдера */
  disabled?: boolean;
  /** коллбэк для события onChange */
  onChange?: (value: number | number[]) => void;
  /** установка атрибута 'aria-labelledby' */
  ariaLabelledby?: string;
  /** установка атрибута 'aria-label' */
  ariaLabel?: string;
}

const props = withDefaults(defineProps<UiSliderPropsImpl>(), {
  min: 0,
  max: 100,
  direction: 'horizontal',
  size: 'lg',
});

const emit = defineEmits<{ (e: 'change', value: number | number[]): void }>();
const containerRef = ref();

const modelValue = computed<number | number[]>(() => {
  if (props.range) return Array.isArray(props.modelValue) && (props.modelValue.length >= 2) ? props.modelValue : [props.min, props.max];
  return typeof props.modelValue === 'number' ? props.modelValue : props.min;
});

const model = reactive<UiSliderModelImpl>({
  value: modelValue.value,
  dragging: false,
  handleIndex: 0,
  initX: 0,
  initY: 0,
  barWidth: 0,
  barHeight: 0,
  dragListener: null,
  dragEndListener: null,
});

const containerClassList = computed<ClassPropsType>(() => [
  'ui-slider',
  {
    'ui-slider--disabled': props.disabled,
    [`ui-slider--direction-${props.direction}`]: props.direction,
    [`ui-slider--size-${props.size}`]: props.size,
  },
]);

const horizontal = computed<boolean>(() => props.direction === 'horizontal');

const rangeStartPosition = computed<number>(() => {
  if (model.value && (model.value as number[])[0]) {
    return (((model.value as number[])[0] < props.min ? 0 : (model.value as number[])[0] - props.min) * 100) / (props.max - props.min);
  } else return 0;
});

const rangeEndPosition = computed<number>(() => {
  if (model.value && (model.value as number[]).length === 2) {
    return (((model.value as number[])[1] > props.max ? 100 : (model.value as number[])[1] - props.min) * 100) / (props.max - props.min);
  } else return 100;
});

const handlePosition = computed<number>(() => {
  if (model.value < props.min) return 0;
  else if (model.value > props.max) return 100;
  else return ((model.value as number - props.min) * 100) / (props.max - props.min);
});

const handleStyle = computed<StyleValue>(() => {
  return horizontal.value ? { left: `${handlePosition.value}%` } : { bottom: `${handlePosition.value}%` };
});

const rangeStyle = computed<StyleValue>(() => {
  if (props.range) {
    const rangeSliderWidth = (rangeEndPosition.value > rangeStartPosition.value)
      ? rangeEndPosition.value - rangeStartPosition.value
      : rangeStartPosition.value - rangeEndPosition.value;

    const rangeSliderPosition = rangeEndPosition.value > rangeStartPosition.value ? rangeStartPosition.value : rangeEndPosition.value;
    return horizontal.value
      ? { left: `${rangeSliderPosition}%`, width: `${rangeSliderWidth}%` }
      : { bottom: `${rangeSliderPosition}%`, height: `${rangeSliderWidth}%` };
  } else {
    return horizontal.value ? { width: `${handlePosition.value}%` } : { height: `${handlePosition.value}%` };
  }
});

const rangeStartHandleStyle = computed<StyleValue>(() => {
  return horizontal.value ? { left: `${rangeStartPosition.value}%` } : { bottom: `${rangeStartPosition.value}%` };
});

const rangeEndHandleStyle = computed<StyleValue>(() => {
  return horizontal.value ? { left: `${rangeEndPosition.value}%` } : { bottom: `${rangeEndPosition.value}%` };
});

function updateDomData() {
  const rect: DOMRect = containerRef.value.getBoundingClientRect();
  model.initX = rect.left + window.pageXOffset;
  model.initY = rect.top + window.pageYOffset;
  model.barWidth = rect.width;
  model.barHeight = rect.height;
}

function updateModel(event: Event, value: number) {
  let newValue = parseFloat(value.toFixed(10));
  let modelValue;
  if (props.range) {
    modelValue = model.value ? [...model.value as number[]] : [];
    if (model.handleIndex === 0) {
      if (newValue < props.min) newValue = props.min;
      else if (newValue >= props.max) newValue = props.max;
      if (newValue > modelValue[1]) {
        modelValue[1] = newValue;
        model.handleIndex = 1;
      } else {
        modelValue[0] = newValue;
      }
    } else {
      if (newValue > props.max) newValue = props.max;
      else if (newValue <= props.min) newValue = props.min;
      if (newValue < modelValue[0]) {
        modelValue[0] = newValue;
        model.handleIndex = 0;
      } else {
        modelValue[1] = newValue;
      }
    }
  } else {
    if (newValue < props.min) newValue = props.min;
    else if (newValue > props.max) newValue = props.max;
    modelValue = newValue;
  }
  model.value = modelValue;
  emit('change', modelValue);
  props.onChange ? props.onChange(modelValue) : null;
}

function setValue(event: TouchEvent | MouseEvent) {
  let handleValue;
  const pageX = event instanceof TouchEvent ? event.touches[0].pageX : event.pageX;
  const pageY = event instanceof TouchEvent ? event.touches[0].pageY : event.pageY;

  if (horizontal.value) handleValue = ((pageX - model.initX) * 100) / model.barWidth;
  else handleValue = ((model.initY + model.barHeight - pageY) * 100) / model.barHeight;

  let newValue = (props.max - props.min) * (handleValue / 100) + props.min;
  if (props.step) {
    const oldValue = Array.isArray(model.value) ? model.value[model.handleIndex] : model.value;
    const diff = newValue - oldValue;
    if (diff < 0) newValue = oldValue + Math.ceil(newValue / props.step - oldValue / props.step) * props.step;
    else if (diff > 0) newValue = oldValue + Math.floor(newValue / props.step - oldValue / props.step) * props.step;
  } else {
    newValue = Math.floor(newValue);
  }
  updateModel(event, newValue);
}

function onDragStart(event: Event, index: number) {
  if (props.disabled) return;

  model.dragging = true;
  updateDomData();
  if (model.value && (model.value as number[])[0] === props.max) {
    model.handleIndex = 0;
  } else {
    model.handleIndex = index;
  }
  event.preventDefault();
}

function onDrag(event: Event) {
  if (model.dragging) {
    setValue(event as TouchEvent | MouseEvent);
    event.preventDefault();
  }
}

function onDragEnd() {
  if (model.dragging) {
    model.dragging = false;
  }
}

function onBarClick(event: Event) {
  if (props.disabled) {
    return;
  }
  const target = event.target as HTMLElement;
  if (!target.classList.contains('ui-slider__handle')) {
    updateDomData();
    setValue(event as TouchEvent | MouseEvent);
  }
}

function bindDragListeners() {
  if (!model.dragListener) {
    model.dragListener = onDrag;
    document.addEventListener('mousemove', model.dragListener);
  }
  if (!model.dragEndListener) {
    model.dragEndListener = onDragEnd;
    document.addEventListener('mouseup', model.dragEndListener);
  }
}

function onMouseDown(event: Event, index: number) {
  bindDragListeners();
  onDragStart(event, index);
}

function unbindDragListeners() {
  if (model.dragListener) {
    document.removeEventListener('mousemove', model.dragListener);
    model.dragListener = null;
  }
  if (model.dragEndListener) {
    document.removeEventListener('mouseup', model.dragEndListener);
    model.dragEndListener = null;
  }
}

onBeforeUnmount(() => {
  unbindDragListeners();
});
</script>

<style>
.ui-slider {
  --slider-size-md: 240px;
  --slider-size-lg: 360px;
  --slider-size-stretch: 100%;
  --slider-background-color: var(--color-neutral-200);
  --slider-height-horizontal: 4px;
  --slider-height-vertical: 200px;
  --slider-width-vertical: 5px;
  --slider-range-background-color: var(--color-primary-500);
  --slider-handle-side-length: 18px;
  --slider-handle-background-color: var(--color-neutral-0);
  --slider-handle-border-color: var(--color-primary-500);
  --slider-disabled-handle-border-color: var(--color-neutral-200);
  --slider-disabled-range-background-color: var(--color-neutral-300);

  position: relative;
  background-color: var(--slider-background-color);
  box-sizing: border-box;
  border-radius: 3px;
}

.ui-slider--direction-horizontal {
  height: var(--slider-height-horizontal);
}

.ui-slider--direction-vertical {
  width: var(--slider-width-vertical);
  height: var(--slider-height-vertical);
}

.ui-slider__range {
  display: block;
  position: absolute;
  background: var(--slider-range-background-color);
}

.ui-slider--direction-horizontal.ui-slider--size-md {
  width: var(--slider-size-md);
}

.ui-slider--direction-horizontal.ui-slider--size-lg {
  width: var(--slider-size-lg);
}

.ui-slider--direction-horizontal.ui-slider--size-stretch {
  width: var(--slider-size-stretch);
}

.ui-slider--direction-vertical.ui-slider--size-md {
  height: var(--slider-size-md);
}

.ui-slider--direction-vertical.ui-slider--size-lg {
  height: var(--slider-size-lg);
}

.ui-slider--direction-vertical.ui-slider--size-stretch {
  height: var(--slider-size-stretch);
}

.ui-slider--direction-horizontal .ui-slider__range {
  height: 100%;
  left: 0;
  top: 0;
}

.ui-slider--direction-vertical .ui-slider__range {
  bottom: 0;
  left: 0;
  width: 100%;
}

.ui-slider__handle {
  display: block;
  position: absolute;
  width: var(--slider-handle-side-length);
  height: var(--slider-handle-side-length);
  background-color: var(--slider-handle-background-color);
  border: 2px solid var(--slider-handle-border-color);
  border-radius: 50%;
  cursor: grab;
  touch-action: none;
}

.ui-slider--direction-horizontal .ui-slider__handle {
  margin-top: -0.5715rem;
  margin-left: -0.5715rem;
  top: 50%;
}

.ui-slider--direction-vertical .ui-slider__handle {
  margin-top: -0.5715rem;
  margin-left: -0.5715rem;
  margin-bottom: -0.5715rem;
  left: 50%;
}

.ui-slider--disabled .ui-slider__handle {
  border-color: var(--slider-disabled-handle-border-color);
  cursor: default;
}

.ui-slider--disabled .ui-slider__range {
  background-color: var(--slider-disabled-range-background-color);
}
</style>
