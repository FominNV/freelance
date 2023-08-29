<template>
  <label
    :class="classes"
    @click="emit('click', $event)"
  >
    <input
      :type="inputType"
      v-model="model"
      :name="name"
      :placeholder="placeholder"
      :disabled="disabled"
      :autocomplete="autocomplete"
      @input="emit('input', $event)"
      @change="emit('change', $event)"
      @focus="emit('focus', $event)"
      @blur="onBlur"
      @keyup="emit('keyup', $event)"
      ref="input"
    >
    <span
      class="ui-input__left-icon"
      v-if="leftIcon || $slots.leftContainer"
      :style="`color:${leftIconColor}`"
    >
      <!--@slot Контейнер для левой иконки, на случай если понадобится пробросить в кнопку другой компонент иконки -->
      <slot name="leftContainer">
        <ui-icon
          v-if="leftIcon"
          :name="leftIcon"
        />
      </slot>
    </span>
    <span
      class="ui-input__right-icon"
      v-if="rightIcon || $slots.rightContainer"
      :style="`color:${rightIconColor}`"
    >
      <!--@slot Контейнер для правой иконки, на случай если понадобится пробросить в кнопку другой компонент иконки -->
      <slot name="rightContainer">
        <ui-icon
          v-if="rightIcon"
          :name="rightIcon"
        />
      </slot>
    </span>
    <transition name="bounce">
      <button
        type="button"
        class="ui-input__clear-button"
        @click.once="clearInput"
        v-if="model && showClearButton && !disabled"
      >
        <ui-icon :name="clearIcon" />
      </button>
    </transition>
  </label>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { PropsSizeType } from '../../@types/size';
import { ClassPropsType } from '../../@types/props';
import { useConfigParam } from '../../lib/useConfigParam';
import { IconsConfig } from '../../@types/icons-config';
import { InputSizesType } from './const';

export interface RrInputPropsImpl {
  /** Модель инпута (string | number) */
  modelValue?: any;
  /** Плэйсхолдер инпута */
  placeholder?: string;
  /** Размер инпута */
  size?: PropsSizeType<InputSizesType>;
  /** Выключить инпут */
  disabled?: boolean;
  /** Применить стиль ошибки */
  showError?: boolean;
  /** Показать кнопку очистки */
  showClearButton?: boolean;
  /** Идентификатор левой иконки */
  leftIcon?: IconsNamesType;
  /** Цвет левой иконки */
  leftIconColor?: string;
  /** Идентификатор правой иконки */
  rightIcon?: IconsNamesType;
  /** Цвет левой иконки */
  rightIconColor?: string;
  /** Аттрибут имени */
  name?: string;
  /** Ввод текста или только цифр */
  type?: 'text' | 'number' | 'password';
  /** Разрешить ввод дробных чисел (работает только с type="number") */
  allowFraction?: boolean;
  /** Максимальное кол-во символов */
  maxLength?: number;
  /** Автозаполнение https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete */
  autocomplete?: string,
  /** Автоматически убирать пробелы по краям строки при событии blur */
  trimOnBlur?: boolean,
}

const props = withDefaults(defineProps<RrInputPropsImpl>(), {
  modelValue: '',
  placeholder: '',
  size: 'lg',
  disabled: false,
  showError: false,
  showClearButton: true,
  type: 'text',
  allowFraction: true,
  autocomplete: 'off',
  trimOnBlur: true,
});

const emit = defineEmits<{
  /** Обновление модели инпута */
  (e: 'update:modelValue', value: any): void;
  /** Клик по инпуту */
  (e: 'click', event: Event): void;
  /** Нажатие на кнопку очистить */
  (e: 'clear', event: Event): void;
  /** Проброс ивента input */
  (e: 'input', event: Event): void;
  /** Проброс ивента change */
  (e: 'change', event: Event): void;
  /** Проброс ивента focus */
  (e: 'focus', event: Event): void;
  /** Проброс ивента blur */
  (e: 'blur', event: Event): void;
  (e: 'keyup', event: Event): void;
}>();

const input = ref<HTMLInputElement | null>(null);
const inputType = computed(() => (props.type === 'password' ? 'password' : 'text'));

const model = computed<any>({
  get() {
    return props.modelValue === undefined || props.modelValue === null ? '' : String(props.modelValue);
  },
  set(newValue) {
    if (props.maxLength && newValue) {
      newValue = newValue.slice(0, props.maxLength);
    }

    if (props.type === 'number') {
      if (newValue) {
        const regex = props.allowFraction ? /^[0-9]+\.?[0-9]*/g : /[\d]+/g;
        newValue = newValue.match(regex)?.join('') || null;
      }
      const parsedValue = parseFloat(newValue);
      emit('update:modelValue', Number.isNaN(parsedValue) ? null : parsedValue);
    } else {
      emit('update:modelValue', newValue);
    }

    nextTick(() => {
      if (input.value) {
        input.value.value = props.type === 'number' ? newValue : model.value;
      }
    });
  },
});

function clearInput(event: Event) {
  model.value = props.type === 'number' ? null : '';
  emit('clear', event);
}

function onBlur(event: Event) {
  if (props.trimOnBlur) {
    model.value = model.value.trim();
  }
  emit('blur', event);
}

const iconsConfig = useConfigParam('icons') as IconsConfig;
const clearIcon: IconsNamesType = iconsConfig.systemIcons.controls.clear;

const classes = computed<ClassPropsType>(() => {
  return [
    'ui-input',
    `ui-input--${props.size}`,
    {
      'ui-input--with-clear-button': props.showClearButton,
      'ui-input--disabled': props.disabled,
      'ui-input--error': props.showError,
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
  /** input-text variables */
  --input-text-background: var(--color-neutral-0);
  --input-text-background-hover: var(--color-neutral-0);
  --input-text-text-color: var(--color-text-primary);
  --input-text-placeholder-color: var(--color-text-placeholder);
  --input-text-border-color: var(--color-neutral-200);
  --input-text-border-color-hover: var(--color-primary-300);
  --input-text-border-color-focus: var(--color-primary-500);
  --input-text-border: 1px solid var(--input-text-border-color);
  --input-text-transition: .2s ease;

  /** input-text disabled variables */
  --input-text-disabled-background-color: var(--color-neutral-100);
  --input-text-disabled-border-color: var(--color-neutral-200);
  --input-text-disabled-text-color: var(--color-text-placeholder);
  --input-text-clear-button-outline: 2px solid var(--color-primary-100);
  --input-text-clear-button-outline-offset: -2px;
  --input-text-clear-button-input-padding-right: 32px;
  --input-text-clear-button-right: var(--spacing-1-5);

  /** size sm variables*/
  --input-text-height-sm: var(--control-height-sm);

  /** size lg variables*/
  --input-text-height-lg: var(--control-height-lg);

  /** input-text other variables */
  --input-text-error-color: var(--color-error-500);
  --input-text-padding: 0 var(--spacing-1-5);
  --input-text-border-radius: var(--radius-sm);

  /** input-text font variables */
  --input-text-font-size: var(--paragraph-sm-font-size);
  --input-text-line-height: var(--paragraph-sm-line-height);
  --input-text-font-weight: var(--paragraph-sm-font-weight);
  --input-text-letter-spacing: var(--paragraph-sm-letter-spacing);

  /** input-text icon variables */
  --input-text-left-icon-left: var(--spacing-1-5);
  --input-text-left-icon-input-padding: 40px;
  --input-text-right-icon-right: var(--spacing-1);
  --input-text-right-icon-input-padding: 40px;
}

.ui-input {
  width: 100%;
  position: relative;
  display: inline-flex;
  color: var(--input-text-text-color);
}

/** input */

.ui-input input {
  width: 100%;
  height: var(--input-text-height-lg);
  background: var(--input-text-background);
  border-radius: var(--input-text-border-radius);
  border: var(--input-text-border);
  padding: var(--input-text-padding);
  transition: var(--input-text-transition);
  color: inherit;
  font-size: var(--input-text-font-size);
  font-family: var(--input-text-font-family);
  font-weight: var(--input-text-font-weight);
  line-height: var(--input-text-line-height);
  letter-spacing: var(--input-text-letter-spacing);
}

.ui-input input::placeholder {
  color: var(--input-text-placeholder-color);
}

.ui-input:hover input {
  border-color: var(--input-text-border-color-hover);
}

.ui-input input:focus {
  outline: none;
  border-color: var(--input-text-border-color-focus);
}

/** clear button */

.ui-input--with-clear-button input {
  padding-right: var(--input-text-clear-button-input-padding-right);
}

.ui-input .ui-input__clear-button {
  position: absolute;
  background-color: transparent;
  right: var(--input-text-clear-button-right);
  padding: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.ui-input:has(.ui-input__right-icon) .ui-input__clear-button {
  right: var(--input-text-right-icon-input-padding);
}

.ui-input .ui-input__clear-button:focus-visible {
  outline: var(--input-text-clear-button-outline);
  outline-offset: var(--input-text-clear-button-outline-offset);
}

/** icon */
.ui-input:has(.ui-input__left-icon) input {
  padding-left: var(--input-text-left-icon-input-padding);
}

.ui-input:has(.ui-input__right-icon) input {
  padding-right: var(--input-text-right-icon-input-padding);
}

.ui-input:is(.ui-input--with-clear-button):has(.ui-input__right-icon) input {
  padding-right: calc(var(--input-text-right-icon-input-padding) + var(--input-text-clear-button-input-padding-right));
}

.ui-input__left-icon,
.ui-input__right-icon {
  position: absolute;
  bottom: 0;
  top: 0;
  margin: auto;
  display: flex;
  color: inherit;
  align-items: center;
  justify-content: center;
}

.ui-input__left-icon {
  left: var(--input-text-left-icon-left);
}

.ui-input__right-icon {
  right: var(--input-text-right-icon-right);
}

/** disabled */

.ui-input--disabled input,
.ui-input--disabled:hover input {
  background-color: var(--input-text-disabled-background-color);
  border-color: var(--input-text-disabled-border-color);
  color: var(--input-text-disabled-text-color);
}

.ui-input--disabled input::placeholder {
  color: var(--input-text-disabled-text-color);
}

.ui-input--disabled .ui-input__left-icon,
.ui-input--disabled .ui-input__right-icon {
  color: var(--input-text-disabled-text-color) !important;
}

/** error */

.ui-input--error input,
.ui-input--error:hover input,
.ui-input--error input:focus {
  border-color: var(--input-text-error-color);
}

.ui-input--error .ui-input__left-icon,
.ui-input--error .ui-input__right-icon {
  color: var(--input-text-error-color) !important;
}

/** size: sm */

.ui-input--sm input {
  height: var(--input-text-height-sm);
}

/** size: lg */

.ui-input--lg input {
  height: var(--input-text-height-lg);
}
</style>
