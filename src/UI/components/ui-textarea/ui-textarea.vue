<template>
  <label :class="classes">
    <div
      class="ui-textarea__corner"
      ref="corner"
    >
      <span
        class="ui-textarea__counter"
        v-if="showCounter && maxLength > 0 && maxLength !== Infinity"
      >
        {{ modelValue.length }} / {{ maxLength }}
      </span>
      <transition name="bounce">
        <button
          type="button"
          class="ui-textarea__clear-button"
          @click.once="clearTextarea"
          v-if="model.length && showClearButton && !disabled"
        >
          <ui-icon :name="clearIcon" />
        </button>
      </transition>
    </div>
    <textarea
      ref="textarea"
      v-model="model"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxLength"
      :spellcheck="spellcheck"
      @input="emit('input', $event)"
      @change="emit('change', $event)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />

  </label>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue';
import { IconsConfig } from '../../@types/icons-config';
import { ClassPropsType } from '../../@types/props';
import { useConfigParam } from '../../lib/useConfigParam';

export interface UiTextareaPropsImpl {
  /** Модель textarea */
  modelValue?: string;
  /** Высота в строках */
  rows?: number;
  /** Плэйсхолдер textarea */
  placeholder?: string;
  /** Выключить textarea */
  disabled?: boolean;
  /** Применить стиль ошибки */
  showError?: boolean;
  /** Показать кнопку очистки */
  showClearButton?: boolean;
  /** Автоматическое растягивание по вертикали в зависимости от контента */
  autoResize?: boolean;
  /** Отключить возможность ресайза */
  disableResize?: boolean;
  /** Максимальное кол-во символов */
  maxLength?: number;
  /** Подсветка грамматических ошибок */
  spellcheck?: boolean;
  /** Показать счетчик над textarea (работает вместе с maxLength) */
  showCounter?: boolean;
}

const props = withDefaults(defineProps<UiTextareaPropsImpl>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  showError: false,
  showClearButton: true,
  autoResize: false,
  disableResize: false,
  spellcheck: true,
  rows: 5,
  maxLength: Infinity,
});

const emit = defineEmits<{
  /** Обновление модели textarea */
  (e: 'update:modelValue', value: string): void;
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
}>();

const iconsConfig = useConfigParam('icons') as IconsConfig;
const clearIcon: IconsNamesType = iconsConfig.systemIcons.controls.clear;
const textarea = ref<HTMLTextAreaElement | null>(null);
const corner = ref<HTMLElement | null>(null);
let resizeObserver: ResizeObserver;

const model = computed<string>({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    if (props.autoResize && !props.disableResize) {
      resize(textarea.value);
    }
    if (newValue.length <= props.maxLength) {
      emit('update:modelValue', newValue);
    }
  },
});

function resize(element: HTMLElement | null) {
  if (!element) {
    return;
  }

  element.style.overflow = 'hidden';
  element.style.height = '';

  const height = Math.max(
    element.offsetHeight,
    element.offsetHeight - element.clientHeight + element.scrollHeight,
  );

  element.style.height = `${height}px`;
}

onMounted(() => {
  if (props.autoResize && !props.disableResize) {
    resize(textarea.value);
  }

  resizeObserver = new ResizeObserver(() => {
    if (textarea.value && corner.value) {
      corner.value.style.left = `${textarea.value.offsetWidth}px`;
    }
  });

  resizeObserver.observe(textarea.value as Element);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

function clearTextarea(event: Event) {
  model.value = '';
  emit('clear', event);
}

const classes = computed<ClassPropsType>(() => {
  return [
    'ui-textarea',
    {
      'ui-textarea--no-resize ': props.disableResize || props.autoResize,
      'ui-textarea--with-clear-button': props.showClearButton,
      'ui-textarea--disabled': props.disabled,
      'ui-textarea--error': props.showError,
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
.ui-textarea {
  /** textarea variables*/
  --textarea-background: var(--color-neutral-0);
  --textarea-background-hover: var(--color-neutral-0);
  --textarea-color: var(--color-text-primary);
  --textarea-placeholder-color: var(--color-text-placeholder);
  --textarea-border-color-focus: var(--color-primary-500);
  --textarea-border-color-hover: var(--color-primary-300);
  --textarea-border-color: var(--color-neutral-200);
  --textarea-border: 1px solid var(--textarea-border-color);
  --textarea-border-radius: var(--radius-sm);
  --textarea-transition: border-color .2s ease;
  --textarea-min-height: var(--control-height-lg);
  --textarea-min-width: 200px;

  /** textarea font variables */
  --textarea-font-size: var(--paragraph-sm-font-size);
  --textarea-font-weight: var(--paragraph-sm-font-weight);
  --textarea-line-height: var(--paragraph-sm-line-height);
  --textarea-letter-spacing: var(--paragraph-sm-letter-spacing);

  /** textarea disabled variables*/
  --textarea-disabled-border-color: var(--color-neutral-200);
  --textarea-disabled-color: var(--color-text-placeholder);

  /** textarea other variables*/
  --textarea-error-border-color: var(--color-error-500);
  --textarea-padding: var(--spacing-1-5);
  --textarea-clear-button-textarea-padding-right: 36px;
  --textarea-clear-button-size: 20px;
  --textarea-clear-button-right: var(--spacing-1-5);
  --textarea-clear-button-top: var(--spacing-1-5);
  --textarea-clear-button-outline: 2px solid var(--color-primary-100);
  --textarea-clear-button-outline-offset: -2px;

  /** textarea counter variables*/
  --textarea-counter-color: var(--color-text-placeholder);
  --textarea-counter-font-size: var(--paragraph-xs-font-size);
  --textarea-counter-font-weight: var(--paragraph-xs-font-weight);
  --textarea-counter-line-height: var(--paragraph-xs-line-height);
  --textarea-counter-letter-spacing: var(--paragraph-xs-letter-spacing);
  --textarea-counter-width: 100px;
  --textarea-counter-bottom: 6px;

  max-width: 100%;
  width: 100%;
  display: inline-block;
  position: relative;
}

/** textarea */

.ui-textarea textarea {
  width: 100%;
  height: 100%;
  min-width: var(--textarea-min-width);
  max-width: 100%;
  min-height: var(--textarea-min-height);
  background: var(--textarea-background);
  border-radius: var(--textarea-border-radius);
  border: var(--textarea-border);
  padding: var(--textarea-padding);
  transition: var(--textarea-transition);
  color: var(--textarea-color);
  font-size: var(--textarea-font-size);
  line-height: var(--textarea-line-height);
  font-weight: var(--textarea-font-weight);
  letter-spacing: var(--textarea-letter-spacing);
}

.ui-textarea textarea::placeholder {
  color: var(--textarea-placeholder-color);
}

.ui-textarea textarea::-webkit-resizer {
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2398989D' stroke-linecap='round' d='M4 16 16 4M9 16.5l8-8'/%3E%3C/svg%3E");
}

.ui-textarea:hover textarea {
  border-color: var(--textarea-border-color-hover);
}

.ui-textarea textarea:focus {
  outline: none;
  border-color: var(--textarea-border-color-focus);
}

/** no manual resize */

.ui-textarea.ui-textarea--no-resize textarea {
  resize: none;
}

/** класс для позиционирования счетчика и кнопки очистки */
.ui-textarea__corner {
  height: 0;
  width: 0;
  position: absolute;
  top: 0;
  right: 0;
}

.ui-textarea--with-clear-button textarea {
  padding-right: var(--textarea-clear-button-textarea-padding-right);
}

.ui-textarea .ui-textarea__clear-button {
  position: absolute;
  display: block;
  cursor: pointer;
  background-color: transparent;
  right: var(--textarea-clear-button-right);
  padding: 0;
  top: var(--textarea-clear-button-top);
  border: none;
  border-radius: 50%;
  width: var(--textarea-clear-button-size);
  height: var(--textarea-clear-button-size);
}

.ui-textarea .ui-textarea__clear-button:focus-visible {
  outline: var(--textarea-clear-button-outline);
  outline-offset: var(--textarea-clear-button-outline-offset);
}

/** error */

.ui-textarea--error textarea,
.ui-textarea--error:hover textarea {
  border-color: var(--textarea-error-border-color);
}

/** disabled */

.ui-textarea.ui-textarea--disabled textarea,
.ui-textarea.ui-textarea--disabled:hover textarea {
  resize: none;
  border-color: var(--textarea-disabled-border-color);
  color: var(--textarea-disabled-color);
}

.ui-textarea.ui-textarea--disabled textarea::placeholder {
  color: var(--textarea-disabled-color);
}

/** counter */

.ui-textarea__counter {
  position: absolute;
  width: var(--textarea-counter-width);
  right: 0;
  bottom: var(--textarea-counter-bottom);
  font-size: var(--textarea-counter-font-size);
  font-weight: var(--textarea-counter-font-weight);
  line-height: var(--textarea-counter-line-height);
  letter-spacing: var(--textarea-counter-letter-spacing);
  color: var(--textarea-counter-color);
  text-align: right;
}
</style>
