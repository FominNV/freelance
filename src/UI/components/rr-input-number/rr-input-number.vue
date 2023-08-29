<template>
  <div
    :class="classes"
    tabindex="0"
    @focus="setFocusToInput"
  >
    <button
      class="ui-input-number__button"
      type="button"
      tabindex="-1"
      :disabled="disabled || readonly || !increasable"
      @click.prevent="increase"
    >
      <ui-icon
        :name="plusIcon"
        :size="iconSize"
      />
    </button>
    <label>
      <input
        ref="input"
        type="number"
        :name="name"
        :value="Number.isNaN(model) ? '' : model"
        :min="min"
        :max="max"
        :step="step"
        :readonly="readonly || !allowInput"
        :disabled="disabled || (!decreasable && !increasable)"
        autocomplete="off"
        @input="inputHandler"
        @change="changeHandler"
        @paste="pasteHandler"
        @blur="focused = false"
      >
    </label>
    <button
      class="ui-input-number__button"
      type="button"
      tabindex="-1"
      :disabled="disabled || readonly || !decreasable"
      @click.prevent="decrease"
    >
      <ui-icon
        :name="minusIcon"
        :size="iconSize"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  nextTick,
} from 'vue';
import { IconsConfig } from '../../@types/icons-config';
import { ClassPropsType } from '../../@types/props';
import { PropsSizeType } from '../../@types/size';
import { useConfigParam } from '../../lib/useConfigParam';
import { InputNumberSizesType } from './const';

export interface RrInputNumberPropsImpl {
  /** модель инпута */
  modelValue: number;
  /** размер */
  size?: PropsSizeType<InputNumberSizesType>;
  /** шаг */
  step?: number;
  /** ограничение - максимальное число */
  max?: number;
  /** ограничение - минимальное число */
  min?: number;
  /** выключение инпута */
  disabled?: boolean;
  /** разрешать ввод через инпут */
  allowInput?: boolean;
  /** аттрибут name */
  name?: string;
  /** округлять до целых */
  round?: boolean;
  /** только для чтения */
  readonly?: boolean;
  /** Применить стиль ошибки */
  showError?: boolean;
}

const props = withDefaults(defineProps<RrInputNumberPropsImpl>(), {
  modelValue: 0,
  disabled: false,
  allowInput: true,
  max: Number.MAX_SAFE_INTEGER,
  min: Number.MIN_SAFE_INTEGER,
  size: 'md',
  step: 1,
  round: true,
  readonly: false,
  showError: false,
});

const emit = defineEmits<{
  /** Обновление модели инпута */
  (e: 'update:modelValue', newValue: number): void;
  /** Клик по кнопке увеличить */
  (e: 'click:increase', newValue: number): void;
  /** Клик по кнопке уменьшить */
  (e: 'click:decrease', newValue: number): void;
  /** Событие ввода инпута */
  (e: 'input', event: Event): void;
  /** Событие изменения инпута */
  (e: 'change', event: Event): void;
  /** Событие вставки в инпут */
  (e: 'paste', event: ClipboardEvent): void;
}>();

const input = ref<HTMLInputElement | null>(null);

const iconsConfig = useConfigParam('icons') as IconsConfig;
const plusIcon: IconsNamesType = iconsConfig.systemIcons.controls.plus;
const minusIcon: IconsNamesType = iconsConfig.systemIcons.controls.minus;
const iconSize: PropsSizeType = props.size === 'lg' ? 'md' : 'sm';

/** Определение из step до скольки знаков округлять число */
const toFixedNumber = props.step.toString().match(/\.(\d+)/)?.[1].length;

/** Максимальное кол-во символов для автоматического расширения инпута */
const maxCharLength = Math.max(props.max, Math.abs(props.min)).toString().length + (toFixedNumber || 0);

async function resize() {
  if (input.value) {
    await nextTick();
    const width = input.value.value.length > maxCharLength ? maxCharLength : input.value.value.length;
    input.value.style.width = `${width + 3}ch`;
  }
}

const model = computed<number>({
  get() {
    return props.modelValue;
  },
  set(newValue: string | number) {
    let value = typeof newValue !== 'number' ? parseFloat(newValue) : newValue;

    if (Number.isNaN(value)) {
      value = 0;
    } else {

      if (props.round) {
        value = Math.round(value);
      } else {
        value = parseFloat(value.toFixed(toFixedNumber));
      }

      if (value > props.max || value < props.min) {
        value = 0;
      }
    }

    if (input.value && (value === model.value)) {
      input.value.value = String(value);
    }

    emit('update:modelValue', value);
    resize();
  },
});

const increasable = computed<boolean>(() => (Number.isNaN(model.value) || model.value + props.step <= props.max));
const decreasable = computed<boolean>(() => (Number.isNaN(model.value) || model.value - props.step >= props.min));

function inputHandler(event: Event) {
  emit('input', event);
  resize();
}

function changeHandler(event: Event) {
  emit('change', event);
  model.value = parseFloat((event.target as HTMLInputElement).value);
}

/** Цифры, точка и e */
const REGEXP_NUMBER = /^-?(?:\d+|\d+\.\d+|\.\d+)(?:[eE][-+]?\d+)?$/;

function pasteHandler(event: ClipboardEvent) {
  const { clipboardData } = event;

  if (clipboardData && !REGEXP_NUMBER.test(clipboardData.getData('text'))) {
    event.preventDefault();
    return;
  }

  emit('change', event);
}

function increase() {
  if (increasable.value) {
    model.value += props.step;
    emit('click:increase', model.value);
  }
}

function decrease() {
  if (decreasable.value) {
    model.value -= props.step;
    emit('click:decrease', model.value);
  }
}

const focused = ref<boolean>(false);

function setFocusToInput() {
  input.value?.focus();
  focused.value = true;
}

const classes = computed<ClassPropsType>(() => {
  return [
    'ui-input-number',
    `ui-input-number--${props.size}`,
    {
      'ui-input-number--error': props.showError,
      'ui-input-number--focused': focused.value,
      'ui-input-number--disabled': props.disabled,
    },
  ];
});

onMounted(() => {
  resize();
});
</script>

<style>
.ui-input-number {
  --input-number-background-color: var(--color-primary-500);
  --input-number-text-color: var(--color-neutral-0);
  --input-number-outline-color: var(--color-primary-100);
  --input-number-button-hover-background-color: var(--color-primary-300);
  --input-number-disabled-background-color: var(--color-neutral-200);
  --input-number-disabled-color: var(--color-neutral-200);

  --input-number-sm-input-width: 27px;
  --input-number-sm-input-height: 28px;
  --input-number-sm-border-radius: var(--radius-sm);
  --input-number-sm-button-width: 28px;
  --input-number-sm-outline: 4px solid var(--input-number-outline-color);
  --input-number-sm-font-size: var(--action-md-font-size);
  --input-number-sm-font-weight: var(--action-md-font-weight);
  --input-number-sm-line-height: var(--action-md-line-height);
  --input-number-sm-letter-spacing: var(--action-md-letter-spacing);

  --input-number-md-input-width: 31px;
  --input-number-md-input-height: 36px;
  --input-number-md-border-radius: var(--radius-md);
  --input-number-md-button-width: 34px;
  --input-number-md-outline: 4px solid var(--input-number-outline-color);
  --input-number-md-font-size: var(--action-md-font-size);
  --input-number-md-font-weight: var(--action-md-font-weight);
  --input-number-md-line-height: var(--action-md-line-height);
  --input-number-md-letter-spacing: var(--action-md-letter-spacing);

  --input-number-lg-input-width: 40px;
  --input-number-lg-input-height: 48px;
  --input-number-lg-border-radius: var(--radius-lg);
  --input-number-lg-button-width: 44px;
  --input-number-lg-outline: 5px solid var(--input-number-outline-color);
  --input-number-lg-font-size: var(--action-lg-font-size);
  --input-number-lg-font-weight: var(--action-lg-font-weight);
  --input-number-lg-line-height: var(--action-lg-line-height);
  --input-number-lg-letter-spacing: var(--action-lg-letter-spacing);

  --input-number-error-color: var(--color-error-500);

  display: inline-flex;
  overflow: hidden;
}

.ui-input-number input {
  border: none;
  background-color: var(--input-number-background-color);
  color: var(--input-number-text-color);
  text-align: center;
  min-width: var(--input-number-input-width-md);
  outline: none;
  -moz-appearance: textfield;
}

.ui-input-number input::-webkit-outer-spin-button,
.ui-input-number input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/** disabled */

.ui-input-number--disabled input,
.ui-input-number--disabled .ui-input-number__button,
.ui-input-number--disabled .ui-input-number__button:hover {
  background-color: var(--input-number-disabled-background-color);
  cursor: not-allowed;
}

.ui-input-number__button:disabled,
.ui-input-number__button:disabled:hover {
  background: var(--input-number-disabled-background-color);
}

/** buttons */

.ui-input-number__button {
  background: var(--input-number-background-color);
  color: var(--input-number-text-color);
  border: none;
  transition: background .2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ui-input-number__button:focus {
  outline: none;
}

.ui-input-number__button:hover {
  background: var(--input-number-button-hover-background-color);
  cursor: pointer;
}

/** size:sm */

.ui-input-number--sm {
  border-radius: var(--input-number-sm-border-radius);
}

.ui-input-number--sm input {
  width: var(--input-number-sm-input-width);
  height: var(--input-number-sm-input-height);
  min-width: var(--input-number-sm-input-width);
  font-size: var(--input-number-sm-font-size);
  font-weight: var(--input-number-sm-font-weight);
  line-height: var(--input-number-sm-line-height);
  letter-spacing: var(--input-number-sm-letter-spacing);
}

.ui-input-number--sm .ui-input-number__button {
  width: var(--input-number-sm-button-width);
}

.ui-input-number--sm.ui-input-number--focused {
  outline: var(--input-number-sm-outline);
}

/** size:md */

.ui-input-number--md {
  border-radius: var(--input-number-md-border-radius);
}

.ui-input-number--md input {
  width: var(--input-number-md-input-width);
  height: var(--input-number-md-input-height);
  min-width: var(--input-number-md-input-width);
  font-size: var(--input-number-md-font-size);
  font-weight: var(--input-number-md-font-weight);
  line-height: var(--input-number-md-line-height);
  letter-spacing: var(--input-number-md-letter-spacing);
}

.ui-input-number--md .ui-input-number__button {
  width: var(--input-number-md-button-width);
}

.ui-input-number--md.ui-input-number--focused {
  outline: var(--input-number-md-outline);
}

/** size:lg */

.ui-input-number--lg {
  border-radius: var(--input-number-lg-border-radius);
}

.ui-input-number--lg input {
  width: var(--input-number-lg-input-width);
  height: var(--input-number-lg-input-height);
  min-width: var(--input-number-lg-input-width);
  font-size: var(--input-number-lg-font-size);
  font-weight: var(--input-number-lg-font-weight);
  line-height: var(--input-number-lg-line-height);
  letter-spacing: var(--input-number-lg-letter-spacing);
}

.ui-input-number--lg .ui-input-number__button {
  width: var(--input-number-lg-button-width);
}

.ui-input-number--lg.ui-input-number--focused {
  outline: var(--input-number-lg-outline);
}

/** error */

.ui-input-number--error .ui-input-number__button {
  background: var(--input-number-error-color);
}

.ui-input-number--error input {
  background: var(--input-number-error-color);
}
</style>
