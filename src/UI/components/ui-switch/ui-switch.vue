<template>
  <label
    :class="classes"
    aria-label="switch"
    @click="emit('click', $event)"
  >
    <input
      type="checkbox"
      v-model="checked"
      :disabled="disabled"
      :name="name"
      @input="emit('input', $event)"
      @change="emit('change', $event)"
    >
    <div class="ui-switch__toggle" />
    <div
      class="ui-switch__label"
      v-if="$slots.default"
    >
      <!-- @slot Слот для отображения контента в лейбле свитча -->
      <slot />
    </div>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ClassPropsType } from '../../@types/props';
import { PropsSizeType } from '../../@types/size';
import { SwitchSizesType } from './const';

export interface UiSwitchPropsImpl {
  /** Модель свитча */
  modelValue: any;
  /** Размер свитча */
  size?: PropsSizeType<SwitchSizesType>;
  /** Пропс выключающий свитч */
  disabled?: boolean;
  /** Значение, которое будет добавляться в массив при выборе свитча
   * (используется, когда modelValue ЯВЛЯЕТСЯ массивом)
   * */
  value?: any;
  /** Значение, которое будет возвращаться при активном свитче
   * (используется, когда modelValue НЕ является массивом)
   * */
  trueValue?: any;
  /** Значение, которое будет возвращаться при неактивном свитче
   * (используется, когда modelValue НЕ является массивом)
   * */
  falseValue?: any;
  /** Применить стиль ошибки */
  showError?: boolean;
  /** Аттрибут имени */
  name?: string;
}

const props = withDefaults(defineProps<UiSwitchPropsImpl>(), {
  size: 'md',
  trueValue: true,
  falseValue: false,
  value: true,
  disabled: false,
  showError: false,
});

const emit = defineEmits<{
  /** Обновление модели свитча */
  (e: 'update:modelValue', value: any): void;
  /** Клик по свитчу */
  (e: 'click', event: Event): void;
  /** Проброс ивента input */
  (e: 'input', event: Event): void;
  /** Проброс ивента change */
  (e: 'change', event: Event): void;
}>();

const checked = computed<boolean>({
  get() {
    if (props.modelValue instanceof Array) {
      return props.modelValue.includes(props.value);
    }
    return props.modelValue === props.trueValue;
  },
  set(newValue) {
    if (props.disabled) {
      return;
    }

    if (props.modelValue instanceof Array) {
      const newArray: any[] = [...props.modelValue];

      if (newValue) {
        newArray.push(props.value);
      } else {
        newArray.splice(newArray.indexOf(props.value), 1);
      }
      emit('update:modelValue', newArray);
    } else {
      emit('update:modelValue', newValue ? props.trueValue : props.falseValue);
    }
  },
});

const classes = computed<ClassPropsType>(() => {
  return [
    'ui-switch',
    `ui-switch--${props.size}`,
    {
      'ui-switch--toggled': checked.value,
      'ui-switch--disabled': props.disabled,
      'ui-switch--error': props.showError,
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
.ui-switch {
  /** switch variables*/
  --switch-background: var(--color-neutral-300);
  --switch-background-hover: var(--color-primary-100);
  --switch-background-toggled: var(--color-primary-500);
  --switch-background-toggled-hover: var(--color-primary-300);
  --switch-outline-focus: 4px solid var(--color-primary-100);
  --switch-pseudo-after-color: var(--color-neutral-0);
  --switch-pseudo-after-shadow: var(--shadow-xl);
  --switch-transition: background-color .2s cubic-bezier(1, .05, .39, .74), transform .2s cubic-bezier(1, .05, .39, .74);
  --switch-border-radius: var(--radius-xxl);

  /** switch disabled variables*/
  --switch-disabled-background: var(--graphics-color-gray-300);

  /** size sm variables*/
  --switch-sm-height: 16px;
  --switch-sm-width: calc(2 * var(--switch-sm-height));
  --switch-sm-pseudo-after-size: calc(var(--switch-sm-height) - 4px);
  --switch-sm-font-size: var(--paragraph-sm-font-size);
  --switch-sm-font-weight: var(--paragraph-sm-font-weight);
  --switch-sm-line-height: var(--paragraph-sm-line-height);
  --switch-sm-letter-spacing: var(--paragraph-sm-letter-spacing);
  --switch-sm-label-margin-left: var(--spacing-1);

  /** size md variables*/
  --switch-md-height: 20px;
  --switch-md-width: calc(2 * var(--switch-md-height));
  --switch-md-pseudo-after-size: calc(var(--switch-md-height) - 4px);
  --switch-md-font-size: var(--paragraph-md-font-size);
  --switch-md-font-weight: var(--paragraph-md-font-weight);
  --switch-md-line-height: var(--paragraph-md-line-height);
  --switch-md-letter-spacing: var(--paragraph-md-letter-spacing);
  --switch-md-label-margin-left: var(--spacing-1-5);

  /** size lg variables*/
  --switch-lg-height: 24px;
  --switch-lg-width: calc(2 * var(--switch-lg-height));
  --switch-lg-pseudo-after-size: calc(var(--switch-lg-height) - 4px);
  --switch-lg-font-size: var(--paragraph-md-font-size);
  --switch-lg-font-weight: var(--paragraph-md-font-weight);
  /** используется switch-lg-height из-за того, что стандартный line-height шрифта меньше высоты switch */
  --switch-lg-line-height: var(--switch-lg-height);
  --switch-lg-letter-spacing: var(--paragraph-md-letter-spacing);
  --switch-lg-label-margin-left: var(--spacing-1-5);

  /** switch other variables*/
  --switch-error-border-color: var(--color-error-500);
  --switch-error-background: var(--color-error-100);
  --switch-error-background-hover: var(--color-error-100);
  --switch-error-background-toggled: var(--color-error-500);
  --switch-error-background-toggled-hover: var(--color-error-500);

  position: relative;
  display: inline-flex;
}

.ui-switch__label {
  user-select: none;
  cursor: pointer;
}

/** hidden input */

.ui-switch input {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
  z-index: -1;
}

.ui-switch input:focus-visible+.ui-switch__toggle {
  outline: var(--switch-outline-focus);
}

/** switch toggle */

.ui-switch__toggle {
  display: block;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  border-radius: var(--switch-border-radius);
  background: var(--switch-background);
  transition: var(--switch-transition);
}

.ui-switch__toggle::after {
  content: '';
  position: absolute;
  width: var(--switch-pseudo-after-size-lg);
  height: var(--switch-pseudo-after-size-lg);
  background: var(--switch-pseudo-after-color);
  border-radius: 50%;
  left: 2px;
  top: 2px;
  transition: var(--switch-transition);
  transform: translateX(0);
  box-shadow: var(--switch-pseudo-after-shadow);
}

.ui-switch:hover .ui-switch__toggle {
  background: var(--switch-background-hover);
  cursor: pointer;
}

/** toggled */

.ui-switch--toggled .ui-switch__toggle {
  background: var(--switch-background-toggled);
}

.ui-switch--toggled .ui-switch__toggle::after {
  transform: translateX(calc(100% + 4px));
}

.ui-switch--toggled:hover .ui-switch__toggle {
  background: var(--switch-background-toggled-hover);
}

/** disabled */

.ui-switch--disabled .ui-switch__toggle {
  background: var(--switch-disabled-background);
  cursor: default;
  pointer-events: none;
}

.ui-switch--disabled .ui-switch__toggle::after {
  opacity: .7;
  box-shadow: none;
}

.ui-switch--disabled:hover .ui-switch__toggle {
  background: var(--switch-disabled-background);
}

/** size sm */

.ui-switch--sm .ui-switch__toggle {
  width: var(--switch-sm-width);
  height: var(--switch-sm-height);
}

.ui-switch--sm .ui-switch__label {
  font-size: var(--switch-sm-font-size);
  font-weight: var(--switch-sm-font-weight);
  line-height: var(--switch-sm-line-height);
  letter-spacing: var(--switch-sm-letter-spacing);
  margin-left: var(--switch-sm-label-margin-left);
}

.ui-switch--sm .ui-switch__toggle::after {
  width: var(--switch-sm-pseudo-after-size);
  height: var(--switch-sm-pseudo-after-size);
}

/** size md */

.ui-switch--md .ui-switch__toggle {
  width: var(--switch-md-width);
  height: var(--switch-md-height);
}

.ui-switch--md .ui-switch__label {
  font-size: var(--switch-md-font-size);
  font-weight: var(--switch-md-font-weight);
  line-height: var(--switch-md-line-height);
  letter-spacing: var(--switch-md-letter-spacing);
  margin-left: var(--switch-md-label-margin-left);
}

.ui-switch--md .ui-switch__toggle::after {
  width: var(--switch-md-pseudo-after-size);
  height: var(--switch-md-pseudo-after-size);
}

/** size lg */

.ui-switch--lg .ui-switch__toggle {
  width: var(--switch-lg-width);
  height: var(--switch-lg-height);
}

.ui-switch--lg .ui-switch__label {
  font-size: var(--switch-lg-font-size);
  font-weight: var(--switch-lg-font-weight);
  line-height: var(--switch-lg-line-height);
  letter-spacing: var(--switch-lg-letter-spacing);
  margin-left: var(--switch-lg-label-margin-left);
}

.ui-switch--lg .ui-switch__toggle::after {
  width: var(--switch-lg-pseudo-after-size);
  height: var(--switch-lg-pseudo-after-size);
}

/** error */

.ui-switch--error .ui-switch__toggle {
  border: 1px solid var(--switch-error-border-color);
  background: var(--switch-error-background);
  box-sizing: content-box;
}

.ui-switch--error:hover .ui-switch__toggle {
  background: var(--switch-error-background-hover);
}

/** toggled */

.ui-switch--error.ui-switch--toggled .ui-switch__toggle {
  background: var(--switch-error-background-toggled);
}
</style>
