<template>
  <ui-input
    :modelValue="model"
    @update:modelValue="//@ts-ignore
      model = $event"
    :type="inputType"
    class="ui-input-password"
    v-on="$listeners"
    :placeholder="placeholder"
    :size="size"
    :disabled="disabled"
    :show-error="showError"
    :show-clear-button="showClearButton"
    :left-icon="leftIcon"
    :left-icon-color="leftIconColor"
    :name="name"
    :max-length="maxLength"
    :autocomplete="autocomplete"
  >
    <template
      #rightContainer
      v-if="showButton"
    >
      <transition name="bounce">
        <button
          type="button"
          class="ui-input-password__show-button"
          @click="togglePassword"
          v-if="showButton && !disabled"
        >
          <ui-icon :name="eyeIcon" />
        </button>
      </transition>
    </template>
  </ui-input>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { IconsConfig } from '../../@types/icons-config';
import { PropsSizeType } from '../../@types/size';
import { useConfigParam } from '../../lib/useConfigParam';
import { InputSizesType } from '../ui-input/const';

export interface RrInputPasswordPropsImpl {
  /** Пропсы ui-input */

  /** Модель инпута */
  modelValue: string;
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
  /** Аттрибут имени */
  name?: string;
  /** Максимальное кол-во символов */
  maxLength?: number;
  /** Автозаполнение https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete */
  autocomplete?: string,

  /** Пропсы ui-input-password */

  /** Показать кнопку переключения режима */
  showButton?: boolean;
}

const props = withDefaults(defineProps<RrInputPasswordPropsImpl>(), {
  showButton: true,
  autocomplete: 'off',
});

const emit = defineEmits<{
  /** Обновление модели инпута */
  (e: 'update:modelValue', value: string): void;
  /** Нажатие на кнопку "показать/скрыть" */
  (e: 'click:button', event: Event): void;
}>();

const model = computed<string>({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  },
});

const inputType = ref<'password' | 'text'>('password');

const iconsConfig = useConfigParam('icons') as IconsConfig;
const eyeIcon = computed<IconsNamesType>(() => {
  if (inputType.value === 'password') {
    return iconsConfig.systemIcons.controls.eye;
  }

  return iconsConfig.systemIcons.controls.eyeSlash;
});

function togglePassword(event: Event) {
  inputType.value = inputType.value === 'password' ? 'text' : 'password';
  emit('click:button', event);
}

</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<style>
.ui-input-password {
  --input-password-show-button-background: transparent;
  --input-password-show-button-right: var(--spacing-0-5);
  --input-password-show-button-size: 20px;
  --input-password-show-button-border-radius: var(--radius-xs);
  --input-password-show-button-outline: 2px solid var(--color-primary-100);
  --input-password-show-button-outline-offset: 1px;
}

/** show button */

.ui-input-password .ui-input-password__show-button {
  position: absolute;
  cursor: pointer;
  background-color: var(--input-password-show-button-background);

  right: var(--input-password-show-button-right);
  padding: 0;
  top: 0;
  bottom: 0;
  width: var(--input-password-show-button-size);
  height: var(--input-password-show-button-size);
  margin: auto 0;
  border: none;
  border-radius: var(--input-password-show-button-border-radius);
}

.ui-input-password .ui-input-password__show-button:focus-visible {
  outline: var(--input-password-show-button-outline);
  outline-offset: var(--input-password-show-button-outline-offset);
}
</style>
