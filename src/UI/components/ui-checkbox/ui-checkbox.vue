<template>
  <label
    :class="classes"
    aria-label="checkbox"
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
    <span class="ui-checkbox__box">
      <transition name="bounce">
        <ui-icon
          :name="indeterminate ? minusIcon : checkIcon"
          v-if="checked || indeterminate"
        />
      </transition>
    </span>
    <div
      class="ui-checkbox__label"
      v-if="$slots.default"
    >
      <!-- @slot Слот для отображения контента в лейбле чекбокса -->
      <slot />
    </div>
  </label>
</template>

<script setup lang="ts">
/* TODO: можно сделать, чтобы при indetereminate скрытому инпуту
тоже присавивалось стандартное indeterminate = true;
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes
*/

import { computed } from 'vue';
import { IconsConfig } from '../../@types/icons-config';
import { ClassPropsType } from '../../@types/props';
import { PropsSizeType } from '../../@types/size';
import { useConfigParam } from '../../lib/useConfigParam';
import { CheckboxSizesType } from './const';

export interface UiCheckboxPropsImpl {
  /** Модель чекбокса */
  modelValue: any;
  /** Размер чекбокса */
  size?: PropsSizeType<CheckboxSizesType>;
  /** Показать неопределенное состояние */
  indeterminate?: boolean;
  /** Пропс выключающий чекбокс */
  disabled?: boolean;
  /** Значение, которое будет добавляться в массив при выборе чекбокса
   * (используется, когда modelValue ЯВЛЯЕТСЯ массивом)
   * */
  value?: any;
  /** Значение, которое будет возвращаться при активном чекбоксе
   * (используется, когда modelValue НЕ является массивом)
   * */
  trueValue?: any;
  /** Значение, которое будет возвращаться при неактивном чекбоксе
   * (используется, когда modelValue НЕ является массивом)
   * */
  falseValue?: any;
  /** Применить стиль ошибки */
  showError?: boolean;
  /** Аттрибут имени */
  name?: string;
}

const props = withDefaults(defineProps<UiCheckboxPropsImpl>(), {
  size: 'md',
  trueValue: true,
  falseValue: false,
  value: true,
  indeterminate: false,
  disabled: false,
  showError: false,
});

const emit = defineEmits<{
  /** Обновление модели чекбокса */
  (e: 'update:modelValue', value: any): void;
  /** Клик по чекбоксу */
  (e: 'click', event: Event): void;
  /** Проброс ивента input */
  (e: 'input', event: Event): void;
  /** Проброс ивента change */
  (e: 'change', event: Event): void;
}>();

const iconsConfig = useConfigParam('icons') as IconsConfig;
const checkIcon: IconsNamesType = iconsConfig.systemIcons.controls.check;
const minusIcon: IconsNamesType = iconsConfig.systemIcons.controls.minusSmall;

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
    'ui-checkbox',
    `ui-checkbox--${props.size}`,
    {
      'ui-checkbox--checked': checked.value,
      'ui-checkbox--indeterminate': props.indeterminate,
      'ui-checkbox--disabled': props.disabled,
      'ui-checkbox--error': props.showError,
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
  /** checkbox variables*/
  --checkbox-background: var(--color-primary-500);
  --checkbox-background-hover: var(--color-primary-300);
  --checkbox-border-color: var(--color-neutral-300);
  --checkbox-icon-color: var(--color-neutral-0);
  --checkbox-outline-focus: 3px solid var(--color-primary-100);
  --checkbox-border: 1px solid var(--checkbox-border-color);
  --checkbox-transition: background .2s ease, border .2s ease;
  --checkbox-border-radius: var(--radius-sm);

  /** checkbox disabled variables*/
  --checkbox-disabled-background: var(--color-neutral-100);
  --checkbox-disabled-checked-background: var(--color-neutral-200);
  --checkbox-disabled-border-color: var(--color-neutral-200);
  --checkbox-disabled-icon-color: var(--color-text-light);

  /** size sm variables*/
  --checkbox-sm-size: 16px;
  --checkbox-sm-font-size: var(--paragraph-sm-font-size);
  --checkbox-sm-font-weight: var(--paragraph-sm-font-weight);
  --checkbox-sm-line-height: var(--paragraph-sm-line-height);
  --checkbox-sm-letter-spacing: var(--paragraph-sm-letter-spacing);
  --checkbox-sm-label-margin-left: var(--spacing-1);

  /** size md variables*/
  --checkbox-md-size: 20px;
  --checkbox-md-font-size: var(--paragraph-md-font-size);
  --checkbox-md-font-weight: var(--paragraph-md-font-weight);
  --checkbox-md-line-height: var(--paragraph-md-line-height);
  --checkbox-md-letter-spacing: var(--paragraph-md-letter-spacing);
  --checkbox-md-label-margin-left: var(--spacing-1-5);

  /** size lg variables*/
  --checkbox-lg-size: 24px;
  --checkbox-lg-font-size: var(--paragraph-md-font-size);
  --checkbox-lg-font-weight: var(--paragraph-md-font-weight);

  /** используется checkbox-lg-size из-за того, что стандартный line-height шрифта меньше высоты чекбокса */
  --checkbox-lg-line-height: var(--checkbox-lg-size);
  --checkbox-lg-letter-spacing: var(--paragraph-md-letter-spacing);
  --checkbox-lg-label-margin-left: var(--spacing-1-5);

  /** checkbox error variables*/
  --checkbox-error-border-color: var(--color-error-500);
  --checkbox-error-background-color: var(--color-error-500);
}

.ui-checkbox {
  position: relative;
  display: inline-flex;
}

/** hidden input */

.ui-checkbox input {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
  z-index: -1;
}

.ui-checkbox input:focus-visible+.ui-checkbox__box {
  outline: var(--checkbox-outline-focus);
}

/** checkbox box */

.ui-checkbox__box {
  position: relative;
  flex-shrink: 0;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--checkbox-size-md);
  height: var(--checkbox-size-md);
  border: var(--checkbox-border);
  border-radius: var(--checkbox-border-radius);
  transition: var(--checkbox-transition);
  color: var(--checkbox-icon-color);
  overflow: hidden;
}

.ui-checkbox__box .ui-icon {
  flex-shrink: 1;
}

.ui-checkbox:hover .ui-checkbox__box {
  cursor: pointer;
  border-color: var(--checkbox-background-hover);
}

/** checked */

.ui-checkbox--checked .ui-checkbox__box {
  background: var(--checkbox-background);
  border-color: var(--checkbox-background);
}

.ui-checkbox--checked:hover .ui-checkbox__box {
  background: var(--checkbox-background-hover);
}

/** indeterminate */

.ui-checkbox--indeterminate .ui-checkbox__box {
  background: var(--checkbox-background);
  border: none;
}

.ui-checkbox--indeterminate:hover .ui-checkbox__box {
  background: var(--checkbox-background-hover);
}

/** disabled */

.ui-checkbox--disabled .ui-checkbox__box {
  background: var(--checkbox-disabled-background);
  cursor: default;
  pointer-events: none;
  color: var(--checkbox-disabled-icon-color);
  border: var(--checkbox-border);
  border-color: var(--checkbox-disabled-border-color);
}

.ui-checkbox--disabled:is(.ui-checkbox--checked, .ui-checkbox--indeterminate) .ui-checkbox__box {
  background: var(--checkbox-disabled-checked-background);
  border-color: var(--checkbox-disabled-border-color);
  color: var(--checkbox-icon-color);
}

.ui-checkbox--disabled:hover .ui-checkbox__box {
  cursor: not-allowed;
  border-color: var(--checkbox-disabled-border-color);
}

.ui-checkbox__label {
  user-select: none;
  cursor: pointer;
}

/** size sm */

.ui-checkbox--sm .ui-checkbox__box {
  width: var(--checkbox-sm-size);
  height: var(--checkbox-sm-size);
}

.ui-checkbox--sm .ui-checkbox__label {
  font-size: var(--checkbox-sm-font-size);
  font-weight: var(--checkbox-sm-font-weight);
  letter-spacing: var(--checkbox-sm-letter-spacing);
  line-height: var(--checkbox-sm-line-height);
  margin-left: var(--checkbox-sm-label-margin-left);
}

/** size md */

.ui-checkbox--md .ui-checkbox__box {
  width: var(--checkbox-md-size);
  height: var(--checkbox-md-size);
}

.ui-checkbox--md .ui-checkbox__label {
  font-size: var(--checkbox-md-font-size);
  font-weight: var(--checkbox-md-font-weight);
  letter-spacing: var(--checkbox-md-letter-spacing);
  line-height: var(--checkbox-md-line-height);
  margin-left: var(--checkbox-md-label-margin-left);
}

/** size lg */

.ui-checkbox--lg .ui-checkbox__box {
  width: var(--checkbox-lg-size);
  height: var(--checkbox-lg-size);
}

.ui-checkbox--lg .ui-checkbox__label {
  font-size: var(--checkbox-lg-font-size);
  font-weight: var(--checkbox-lg-font-weight);
  letter-spacing: var(--checkbox-lg-letter-spacing);
  line-height: var(--checkbox-lg-line-height);
  margin-left: var(--checkbox-lg-label-margin-left);
}

/** error */

.ui-checkbox--error .ui-checkbox__box,
.ui-checkbox--error:hover .ui-checkbox__box {
  border-color: var(--checkbox-error-border-color);
}

.ui-checkbox--error.ui-checkbox--checked .ui-checkbox__box,
.ui-checkbox--error.ui-checkbox--checked:hover .ui-checkbox__box {
  background: var(--checkbox-error-background-color);
}
</style>
