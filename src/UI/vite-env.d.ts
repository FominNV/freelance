/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare const TextColorNames = {
  primary: 'primary',
  secondary: 'secondary',
  'gray-100': 'gray-100',
  'gray-150': 'gray-150',
  'gray-200': 'gray-200',
  'gray-300': 'gray-300',
  'gray-400': 'gray-400',
  placeholder: 'placeholder',
  inversion: 'inversion',
  accent: 'accent',
  'accent-100': 'accent-100',
  'error-dark': 'error-dark',
  'error-light': 'error-light',
  'success-dark': 'success-dark',
  'success-light': 'success-light',
  'warning-dark': 'warning-dark',
  'warning-light': 'warning-light',
  'info-dark': 'info-dark',
  'info-light': 'info-light',
};

declare type IconsNamesType = string;

declare module 'vue-easytable';
declare module 'vue-click-outside';
declare module 'vue-input-autowidth';
declare module 'vue2-datepicker';
declare module 'vue2-editor';
declare module '@xeger/quill-image-actions';
declare module '@xeger/quill-image-formats';
declare module 'v-mask';
