<template>
  <label
    :class="classes"
    aria-label="radio"
    @click="emit('click', $event)"
  >
    <input
      type="radio"
      v-model="model"
      :value="value"
      :name="name"
      :disabled="disabled"
      @input="emit('input', $event)"
      @change="emit('change', $event)"
    >
    <div class="ui-radio__button" />
    <div
      class="ui-radio__label"
      v-if="$slots.default"
    >
      <!-- @slot Слот для отображения контента в лейбле радиокнопки -->
      <slot />
    </div>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ClassPropsType } from '../../@types/props';
import { PropsSizeType } from '../../@types/size';
import { RadioSizesType } from './const';

export interface UiRadioPropsImpl {
  /** Модель радиокнопки */
  modelValue: any;
  /** Значение, которое будет записываться в модель при выборе радиокнопки  */
  value: any;
  /** Размер радиокнопки */
  size?: PropsSizeType<RadioSizesType>;
  /** Пропс выключающий радиокнопку */
  disabled?: boolean;
  /** Применить стиль ошибки */
  showError?: boolean;
  /** Аттрибут имени */
  name?: string;
}

const props = withDefaults(defineProps<UiRadioPropsImpl>(), {
  size: 'md',
  disabled: false,
  showError: false,
});

const emit = defineEmits<{
  /** Обновление модели радиокнопки */
  (e: 'update:modelValue', value: any): void;
  /** Клик по радиокнопкe */
  (e: 'click', event: Event): void;
  /** Проброс ивента input */
  (e: 'input', event: Event): void;
  /** Проброс ивента change */
  (e: 'change', event: Event): void;
}>();

const model = computed<any>({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  },
});

const classes = computed<ClassPropsType>(() => {
  return [
    'ui-radio',
    `ui-radio--${props.size}`,
    {
      'ui-radio--disabled': props.disabled,
      'ui-radio--error': props.showError,
    },
  ];
});

</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<style>
:root {
  /** radio variables*/
  --radio-background: var(--color-primary-500);
  --radio-background-hover: var(--color-primary-300);
  --radio-border-color: var(--color-neutral-300);
  --radio-border-color-hover: var(--color-primary-300);
  --radio-outline-focus: 4px solid var(--color-primary-100);
  --radio-pseudo-after-color: var(--color-neutral-0);
  --radio-transition: background-color .2s ease, border .2s ease, transform .2s ease;
  --radio-border-radius: var(--radius-round);

  /** radio disabled variables*/
  --radio-disabled-background: var(--color-neutral-200);

  /** radio error variables*/
  --radio-error-color: var(--color-error-500);

  /** radio sm variables*/
  --radio-sm-size: 16px;
  --radio-sm-font-size: var(--paragraph-sm-font-size);
  --radio-sm-font-weight: var(--paragraph-sm-font-weight);
  --radio-sm-line-height: var(--paragraph-sm-line-height);
  --radio-sm-letter-spacing: var(--paragraph-sm-letter-spacing);
  --radio-sm-label-margin-left: var(--spacing-1);

  /** radio sm variables*/
  --radio-md-size: 20px;
  --radio-md-font-size: var(--paragraph-md-font-size);
  --radio-md-font-weight: var(--paragraph-md-font-weight);
  --radio-md-line-height: var(--paragraph-md-line-height);
  --radio-md-letter-spacing: var(--paragraph-md-letter-spacing);
  --radio-md-label-margin-left: var(--spacing-1);

  /** radio lg variables*/
  --radio-lg-size: 24px;
  --radio-lg-font-size: var(--paragraph-md-font-size);
  --radio-lg-font-weight: var(--paragraph-md-font-weight);
  /** используется radio-lg-size из-за того, что стандартный line-height шрифта меньше высоты radio */
  --radio-lg-line-height: var(--radio-lg-size);
  --radio-lg-letter-spacing: var(--paragraph-md-letter-spacing);
  --radio-lg-label-margin-left: var(--spacing-1);
}

.ui-radio {
  position: relative;
  display: inline-flex;
}

.ui-radio__label {
  user-select: none;
  cursor: pointer;
}

/** hidden input */

.ui-radio input {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
  z-index: -1;
}

.ui-radio.ui-radio--error input:focus-visible+.ui-radio__button,
.ui-radio input:focus-visible+.ui-radio__button {
  outline: var(--radio-outline-focus);
}

/** radio toggle */

.ui-radio__button {
  position: relative;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
  width: var(--radio-size-md);
  height: var(--radio-size-md);
  border: 1px solid var(--radio-border-color);
  border-radius: var(--radio-border-radius);
  background: transparent;
  transition: var(--radio-transition);
}

.ui-radio__button::after {
  content: '';
  border-radius: var(--radio-border-radius);
  transform: scale(0);
  transition: var(--radio-transition);
}

.ui-radio:hover .ui-radio__button {
  border-color: var(--radio-border-color-hover);
  cursor: pointer;
}

/** checked */

/** .ui-radio--selected реализован на всякий случай */
.ui-radio--selected .ui-radio__button,
.ui-radio input:checked+.ui-radio__button {
  border-color: var(--color-primary-500);
  background: var(--radio-background);
}

.ui-radio--selected .ui-radio__button::after,
.ui-radio input:checked+.ui-radio__button::after {
  background: var(--radio-pseudo-after-color);
  transform: scale(1);
}

.ui-radio--selected:hover .ui-radio__button,
.ui-radio input:checked:hover+.ui-radio__button {
  border-color: var(--radio-border-color-hover);
  background: var(--radio-background-hover);
}

/** disabled */

.ui-radio.ui-radio--disabled input+.ui-radio__button {
  border-color: var(--radio-disabled-background);
  cursor: default;
  pointer-events: none;
}

.ui-radio.ui-radio--disabled:hover input+.ui-radio__button {
  border-color: var(--radio-disabled-background);
}

.ui-radio.ui-radio--disabled input:checked+.ui-radio__button {
  background: var(--radio-disabled-background);
}

.ui-radio.ui-radio--disabled:hover input:checked+.ui-radio__button {
  background: var(--radio-disabled-background);
}

.ui-radio.ui-radio--disabled.ui-radio--error input+.ui-radio__button {
  border: 1px solid var(--radio-error-border-color);
}

/** size sm */

.ui-radio--sm .ui-radio__button {
  width: var(--radio-sm-size);
  height: var(--radio-sm-size);
}

.ui-radio--sm .ui-radio__button::after {
  width: calc(var(--radio-sm-size) / 2);
  height: calc(var(--radio-sm-size) / 2);
}

.ui-radio--sm .ui-radio__label {
  font-size: var(--radio-sm-font-size);
  font-weight: var(--radio-sm-font-weight);
  letter-spacing: var(--radio-sm-letter-spacing);
  line-height: var(--radio-sm-line-height);
  margin-left: var(--radio-sm-label-margin-left);
}

/** size md */

.ui-radio--md .ui-radio__button {
  width: var(--radio-md-size);
  height: var(--radio-md-size);
}

.ui-radio--md .ui-radio__button::after {
  width: calc(var(--radio-md-size) / 2);
  height: calc(var(--radio-md-size) / 2);
}

.ui-radio--md .ui-radio__label {
  font-size: var(--radio-md-font-size);
  font-weight: var(--radio-md-font-weight);
  letter-spacing: var(--radio-md-letter-spacing);
  line-height: var(--radio-md-line-height);
  margin-left: var(--radio-md-label-margin-left);
}

/** size lg */

.ui-radio--lg .ui-radio__button {
  width: var(--radio-lg-size);
  height: var(--radio-lg-size);
}

.ui-radio--lg .ui-radio__button::after {
  width: calc(var(--radio-lg-size) / 2);
  height: calc(var(--radio-lg-size) / 2);
}

.ui-radio--lg .ui-radio__label {
  font-size: var(--radio-lg-font-size);
  font-weight: var(--radio-lg-font-weight);
  letter-spacing: var(--radio-lg-letter-spacing);
  line-height: var(--radio-lg-line-height);
  margin-left: var(--radio-lg-label-margin-left);
}

/** error */

.ui-radio--error input+.ui-radio__button,
.ui-radio--error:hover .ui-radio__button {
  border-color: var(--radio-error-color);
}

.ui-radio--error.ui-radio--selected,
.ui-radio--error.ui-radio input:checked+.ui-radio__button {
  background: var(--radio-error-color);
  border-color: var(--radio-error-color);
}
</style>
