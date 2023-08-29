<template>
  <label :class="classes">
    <input
      ref="input"
      :value="text"
      :disabled="!allowEdit"
      :style="`width: ${inputWidth}px`"
      v-autowidth="{ maxWidth: inputMaxWidth, minWidth: inputMinWidth, comfortZone: inputComfortZone }"
      @focus="onFocused"
      @blur="onBlur"
      v-on:input="onChange"
      v-on:keyup="onKeyup"
      @click="emit('click', value)"
    >
    <button
      type="button"
      v-if="allowRemove"
      @click="removeChip"
      :disabled="disabled"
    >
      <ui-chip-remove-button />
    </button>
  </label>
</template>

<script setup lang="ts">
import {
  nextTick,
  onBeforeMount,
  ComputedRef,
  computed,
  watch,
  ref,
} from 'vue';
import { ClassPropsType } from '../../@types/props';
import RrChipRemoveButton from './ui-chip-remove-button.vue';

export interface RrChipsPropsImpl {
  /** дефолтный текст чипса */
  default?: string;
  /** значение чипса */
  value?: string;
  /** префикс (строка которая будет добавляться перед значением) */
  prefix?: string;
  /** максимальная ширина, до которой будет увеличиваться поле ввода. */
  inputMaxWidth?: string;
  /** обрезать значение чипса троеточием, если оно не помещается */
  ellipsis?: boolean;
  /** минимальная ширина, до которой будет сжиматься поле ввода. */
  inputMinWidth?: string;
  /** дополнительное пространство в пикселях для добавления к дальней стороне содержимого ввода. */
  inputComfortZone?: number;
  /** флаг создания чипса */
  allowCreate?: boolean;
  /** флаг редактирования чипса */
  allowEdit?: boolean;
  /** флаг удаления чипса */
  allowRemove?: boolean;
  /** выключен */
  disabled?: boolean;
  /** размер */
  size?: 'sm' | 'md';
  /** тема чипса */
  theme?: 'default' | 'success' | 'warning' | 'error';
}

const keys = {
  enter: 'Enter',
};

const props = withDefaults(defineProps<RrChipsPropsImpl>(), {
  default: '',
  prefix: '',
  inputMaxWidth: 'none',
  inputMinWidth: '20px',
  inputComfortZone: 0,
  disabled: false,
  size: 'md',
  theme: 'default',
  ellipsis: true,
});

const emit = defineEmits<{
  /** событие клика по чипсу */
  (e: 'click', value: string | undefined): void;
  /** событие изменения чипса */
  (e: 'change', value: string): void;
  /** событие удаление чипса */
  (e: 'remove'): void;
  /** событие создание чипса */
  (e: 'create', value: string): void;
}>();

const isError = ref(false);

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-chip',
  `ui-chip--${props.size}`,
  `ui-chip--${props.theme}`,
  {
    'ui-chip--ellipsis': props.ellipsis,
    'ui-chip--edit': props.allowEdit,
    'ui-chip--remove': props.allowRemove,
    'ui-chip--create': props.allowCreate,
    'ui-chip--error': isError.value,
    'ui-chip--disabled': props.disabled,
  },
]);

const input = ref();
const inputWidth = ref();
const text = ref('');

const removeChip = (): void => {
  emit('remove');
};

const onKeyup = (event: KeyboardEvent): void => {
  if (event.key === keys.enter) {
    input.value.blur();
  }
};

const onFocused = (event: Event): void => {
  const target: HTMLInputElement = event.target as HTMLInputElement;
  target.select();
};

const removeHashTag = (text: string): string => {
  if (!props.prefix) return text;
  return text.replace(props.prefix, '');
};

const formatToHashTag = (text: string): string => {
  if (!props.prefix) return text;
  text = text.replace(/ /g, '');
  if (text.startsWith(props.prefix) || !text.length) {
    return text;
  }

  return `${props.prefix}${text}`;
};

const onBlur = (): void => {
  const textWithoutTag = removeHashTag(text.value);
  if (textWithoutTag === props.default) {
    return;
  }

  if (props.allowCreate && textWithoutTag.length) {
    emit('create', textWithoutTag);
    text.value = props.default;

    setTimeout(() => {
      input.value.focus();
    }, 0);
  }
};

const onChange = (event: Event): void => {
  const target: HTMLInputElement = event.target as HTMLInputElement;
  if (!target.value) {
    isError.value = true;
  } else {
    isError.value = false;
  }
  text.value = formatToHashTag(target.value);
  emit('change', removeHashTag(text.value));
};

onBeforeMount(() => {
  nextTick(() => {
    text.value = props.value || props.default;

    if (!props.allowCreate) {
      text.value = formatToHashTag(text.value);
    }
  });
});

watch(() => props.value, (newValue) => {
  if (typeof newValue === 'string') {
    text.value = newValue;
  }
});

</script>
<style>
.ui-chip {
  --chip-radius: var(--radius-sm);
  --chip-border: 1px solid transparent;

  --chip-md-height: 24px;
  --chip-md-vertical-spacing: var(--spacing-0-5);
  --chip-md-horizontal-spacing: var(--spacing-1-5);
  --chip-md-padding: var(--chip-md-vertical-spacing) var(--chip-md-horizontal-spacing);
  --chip-md-font-size: var(--action-sm-font-size);
  --chip-md-line-height: var(--action-sm-line-height);
  --chip-md-font-weight: var(--action-sm-font-weight);
  --chip-md-letter-spacing: var(--action-sm-letter-spacing);

  --chip-sm-height: 20px;
  --chip-sm-vertical-spacing: var(--spacing-0-25);
  --chip-sm-horizontal-spacing: var(--spacing-1-5);
  --chip-sm-padding: var(--chip-sm-vertical-spacing) var(--chip-sm-horizontal-spacing);
  --chip-sm-font-size: var(--paragraph-sm-font-size);
  --chip-sm-line-height: var(--paragraph-sm-line-height);
  --chip-sm-font-weight: var(--paragraph-sm-font-weight);
  --chip-sm-letter-spacing: var(--paragraph-sm-letter-spacing);

  --chip-text-transform: none;

  --chip-default-text-color: var(--color-primary-500);
  --chip-default-background-color: var(--color-primary-100);
  --chip-default-background-color-hover: var(--color-primary-100);
  --chip-default-selection-background-color: var(--color-primary-300);
  --chip-default-selection-text-color: var(--color-text-inversion);
  --chip-default-border-hover: 1px solid var(--color-primary-300);

  --chip-success-text-color: var(--color-success-500);
  --chip-success-background-color: var(--color-success-100);
  --chip-success-background-color-hover: var(--color-success-100);
  --chip-success-selection-background-color: var(--color-success-300);
  --chip-success-selection-text-color: var(--color-success-600);
  --chip-success-border-hover: 1px solid var(--color-success-500);

  --chip-warning-text-color: var(--color-warning-500);
  --chip-warning-background-color: var(--color-warning-100);
  --chip-warning-background-color-hover: var(--color-warning-100);
  --chip-warning-selection-background-color: var(--color-warning-300);
  --chip-warning-selection-text-color: var(--color-warning-600);
  --chip-warning-border-hover: 1px solid var(--color-warning-500);

  --chip-error-text-color: var(--color-error-500);
  --chip-error-background-color: var(--color-error-100);
  --chip-error-background-color-hover: var(--color-error-100);
  --chip-error-selection-background-color: var(--color-error-300);
  --chip-error-selection-text-color: var(--color-error-600);
  --chip-error-border-hover: 1px solid var(--color-error-500);

  --chip-disabled-background-color: var(--color-neutral-200);
  --chip-disabled-text-color: var(--color-text-light);

  position: relative;
  border: var(--chip-border);
  background: var(--chip-background-color);
  border-radius: var(--chip-radius);
  text-transform: var(--chip-text-transform);
}

/** default theme */

.ui-chip--default {
  color: var(--chip-default-text-color);
  background-color: var(--chip-default-background-color);
}

.ui-chip--default input,
.ui-chip--default button {
  color: var(--chip-default-text-color);
}

.ui-chip--default:hover {
  background-color: var(--chip-default-background-color-hover);
  border: var(--chip-default-border-hover);
}

.ui-chip--default input::selection {
  background: var(--chip-default-selection-background-color);
  color: var(--chip-default-selection-text-color);
}

/** success theme */

.ui-chip--success {
  color: var(--chip-success-text-color);
  background-color: var(--chip-success-background-color);
}

.ui-chip--success input,
.ui-chip--success button {
  color: var(--chip-success-text-color);
}

.ui-chip--success:hover {
  background-color: var(--chip-success-background-color-hover);
  border: var(--chip-success-border-hover);
}

.ui-chip--success input::selection {
  background: var(--chip-success-selection-background-color);
  color: var(--chip-success-selection-text-color);
}

/** warning theme */

.ui-chip--warning {
  color: var(--chip-warning-text-color);
  background-color: var(--chip-warning-background-color);
}

.ui-chip--warning input,
.ui-chip--warning button {
  color: var(--chip-warning-text-color);
}

.ui-chip--warning:hover {
  background-color: var(--chip-warning-background-color-hover);
  border: var(--chip-warning-border-hover);
}

.ui-chip--warning input::selection {
  background: var(--chip-warning-selection-background-color);
  color: var(--chip-warning-selection-text-color);
}

/** error theme */

.ui-chip--error {
  color: var(--chip-error-text-color);
  background-color: var(--chip-error-background-color);
}

.ui-chip--error input,
.ui-chip--error button {
  color: var(--chip-error-text-color);
}

.ui-chip--error:hover {
  background-color: var(--chip-error-background-color-hover);
  border: var(--chip-error-border-hover);
}

.ui-chip--error input::selection {
  background: var(--chip-error-selection-background-color);
  color: var(--chip-error-selection-text-color);
}

/** size sm */

.ui-chip--sm {
  height: var(--chip-sm-height);
  padding: var(--chip-sm-padding);
  font-size: var(--chip-sm-font-size);
  line-height: var(--chip-sm-line-height);
  font-weight: var(--chip-sm-font-weight);
  letter-spacing: var(--chip-sm-letter-spacing);
}

.ui-chip--sm button {
  right: var(--chip-sm-horizontal-spacing);
}

/** size md */

.ui-chip--md {
  height: var(--chip-md-height);
  padding: var(--chip-md-padding);
  font-size: var(--chip-md-font-size);
  line-height: var(--chip-md-line-height);
  font-weight: var(--chip-md-font-weight);
  letter-spacing: var(--chip-md-letter-spacing);
}

.ui-chip--md button {
  right: var(--chip-md-horizontal-spacing);
}

.ui-chip.ui-chip--disabled {
  background-color: var(--chip-disabled-background-color);
}

.ui-chip.ui-chip--disabled:hover {
  border-color: var(--chip-disabled-background-color);
}

.ui-chip.ui-chip--disabled input,
.ui-chip.ui-chip--disabled button {
  color: var(--chip-disabled-text-color);
}

.ui-chip input {
  display: inline;
  border: none;
  background: inherit;
  outline: none;
  width: initial;
  padding: 0;
  text-align: center;
  user-select: none;
}

.ui-chip button {
  position: absolute;
  border: none;
  background-color: transparent;
  top: 50%;
  cursor: pointer;
  transform: translateY(-50%);
}

.ui-chip--edit {
  cursor: text;
}

.ui-chip--remove:not(.ui-chip--create) {
  padding-right: 28px;
}

.ui-chip--edit input {
  user-select: all;
}

.ui-chip--create {
  opacity: .7;
}

.ui-chip--ellipsis input {
  text-overflow: ellipsis;
}
</style>
