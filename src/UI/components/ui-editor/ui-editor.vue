<template>
  <vue-editor
    v-model="content"
    :class="classes"
    :disabled="disabled"
    :placeholder="placeholder"
    :customModules="preparedCustomModules"
    :editorToolbar="editorToolbar"
    :editorOptions="preparedEditorSettings"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @text-change="emit('text-change', $event)"
    @selection-change="emit('selection-change', $event)"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VueEditor } from 'vue2-editor';
import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';
import { ClassPropsType } from '../../@types/props';
import { updateToolbarIcons } from './lib';
import {
  UiEditorRangeImpl,
  UiEditorCustomModulesImpl,
  UiEditorSettings,
} from './interface';
import {
  DefaultEditorSettings,
  DefaultToolbar,
} from './const';

export interface UiEditorPropsImpl {
  /** отключить редактор */
  disabled?: boolean;
  /** текст-заполнитель для редактора */
  placeholder?: string;
  /** данные введенные пользователем */
  modelValue?: string;
  /** элементы тублара редактора */
  editorToolbar?: Array<string | object>;
  /** параметры редактора */
  editorSettings?: UiEditorSettings;
  /** модули редактора */
  customModules?: Array<UiEditorCustomModulesImpl>;
}

updateToolbarIcons();

const props = withDefaults(defineProps<UiEditorPropsImpl>(), {
  customModules: () => [],
  editorToolbar: () => DefaultToolbar,
  editorSettings: () => ({}),
});

const emit = defineEmits<{
  /** событие обновления модели */
  (e: 'update:modelValue', event: string): void;
  /** событие установки фокуса */
  (e: 'focus', event: FocusEvent): void;
  /** событие потери фокуса */
  (e: 'blur', event: FocusEvent): void;
  /** событие смены выделения текста */
  (e: 'selection-change', event: (range: UiEditorRangeImpl, oldRange: UiEditorRangeImpl, source: string) => void): void;
  /** событие изменения текста */
  (e: 'text-change', event: (delta: any, olcContent: any, source: string) => void): void;
}>();

const preparedCustomModules = computed(() => props.customModules.concat([
  { alias: 'imageActions', module: ImageActions },
  { alias: 'imageFormats', module: ImageFormats },
]));

const preparedEditorSettings = computed(() => Object.assign(props.editorSettings || {}, DefaultEditorSettings));

const content = computed({
  get: () => props.modelValue || '',
  set: (val: string) => {
    emit('update:modelValue', val);
  },
});

const classes = computed<ClassPropsType>(() => [
  'ui-editor',
  {
    'ui-editor--state-disabled': props.disabled,
  },
]);

</script>
<style>
.ui-editor {
  --editor-text-color: var(--color-text-primary);
  --editor-text-color-hover: var(--color-primary-500);
  --editor-text-color-disabled: var(--color-text-secondary);
  --editor-toolbar-background-color: var(--color-neutral-0);
  --editor-toolbar-group-spacing: var(--spacing-1-5);
  --editor-scroll-track-background: var(--scrollbar-track-bg-color);
  --editor-scroll-thumb-background: var(--scrollbar-thumb-bg-color);
  --editor-scroll-thumb-hover-background: var(--scrollbar-thumb-hover-bg-color);
  --editor-scroll-size: var(--scrollbar-lg-size);

  position: relative;
  font-family: var(--primary-font-family);
  color: var(--editor-text-color);
}

/** Scrollbar styles */
.ui-editor .ql-container.ql-snow .ql-editor::-webkit-scrollbar {
  width: var(--editor-scroll-size);
}

.ui-editor .ql-container.ql-snow .ql-editor::-webkit-scrollbar:horizontal {
  height: var(--editor-scroll-size);
  width: auto;
}

.ui-editor .ql-container.ql-snow .ql-editor::-webkit-scrollbar-corner {
  display: none;
}

.ui-editor .ql-container.ql-snow .ql-editor::-webkit-scrollbar-track {
  background-color: var(--editor-scroll-track-background);
  border-radius: var(--editor-scroll-size);
}

.ui-editor .ql-container.ql-snow .ql-editor::-webkit-scrollbar-thumb {
  background-color: var(--editor-scroll-thumb-background);
  transition: background 0.2s;
  border-radius: var(--editor-scroll-size);
}

.ui-editor .ql-container.ql-snow .ql-editor::-webkit-scrollbar-thumb:hover {
  background-color: var(--editor-scroll-thumb-hover-background);
  cursor: pointer;
}

.ui-editor--state-disabled .ql-snow.ql-toolbar button,
.ui-editor--state-disabled .ql-snow.ql-toolbar .ql-picker-item,
.ui-editor .ql-snow.ql-toolbar .ql-picker-label {
  color: var(--editor-text-color-disabled) !important;
  pointer-events: none !important;
}

.ui-editor--state-disabled .ql-snow .ql-fill {
  fill: var(--editor-text-color-disabled) !important;
}

.ui-editor--state-disabled .ql-snow .ql-stroke {
  stroke: var(--editor-text-color-disabled) !important;
}

.ui-editor .ql-toolbar.ql-snow,
.ui-editor .ql-container.ql-snow {
  border: none;
}

.ui-editor .ql-toolbar.ql-snow {
  background-color: var(--editor-toolbar-background-color);
}

.ui-editor.quillWrapper .ql-snow.ql-toolbar .ql-formats {
  margin-bottom: 8px;
}

.ui-editor .ql-toolbar.ql-snow .ql-formats {
  margin-right: 12px;
}

.ui-editor.quillWrapper .ql-snow.ql-toolbar button svg {
  width: 20px;
  height: 20px;
}

.ui-editor .ql-toolbar.ql-snow .ql-picker-label {
  border: none;
}

.ui-editor .ql-snow .ql-picker-options {
  border-radius: 4px;
}

.ui-editor .ql-toolbar.ql-snow .ql-picker-options {
  box-shadow: var(--shadow-sm);
}

.ui-editor .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
  border-color: #DCDEE5;
}

.ui-editor .ql-toolbar.ql-snow {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.ui-editor .ql-snow .ql-toolbar .ql-picker-item.ql-selected,
.ui-editor .ql-snow .ql-toolbar .ql-picker-item:hover,
.ui-editor .ql-snow .ql-toolbar .ql-picker-label.ql-active,
.ui-editor .ql-snow .ql-toolbar .ql-picker-label:hover,
.ui-editor .ql-snow .ql-toolbar button.ql-active,
.ui-editor .ql-snow .ql-toolbar button:focus,
.ui-editor .ql-snow .ql-toolbar button:hover,
.ui-editor .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
.ui-editor .ql-snow.ql-toolbar .ql-picker-item:hover,
.ui-editor .ql-snow.ql-toolbar .ql-picker-label.ql-active,
.ui-editor .ql-snow.ql-toolbar .ql-picker-label:hover,
.ui-editor .ql-snow.ql-toolbar button.ql-active,
.ui-editor .ql-snow.ql-toolbar button:focus,
.ui-editor .ql-snow.ql-toolbar button:hover {
  color: var(--editor-text-color-hover);
}

.ui-editor .ql-snow.ql-toolbar button.ql-active .ql-fill,
.ui-editor .ql-snow.ql-toolbar button:hover .ql-fill,
.ui-editor .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill {
  fill: var(--editor-text-color-hover);
}

.ui-editor sup {
  vertical-align: super;
  font-size: smaller;
}

.ui-editor sub {
  vertical-align: sub;
  font-size: smaller;
}

.ui-editor strong {
  font-weight: bold;
}

.ui-editor em {
  font-style: italic;
}

.ui-editor .ql-editor p {
  font-size: var(--paragraph-md-font-size);
  line-height: var(--paragraph-md-line-height);
  font-weight: var(--paragraph-md-font-weight);
  letter-spacing: var(--paragraph-md-letter-spacing);
}

.ui-editor .ql-editor h1 {
  font-size: var(--title-sm-font-size);
  line-height: var(--title-sm-line-height);
  font-weight: var(--title-sm-font-weight);
  letter-spacing: var(--title-sm-letter-spacing);
}

.ui-editor .ql-editor h2 {
  font-size: var(--subtitle-lg-font-size);
  line-height: var(--subtitle-lg-line-height);
  font-weight: var(--subtitle-lg-font-weight);
  letter-spacing: var(--subtitle-lg-letter-spacing);
}
</style>
