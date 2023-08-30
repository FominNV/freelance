<template>
  <li :class="classes">
    <div class="ui-dropzone-file__container">
      <div class="ui-dropzone-file__icon">
        <ui-icon :name="fileIcon" />
      </div>
      <span>
        <p class="ui-dropzone-file__name">
          {{ props.name }}
        </p>
        <p class="ui-dropzone-file__description">
          {{ getFileDescription() }}
        </p>
        <span
          class="ui-dropzone-file__error-text"
          v-if="showError && errorText"
        >
          {{ errorText }}
        </span>
      </span>
    </div>
    <div class="ui-dropzone-file__container">
      <!-- @slot слот действий для файла -->
      <slot name="actions" />
      <button
        v-if="showRemoveButton"
        type="button"
        class="ui-dropzone-file__remove-button"
        @click="emit('click:remove', $event)"
      >
        <ui-icon :name="clearIcon" />
      </button>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IconsConfig } from '../../@types/icons-config';
import { ClassPropsType } from '../../@types/props';
import { useConfigParam } from '../../lib/useConfigParam';

export interface UiDropzoneFileItemPropsImpl {
  /** Название файла */
  name: string;
  /** Размер файла в байтах */
  size?: string | number;
  /** Применить стиль ошибки */
  showError?: boolean;
  /** Текст ошибки */
  errorText?: string;
  /** Показать кнопку удаления */
  showRemoveButton?: boolean;
}

const emit = defineEmits<{
  /** Клик по кнопке удалить */
  (e: 'click:remove', event: Event): void;
}>();

const props = withDefaults(defineProps<UiDropzoneFileItemPropsImpl>(), {
  showError: false,
  showRemoveButton: true,
});
const bytesInMB = 1000000;

const iconsConfig = useConfigParam('icons') as IconsConfig;
const fileIcon: IconsNamesType = iconsConfig.systemIcons.controls.filePlus;
const clearIcon: IconsNamesType = iconsConfig.systemIcons.controls.clear;

function getFileDescription() {
  let string = `${props.name.split('.').pop()?.toLowerCase()}`;
  if (props.size) {
    string += `, ${(Number(props.size) / bytesInMB).toFixed(2)} МБ`;
  }
  return string;
}

const classes = computed<ClassPropsType>(() => [
  'ui-dropzone-file',
  {
    'ui-dropzone-file--error': props.showError,
  },
]);
</script>

<style>
.ui-dropzone-file {
  /** dropzone file */
  --dropzone-file-background-color: var(--color-neutral-0);

  --dropzone-file-text-color-first: var(--color-text-primary);
  --dropzone-file-text-color-second: var(--color-text-secondary);
  --dropzone-file-text-color-error: var(--color-error-500);

  --dropzone-file-border-radius: var(--radius-lg);
  --dropzone-file-border-color: var(--color-neutral-200);
  --dropzone-file-border: 1px solid var(--dropzone-file-border-color);

  --dropzone-file-name-font-size: var(--paragraph-sm-font-size);
  --dropzone-file-name-font-weight: var(--paragraph-sm-font-weight);
  --dropzone-file-name-letter-spacing: var(--paragraph-sm-letter-spacing);
  --dropzone-file-name-line-height: var(--paragraph-sm-line-height);

  --dropzone-file-description-font-size: var(--paragraph-xs-font-size);
  --dropzone-file-description-font-weight: var(--paragraph-xs-font-weight);
  --dropzone-file-description-letter-spacing: var(--paragraph-xs-letter-spacing);
  --dropzone-file-description-line-height: var(--paragraph-xs-line-height);

  --dropzone-file-icon-background-color: var(--color-neutral-100);
  --dropzone-file-icon-background-color-error: var(--color-error-100);
  --dropzone-file-icon-size: 28px;
  --dropzone-file-icon-border-radius: var(--radius-sm);
  --dropzone-file-container-gap: var(--spacing-1);

  /** dropzone remove button */
  --dropzone-file-remove-button-size: 20px;
  --dropzone-spacing: var(--spacing-1-5);
  --dropzone-file-padding: var(--dropzone-spacing);

  position: relative;
  background: var(--dropzone-file-background-color);
  border: var(--dropzone-file-border);
  border-radius: var(--dropzone-file-border-radius);
  padding: var(--dropzone-file-padding);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  word-break: break-all;
  width: 100%;
  gap: var(--dropzone-file-container-gap);
}

.ui-dropzone-file__icon {
  background: var(--dropzone-file-icon-background-color);
  border-radius: var(--dropzone-file-icon-border-radius);
  width: var(--dropzone-file-icon-size);
  height: var(--dropzone-file-icon-size);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.ui-dropzone-file__name,
.ui-dropzone-file__error-text {
  font-size: var(--dropzone-file-name-font-size);
  font-weight: var(--dropzone-file-name-font-weight);
  letter-spacing: var(--dropzone-file-name-letter-spacing);
  line-height: var(--dropzone-file-name-line-height);
  color: var(--dropzone-file-text-color-first);
}

.ui-dropzone-file__description {
  font-size: var(--dropzone-file-description-font-size);
  font-weight: var(--dropzone-file-description-font-weight);
  letter-spacing: var(--dropzone-file-description-letter-spacing);
  line-height: var(--dropzone-file-description-line-height);
  color: var(--dropzone-file-text-color-second);
}

/** clear button */

.ui-dropzone-file__remove-button {
  display: inline-flex;
  cursor: pointer;
  background-color: transparent;
  width: var(--dropzone-file-remove-button-size);
  height: var(--dropzone-file-remove-button-size);
  border: none;
}

/** error theme */
.ui-dropzone-file--error .ui-dropzone-file__icon {
  background-color: var(--dropzone-file-icon-background-color-error);
  color: var(--dropzone-file-text-color-error);
}

.ui-dropzone-file--error .ui-dropzone-file__error-text {
  margin-top: var(--dropzone-spacing);
  display: block;
  color: var(--dropzone-file-text-color-error);
}

.ui-dropzone-file__container {
  display: flex;
  align-items: flex-start;
  gap: var(--dropzone-file-container-gap);
}
</style>
