<template>
  <div class="ui-dropzone__wrapper">
    <label
      @dragenter="dragHover = true"
      @dragleave="dragHover = false"
      @dragover.prevent
      @drop.prevent="dropHandler"
      :class="classes"
      v-if="modelValue.length < maxFiles"
    >
      <ui-icon
        :name="filePlusIcon"
        class="ui-dropzone__icon"
      />
      <span class="ui-dropzone__message">Перетащите файл в это окно или
        <span class="ui-dropzone__message-accent">загрузите его</span>
      </span>
      <span
        class="ui-dropzone__info"
        v-if="getFilesQuantityText() || getFileSizeText()"
      >
        {{ getFilesQuantityText() }}
        {{ getFileSizeText() }}
      </span>
      <span
        class="ui-dropzone__info"
        v-if="acceptedTypes"
      >
        Только файлы в формате {{ acceptedTypes }}
      </span>
      <input
        type="file"
        id="dropzoneFile"
        class="dropzoneFile"
        ref="inputFile"
        :multiple="maxFiles > 1"
        @change.prevent="changeHandler"
        :accept="acceptedTypes"
        :disabled="disabled"
      />
    </label>
    <template v-if="!hideFilesList">
      <p
        class="ui-dropzone__files-title"
        v-if="model?.length && modelValue.length < maxFiles"
      >
        Загруженные файлы
      </p>
      <ul
        class="ui-dropzone__file-list"
        v-if="model?.length"
      >
        <ui-dropzone-file-item
          v-for="(file, index) in model"
          :key="file.name"
          :name="file.name"
          :size="file.size"
          @click:remove="removeFile(index)"
        />
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
// TODO: можно реализовать поддержку MIME типов

import { computed, ref } from 'vue';
import { IconsConfig } from '../../@types/icons-config';
import { ClassPropsType } from '../../@types/props';
import { useConfigParam } from '../../lib/useConfigParam';
import RrDropzoneFileItem from './ui-dropzone-file-item.vue';

export interface RrDropzonePropsImpl {
  /** модель дропзоны */
  modelValue: File[];
  /** принимаемые форматы файлов через запятую, например '.jpg, .png, .pdf' */
  acceptedTypes?: string;
  /** максимальный размер файла в байтах */
  maxFileSize?: number;
  /** максимальное кол-во файлов */
  maxFiles?: number;
  /** выключение инпута и возможности прикрепить файл */
  disabled?: boolean;
  /** применить стиль ошибки */
  showError?: boolean;
  /** скрыть список файлов */
  hideFilesList?: boolean;
}

const props = withDefaults(defineProps<RrDropzonePropsImpl>(), {
  modelValue: () => [],
  acceptedTypes: '',
  maxFileSize: Infinity,
  maxFiles: Infinity,
  disabled: false,
  showError: false,
  hideFilesList: false,
});

const emit = defineEmits<{
  /** Обновление модели дропзоны */
  (e: 'update:modelValue', files: File[]): void;
  /** Обновление инпута (присвоение ему нового значения FileList) */
  (e: 'update:input', files: FileList): void;
  /** Загрузка файла (возвращает загруженный файл) */
  (e: 'file:upload', file: File): void;
  /** Удаление файла (возвращает удаленный файл) */
  (e: 'file:remove', file: File): void;
  /** Дроп файла в дропзону */
  (e: 'drop', event: DragEvent): void;
}>();

const inputFile = ref<HTMLInputElement | null>(null);
const dragHover = ref<boolean>(false);

const iconsConfig = useConfigParam('icons') as IconsConfig;
const filePlusIcon: IconsNamesType = iconsConfig.systemIcons.controls.filePlus;

const disabled = computed<boolean>(() => {
  return props.disabled || model.value?.length >= props.maxFiles || !props.maxFileSize;
});

let acceptedTypesArr: string[];

if (props.acceptedTypes.length) {
  acceptedTypesArr = props.acceptedTypes.toLowerCase().replace(/.jpeg|.jpg/, '.jpg, .jpeg,').split(',').map((type) => type.trim());
}

function getUniqueFilesArr(existFiles: File[], newFiles: File[]): File[] {
  return newFiles.filter((newFile) => (
    !existFiles.some((existFile) => (
      existFile.name === newFile.name
      && existFile.size === newFile.size
      && existFile.lastModified === newFile.lastModified
    ))
  ));
}

function checkFileType(file: File): boolean {
  if (!file.name) {
    return false;
  }

  if (!acceptedTypesArr) {
    return true;
  }

  const fileExtension: string | undefined = file.name.split('.').pop()?.toLowerCase();

  if (fileExtension) {
    return acceptedTypesArr.includes(`.${fileExtension}`);
  }

  return false;
}

function checkFileSize(file: File): boolean {
  if (!file.size) {
    return false;
  }

  if (!props.maxFileSize) {
    return true;
  }

  return file.size <= props.maxFileSize;
}

function updateInputValue(files: File[]) {
  if (inputFile.value) {
    const dataTransfer = new DataTransfer();
    files.forEach((file: File) => dataTransfer.items.add(file));

    inputFile.value.files = dataTransfer.files;
    emit('update:input', dataTransfer.files);
  }
}

const model = computed<File[]>({
  get: () => {
    return props.modelValue;
  },
  set: (newFiles: File[]) => {
    if (!newFiles?.length || disabled.value || model.value?.length >= props.maxFiles) {
      return;
    }

    const uniqueFiles: File[] = getUniqueFilesArr(model.value, newFiles);

    if (!uniqueFiles.length) {
      return;
    }

    const iterations = Math.min((props.maxFiles - model.value.length), uniqueFiles.length);
    const filesArr: File[] = [...model.value];

    for (let i = 0; i < iterations; i += 1) {
      if (checkFileType(uniqueFiles[i]) && checkFileSize(uniqueFiles[i])) {
        filesArr.push(uniqueFiles[i]);
      }
    }

    emit('update:modelValue', filesArr);
    updateInputValue(filesArr);
  },
});

function removeFile(index: number) {
  const filesArr = [...model.value];
  const removedItems = filesArr.splice(index, 1);
  emit('update:modelValue', filesArr);
  emit('file:remove', removedItems[0]);
  updateInputValue(filesArr);
}

function changeHandler(event: Event) {
  const eventTarget = event.target as HTMLInputElement;
  if (eventTarget?.files) {
    model.value = Object.values(eventTarget?.files);
  }
}

function dropHandler(event: DragEvent) {
  if (event.dataTransfer?.files) {
    model.value = Object.values(event.dataTransfer?.files);
  }
  dragHover.value = false;
  emit('drop', event);
}

const getFilesQuantityText = () => {
  if (!props.maxFiles || props.maxFiles === Infinity) {
    return '';
  }
  return props.maxFiles === 1 ? 'Можно прикрепить не более 1 файла. ' : `Можно прикрепить не более ${props.maxFiles} файлов. `;
};

const bytesInMB = 1000000;

const getFileSizeText = () => {
  if (!props.maxFileSize || props.maxFileSize === Infinity) {
    return '';
  }
  return `Максимальный размер файла не более ${(props.maxFileSize / bytesInMB).toFixed(2)} МБ. `;
};

const classes = computed<ClassPropsType>(() => [
  'ui-dropzone',
  {
    'ui-dropzone--error': props.showError,
    'ui-dropzone--disabled': disabled.value,
    'ui-dropzone--hover': dragHover.value,
  },
]);

</script>

<style>
.ui-dropzone__wrapper {
  --dropzone-width: 100%;
  --dropzone-height: 140px;
  --dropzone-padding: var(--spacing-1-5);

  --dropzone-background-color: transparent;
  --dropzone-background-disabled-color: var(--color-neutral-100);
  --dropzone-background-hover-color: var(--color-primary-50);

  --dropzone-text-color-accent: var(--color-primary-500);
  --dropzone-text-color-first: var(--color-text-secondary);
  --dropzone-text-color-disabled: var(--color-text-light);
  --dropzone-text-color-second: var(--color-primary-500);
  --dropzone-text-color-third: var(--color-text-placeholder);

  --dropzone-border-radius: var(--radius-lg);
  --dropzone-border-error-color: var(--color-error-500);
  --dropzone-border-color: var(--color-neutral-300);
  --dropzone-border: 1px dashed var(--dropzone-border-color);

  --dropzone-message-font-size: var(--subtitle-xs-font-size);
  --dropzone-message-line-height: var(--subtitle-xs-line-height);
  --dropzone-message-letter-spacing: var(--subtitle-xs-letter-spacing);
  --dropzone-message-font-weight: var(--subtitle-xs-font-weight);

  --dropzone-info-font-size: var(--paragraph-xs-font-size);
  --dropzone-info-line-height: var(--paragraph-xs-line-height);
  --dropzone-info-letter-spacing: var(--paragraph-xs-letter-spacing);
  --dropzone-info-font-weight: var(--paragraph-xs-font-weight);

  --dropzone-gap: var(--spacing-1);
  --dropzone-wrapper-gap: var(--spacing-1-5);
  --dropzone-file-list-gap: var(--spacing-1);

  /** dropzone files */
  --dropzone-files-title-font-size: var(--paragraph-xs-font-size);

  width: var(--dropzone-width);
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: var(--dropzone-wrapper-gap);
}

.ui-dropzone {
  width: var(--dropzone-width);
  min-height: var(--dropzone-height);
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  align-items: center;
  row-gap: var(--dropzone-gap);
  border: var(--dropzone-border);
  background-color: var(--dropzone-background-color);
  border-radius: var(--dropzone-border-radius);
  transition: 0.2s ease all;
  padding: var(--dropzone-padding);
  color: var(--dropzone-text-color-first);
}

.ui-dropzone--hover,
.ui-dropzone:hover {
  background: var(--dropzone-background-hover-color);
  cursor: pointer;
}

.ui-dropzone--disabled,
.ui-dropzone--disabled.ui-dropzone--hover,
.ui-dropzone--disabled:hover {
  background: var(--dropzone-background-disabled-color);
  cursor: not-allowed;
}

.ui-dropzone--disabled .ui-dropzone__message-accent,
.ui-dropzone--disabled .ui-dropzone__message,
.ui-dropzone--disabled .ui-dropzone__info,
.ui-dropzone--disabled .ui-dropzone__icon {
  color: var(--dropzone-text-color-disabled);
}

.ui-dropzone--error {
  border-color: var(--dropzone-border-error-color);
}

.ui-dropzone__icon,
.ui-dropzone__message,
.ui-dropzone__info {
  pointer-events: none;
}

.ui-dropzone__message {
  cursor: pointer;
  font-size: var(--dropzone-message-font-size);
  font-weight: var(--dropzone-message-font-weight);
  line-height: var(--dropzone-message-line-height);
  letter-spacing: var(--dropzone-message-letter-spacing);
}

.ui-dropzone__message-accent {
  color: var(--dropzone-text-color-accent);
}

.ui-dropzone__info {
  font-size: var(--dropzone-info-font-size);
  font-weight: var(--dropzone-info-font-weight);
  line-height: var(--dropzone-info-line-height);
  letter-spacing: var(--dropzone-info-letter-spacing);
}

.ui-dropzone input {
  display: none;
}

/** files list */

.ui-dropzone__files-title {
  color: var(--dropzone-text-color-first);
  font-size: var(--dropzone-files-title-font-size);
}

.ui-dropzone__file-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--dropzone-file-list-gap, 8px);
}
</style>
