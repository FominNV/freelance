<template>
  <button
    :class="classes"
    type="button"
    :disabled="disabled || loading"
    :style="{ color: color }"
    v-on="$attrs"
  >
    <span
      class="ui-button__loader"
      v-if="loading && (!leftIcon && !rightIcon)"
    >
      <ui-spinner
        class="ui-button__spinner"
        :size="size == 'sm' ? 'xs' : 'sm'"
        :type="spinnerType"
      />
    </span>
    <!-- @slot контейнер перед текстом, на случай если понадобиться пробросить в кнопку другой компонент иконки -->
    <slot name="left-container">
      <ui-button-icon-adapter
        v-if="leftIcon && (!loading || rightIcon)"
        class="ui-button__icon ui-button__icon--left"
        :name="leftIcon"
      />
    </slot>
    <ui-spinner
      v-if="(leftIcon || $slots.leftContainer) && !rightIcon && loading"
      class="ui-button__spinner"
      :size="size == 'sm' ? 'xs' : 'sm'"
      :type="spinnerType"
    />
    <span
      class="ui-button__text"
      v-if="isShapeNormal && text"
    >
      {{ props.text }}
    </span>
    <!-- @slot контейнер после текста, на случай если понадобиться пробросить в кнопку другой компонент иконки -->
    <slot name="right-container">
      <ui-button-icon-adapter
        v-if="rightIcon && !loading"
        class="ui-button__icon ui-button__icon--right"
        :name="rightIcon"
      />
    </slot>
    <ui-spinner
      v-if="(rightIcon || $slots.rightContainer) && loading"
      class="ui-button__spinner"
      :size="size == 'sm' ? 'xs' : 'sm'"
      :type="spinnerType"
    />
    <ui-button-badge-adapter
      v-if="badge"
      class="ui-button__badge"
      :text="badge"
      :theme="badgeOptions?.theme"
      :type="badgeOptions?.type"
    />
  </button>
</template>

<script setup lang="ts">
import { computed, ComputedRef, useSlots } from 'vue';
import { ButtonConfig } from '../../@types/button-config';
import { ClassPropsType } from '../../@types/props';
import { PropsSizeType } from '../../@types/size';
import { useConfigParam } from '../../lib/useConfigParam';
import {
  ButtonThemesType,
  ButtonShapesType,
  ButtonSizesType,
} from './const';
import UiButtonIconAdapter from './ui-button-icon-adapter.vue';
import UiButtonBadgeAdapter, { ButtonBadgePropsImpl } from './ui-button-badge-adapter.vue';
import { SpinnerTypesType } from '../ui-spinner/const';

export interface UiButtonPropsImpl {
  /** иконка перед текстом */
  leftIcon?: IconsNamesType;
  /** иконка после текста */
  rightIcon?: IconsNamesType;
  /** текст кнопки, отображается только при shape = 'normal' */
  text?: string;
  /** тема */
  theme?: ButtonThemesType;
  /** отображение загрузчика */
  loading?: boolean;
  /** активность кнопки */
  disabled?: boolean;
  /** размер кнопки */
  size?: PropsSizeType<ButtonSizesType>;
  /** форма кнопки */
  shape?: ButtonShapesType;
  /** наличие внутренних отступов по бокам */
  innerPaddings?: boolean;
  /** растянуть кнопку на всю ширину контентной области */
  block?: boolean;
  /** указатель "палец" */
  pointer?: boolean;
  /** содержимое бейджа */
  badge?: string | number;
  /** параметры бейджа */
  badgeOptions?: ButtonBadgePropsImpl;
  /** кастомный цвет текста, например для кнопки theme = 'toolbar' нужно перекрасить иконку */
  color?: string;
  /** тип спиннера (индикатора загрузки) */
  spinnerType?: SpinnerTypesType;
  /** показать стиль active */
  active?: boolean;
}

const props = withDefaults(defineProps<UiButtonPropsImpl>(), {
  shape: 'normal',
  size: 'md',
  pointer: true,
  get spinnerType() {
    return (useConfigParam('button') as ButtonConfig).spinnerType;
  },
  get theme() {
    return (useConfigParam('button') as ButtonConfig).defaultTheme;
  },
  get innerPaddings() {
    return (useConfigParam('button') as ButtonConfig).innerPaddings;
  },
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const isShapeNormal = computed(() => props.shape === 'normal');
const slots = useSlots();

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-button',
  {
    [`ui-button--theme-${props.theme}`]: props.theme,
    [`ui-button--size-${props.size}`]: props.size,
    [`ui-button--shape-${props.shape}`]: props.shape !== 'normal',
    'ui-button--with-paddings': props.innerPaddings,
    'ui-button--full-width': props.block,
    'ui-button--state-loading': props.loading,
    'ui-button--pointer': props.pointer,
    'ui-button--active': props.active,
    'ui-button--shaped': !isShapeNormal.value,
    'ui-button--with-icon': props.leftIcon || props.rightIcon || slots['left-container'] || slots['right-container'],
  },
]);

</script>
<style>
.ui-button {
  --button-font-family: var(--primary-font-family);
  --button-transition: background-color .4s ease, color .4s ease, outline-color .4s ease, border-color .4s ease;
  --button-focus-outline-width: 4px;
  --button-focus-outline-offset: 0;
  --button-loader-size: 18px;
  --button-icon-spacing: 10px;

  --button-badge-position-top: -9px;
  --button-badge-position-right: -11px;

  --button-lg-height: var(--control-height-lg);
  --button-lg-paddings: var(--spacing-4);
  --button-lg-with-icon-paddings: var(--spacing-3);
  --button-lg-font-size: var(--action-md-font-size);
  --button-lg-font-weight: var(--action-md-font-weight);
  --button-lg-line-height: var(--action-md-line-height);
  --button-lg-letter-spacing: var(--action-md-letter-spacing);
  --button-lg-icon-size: 20px;

  --button-md-height: var(--control-height-md);
  --button-md-paddings: var(--spacing-2-5);
  --button-md-with-icon-paddings: var(--spacing-2-5);
  --button-md-font-size: var(--action-md-font-size);
  --button-md-font-weight: var(--action-md-font-weight);
  --button-md-line-height: var(--action-md-line-height);
  --button-md-letter-spacing: var(--action-md-letter-spacing);
  --button-md-icon-size: 20px;

  --button-sm-height: var(--control-height-sm);
  --button-sm-paddings: var(--spacing-2);
  --button-sm-with-icon-paddings: var(--spacing-1-5);
  --button-sm-font-size: var(--action-sm-font-size);
  --button-sm-font-weight: var(--action-sm-font-weight);
  --button-sm-line-height: var(--action-sm-line-height);
  --button-sm-letter-spacing: var(--action-sm-letter-spacing);
  --button-sm-icon-size: 16px;

  /** Default Theme */
  --button-default-background-color: var(--color-neutral-200);
  --button-default-hover-background-color: var(--color-neutral-100);
  --button-default-active-background-color: var(--color-neutral-300);
  --button-default-color: var(--color-text-primary);
  --button-default-hover-color: var(--color-text-primary);
  --button-default-active-color: var(--color-text-primary);
  --button-default-focus-border-color: var(--color-primary-300);
  --button-default-disabled-background-color: var(--color-neutral-200);
  --button-default-disabled-color: var(--color-text-light);
  --button-default-border-radius: var(--radius-sm);

  /** Primary Theme */
  --button-primary-background-color: var(--color-primary-500);
  --button-primary-hover-background-color: var(--color-primary-300);
  --button-primary-active-background-color: var(--color-primary-600);
  --button-primary-outlined-active-background-color: var(--color-primary-100);
  --button-primary-color: var(--color-text-inversion);
  --button-primary-hover-color: var(--color-text-inversion);
  --button-primary-active-color: var(--color-text-inversion);
  --button-primary-focus-border-color: var(--color-primary-300);
  --button-primary-disabled-background-color: var(--color-neutral-200);
  --button-primary-disabled-color: var(--color-text-light);
  --button-primary-border-radius: var(--radius-sm);

  /** Ghost Theme */
  --button-ghost-background-color: transparent;
  --button-ghost-hover-background-color: var(--color-neutral-100);
  --button-ghost-active-background-color: var(--color-neutral-300);
  --button-ghost-color: var(--color-text-primary);
  --button-ghost-hover-color: var(--color-text-primary);
  --button-ghost-active-color: var(--color-text-primary);
  --button-ghost-focus-border-color: var(--color-primary-300);
  --button-ghost-disabled-background-color: transparent;
  --button-ghost-disabled-color: var(--color-text-light);
  --button-ghost-border-radius: var(--radius-sm);

  /** Toolbar Theme */
  --button-toolbar-background-color: var(--color-neutral-100);
  --button-toolbar-hover-background-color: var(--color-neutral-200);
  --button-toolbar-active-background-color: var(--color-neutral-300);
  --button-toolbar-color: var(--color-primary-500);
  --button-toolbar-hover-color: var(--color-primary-500);
  --button-toolbar-active-color: var(--color-primary-500);
  --button-toolbar-focus-border-color: var(--color-primary-300);
  --button-toolbar-disabled-background-color: var(--color-neutral-100);
  --button-toolbar-disabled-color: var(--color-text-light);
  --button-toolbar-border-radius: var(--radius-xxl);

  /** Success Theme */
  --button-success-background-color: var(--color-success-500);
  --button-success-hover-background-color: var(--color-success-300);
  --button-success-active-background-color: var(--color-success-600);
  --button-success-color: var(--color-text-inversion);
  --button-success-hover-color: var(--color-text-inversion);
  --button-success-active-color: var(--color-text-inversion);
  --button-success-focus-border-color: var(--color-success-100);
  --button-success-disabled-background-color: var(--color-neutral-200);
  --button-success-disabled-color: var(--color-text-light);
  --button-success-border-radius: var(--radius-sm);

  /** Warning Theme */
  --button-warning-background-color: var(--color-warning-500);
  --button-warning-hover-background-color: var(--color-warning-300);
  --button-warning-active-background-color: var(--color-warning-600);
  --button-warning-color: var(--color-text-inversion);
  --button-warning-hover-color: var(--color-text-inversion);
  --button-warning-active-color: var(--color-text-inversion);
  --button-warning-focus-border-color: var(--color-warning-100);
  --button-warning-disabled-background-color: var(--color-neutral-200);
  --button-warning-disabled-color: var(--color-text-light);
  --button-warning-border-radius: var(--radius-sm);

  /** Error Theme */
  --button-error-background-color: var(--color-error-500);
  --button-error-hover-background-color: var(--color-error-300);
  --button-error-active-background-color: var(--color-error-600);
  --button-error-color: var(--color-text-inversion);
  --button-error-hover-color: var(--color-text-inversion);
  --button-error-active-color: var(--color-text-inversion);
  --button-error-focus-border-color: var(--color-error-100);
  --button-error-disabled-background-color: var(--color-neutral-200);
  --button-error-disabled-color: var(--color-text-light);
  --button-error-border-radius: var(--radius-sm);

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--button-font-family);
  gap: var(--button-icon-spacing);
  transition: var(--button-transition);
  outline: var(--button-focus-outline-width) solid transparent;
  outline-offset: var(--button-focus-outline-offset);
  padding: 0;
  border: none;
}

.ui-button--pointer {
  cursor: pointer;
}

.ui-button[disabled] {
  cursor: default;
}

.ui-button--full-width {
  width: 100%;
}

.ui-button__loader {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ui-button__spinner {
  display: block;
}

.ui-button--state-loading .ui-button__loader+.ui-button__text,
.ui-button--state-loading .ui-button__loader+.ui-button__icon {
  visibility: hidden;
}

.ui-button__badge {
  position: absolute;
  top: var(--button-badge-position-top);
  right: var(--button-badge-position-right);
}

.ui-button--shape-circle,
.ui-button--shape-circle:is([class*="--theme"]) {
  border-radius: 50%;
}

.ui-button--shape-square,
.ui-button--shape-square:is([class*="--theme"]) {
  border-radius: var(--button-default-border-radius);
}

.ui-button--shape-circle:is(.ui-button--size-lg),
.ui-button--shape-square:is(.ui-button--size-lg) {
  width: var(--button-lg-height);
}

.ui-button--shape-circle:is(.ui-button--size-md),
.ui-button--shape-square:is(.ui-button--size-md) {
  width: var(--button-md-height);
}

.ui-button--shape-circle:is(.ui-button--size-sm),
.ui-button--shape-square:is(.ui-button--size-sm) {
  width: var(--button-sm-height);
}

.ui-button--shape-circle:is(.ui-button--size-sm),
.ui-button--shape-square:is(.ui-button--size-sm) {
  width: var(--button-sm-height);
}

.ui-button--size-lg {
  height: var(--button-lg-height);
  font-size: var(--button-lg-font-size);
  font-weight: var(--button-lg-font-weight);
  letter-spacing: var(--button-lg-letter-spacing);
  line-height: var(--button-lg-line-height);
}

.ui-button--size-md {
  height: var(--button-md-height);
  font-size: var(--button-md-font-size);
  font-weight: var(--button-md-font-weight);
  letter-spacing: var(--button-md-letter-spacing);
  line-height: var(--button-md-line-height);
}

.ui-button--size-sm {
  height: var(--button-sm-height);
  font-size: var(--button-sm-font-size);
  font-weight: var(--button-sm-font-weight);
  letter-spacing: var(--button-sm-letter-spacing);
  line-height: var(--button-sm-line-height);
}

.ui-button--with-paddings:not(.ui-button--shaped) {
  --button-padding-left: 0;
  --button-padding-right: 0;
  padding-left: var(--button-padding-left);
  padding-right: var(--button-padding-right);
}

.ui-button--with-paddings:is(.ui-button--size-lg):not(.ui-button--shaped) {
  --button-padding-left: var(--button-lg-paddings);
  --button-padding-right: var(--button-lg-paddings);
}

.ui-button--with-paddings:is(.ui-button--size-md):not(.ui-button--shaped) {
  --button-padding-left: var(--button-md-paddings);
  --button-padding-right: var(--button-md-paddings);
}

.ui-button--with-paddings:is(.ui-button--size-sm):not(.ui-button--shaped) {
  --button-padding-left: var(--button-sm-paddings);
  --button-padding-right: var(--button-sm-paddings);
}

.ui-button--with-paddings:is(.ui-button--size-sm):is(.ui-button--with-icon):not(.ui-button--shaped) {
  --button-padding-left: var(--button-sm-with-icon-paddings);
  --button-padding-right: var(--button-sm-with-icon-paddings);
}

.ui-button--with-paddings:is(.ui-button--size-md):is(.ui-button--with-icon):not(.ui-button--shaped) {
  --button-padding-left: var(--button-md-with-icon-paddings);
  --button-padding-right: var(--button-md-with-icon-paddings);
}

.ui-button--with-paddings:is(.ui-button--size-lg):is(.ui-button--with-icon):not(.ui-button--shaped) {
  --button-padding-left: var(--button-lg-with-icon-paddings);
  --button-padding-right: var(--button-lg-with-icon-paddings);
}

.ui-button--size-lg .ui-button__icon {
  height: var(--button-lg-icon-size);
  width: var(--button-lg-icon-size);
}

.ui-button--size-md .ui-button__icon {
  height: var(--button-md-icon-size);
  width: var(--button-md-icon-size);
}

.ui-button--size-sm .ui-button__icon {
  height: var(--button-sm-icon-size);
  width: var(--button-sm-icon-size);
}

/** Default Theme */
.ui-button--theme-default {
  border-radius: var(--button-default-border-radius);
  background-color: var(--button-default-background-color);
  color: var(--button-default-color);
}

.ui-button--theme-default .ui-spinner {
  --spinner-color: var(--button-default-color);
}

.ui-button--theme-default:not([disabled]):hover {
  background-color: var(--button-default-hover-background-color);
  color: var(--button-default-hover-color);
}

.ui-button--theme-default:not([disabled]):is(:active, .ui-button--active) {
  background-color: var(--button-default-active-background-color);
  color: var(--button-default-active-color);
}

.ui-button--theme-default:not([disabled]):focus-visible {
  outline: var(--button-focus-outline-width) solid var(--button-default-focus-border-color)
}

.ui-button--theme-default:not(.ui-button--state-loading)[disabled] {
  background-color: var(--button-default-disabled-background-color);
  color: var(--button-default-disabled-color) !important;
}

/** Primary Theme */
.ui-button--theme-primary {
  border-radius: var(--button-primary-border-radius);
  background-color: var(--button-primary-background-color);
  color: var(--button-primary-color);
}

.ui-button--theme-primary .ui-spinner {
  --spinner-color: var(--button-primary-color);
}

.ui-button--theme-primary:not([disabled]):hover {
  background-color: var(--button-primary-hover-background-color);
  color: var(--button-primary-hover-color);
}

.ui-button--theme-primary:not([disabled]):is(:active, .ui-button--active) {
  background-color: var(--button-primary-active-background-color);
  color: var(--button-primary-active-color);
}

.ui-button--theme-primary:not([disabled]):focus-visible {
  outline: var(--button-focus-outline-width) solid var(--button-primary-focus-border-color)
}

.ui-button--theme-primary:not(.ui-button--state-loading)[disabled] {
  background-color: var(--button-primary-disabled-background-color);
  color: var(--button-primary-disabled-color) !important;
}

/** Ghost Theme */
.ui-button--theme-ghost {
  border-radius: var(--button-ghost-border-radius);
  background-color: var(--button-ghost-background-color);
  color: var(--button-ghost-color);
}

.ui-button--theme-ghost .ui-button__badge {
  position: relative;
  top: auto;
  right: auto;
}

.ui-button--theme-ghost .ui-spinner {
  --spinner-color: var(--button-ghost-color);
}

.ui-button--theme-ghost:not([disabled]):hover {
  background-color: var(--button-ghost-hover-background-color);
  color: var(--button-ghost-hover-color);
}

.ui-button--theme-ghost:not([disabled]):is(:active, .ui-button--active) {
  background-color: var(--button-ghost-active-background-color);
  color: var(--button-ghost-active-color);
}

.ui-button--theme-ghost:not([disabled]):focus-visible {
  outline: var(--button-focus-outline-width) solid var(--button-ghost-focus-border-color)
}

.ui-button--theme-ghost:not(.ui-button--state-loading)[disabled] {
  background-color: var(--button-ghost-disabled-background-color);
  color: var(--button-ghost-disabled-color) !important;
}

/** Default Outlined Theme */
.ui-button--theme-default-outlined {
  border-radius: var(--button-default-border-radius);
  background-color: transparent;
  border: 1px solid var(--button-default-active-background-color);
  color: var(--button-default-color);
}

.ui-button--theme-default-outlined .ui-spinner {
  --spinner-color: var(--button-default-color);
}

.ui-button--theme-default-outlined:not([disabled]):hover {
  border-color: var(--button-default-hover-background-color);
  color: var(--button-default-hover-color);
}

.ui-button--theme-default-outlined:not([disabled]):is(:active, .ui-button--active){
  border-color: var(--button-default-active-background-color);
  color: var(--button-default-active-color);
}

.ui-button--theme-default-outlined:not([disabled]):focus-visible {
  outline: var(--button-focus-outline-width) solid var(--button-default-focus-border-color)
}

.ui-button--theme-default-outlined:not(.ui-button--state-loading)[disabled] {
  border-color: var(--button-default-disabled-background-color);
  color: var(--button-default-disabled-color);
}

/** Primary Outlined Theme */
.ui-button--theme-primary-outlined {
  border-radius: var(--button-primary-border-radius);
  background-color: transparent;
  border: 1px solid var(--button-primary-background-color);
  color: var(--button-primary-background-color);
}

.ui-button--theme-primary-outlined .ui-spinner {
  --spinner-color: var(--button-primary-active-background-color);
}

.ui-button--theme-primary-outlined:not([disabled]):hover {
  background-color: var(--button-primary-hover-background-color);
  border-color: var(--button-primary-hover-background-color);
  color: var(--button-primary-hover-color);
}

.ui-button--theme-primary-outlined:not([disabled]):is(:active, .ui-button--active) {
  background-color: var(--button-primary-outlined-active-background-color);
  border-color: var(--button-primary-active-background-color);
  color: var(--button-primary-active-background-color);
}

.ui-button--theme-primary-outlined:not([disabled]):focus-visible {
  outline: var(--button-focus-outline-width) solid var(--button-primary-focus-border-color)
}

.ui-button--theme-primary-outlined:not(.ui-button--state-loading)[disabled] {
  border-color: var(--button-default-disabled-background-color);
  color: var(--button-default-disabled-background-color);
}

/** Toolbar Theme */
.ui-button--theme-toolbar {
  border-radius: var(--button-toolbar-border-radius);
  background-color: var(--button-toolbar-background-color);
  color: var(--button-toolbar-color);
}

.ui-button--theme-toolbar .ui-spinner {
  --spinner-color: var(--button-toolbar-color);
}

.ui-button--theme-toolbar:not([disabled]):hover {
  background-color: var(--button-toolbar-hover-background-color);
  color: var(--button-toolbar-hover-color);
}

.ui-button--theme-toolbar:not([disabled]):is(:active, .ui-button--active) {
  background-color: var(--button-toolbar-active-background-color);
  color: var(--button-toolbar-active-color);
}

.ui-button--theme-toolbar:not([disabled]):focus-visible {
  outline: var(--button-focus-outline-width) solid var(--button-toolbar-focus-border-color)
}

.ui-button--theme-toolbar:not(.ui-button--state-loading)[disabled] {
  background-color: var(--button-toolbar-disabled-background-color);
  color: var(--button-toolbar-disabled-color) !important;
}

/** Success Theme */
.ui-button--theme-success {
  border-radius: var(--button-success-border-radius);
  background-color: var(--button-success-background-color);
  color: var(--button-success-color);
}

.ui-button--theme-success .ui-spinner {
  --spinner-color: var(--button-success-color);
}

.ui-button--theme-success:not([disabled]):hover {
  background-color: var(--button-success-hover-background-color);
  color: var(--button-success-hover-color);
}

.ui-button--theme-success:not([disabled]):is(:active, .ui-button--active) {
  background-color: var(--button-success-active-background-color);
  color: var(--button-success-active-color);
}

.ui-button--theme-success:not([disabled]):focus-visible {
  outline: var(--button-focus-outline-width) solid var(--button-success-focus-border-color)
}

.ui-button--theme-success:not(.ui-button--state-loading)[disabled] {
  background-color: var(--button-success-disabled-background-color);
  color: var(--button-success-disabled-color) !important;
}

/** Success Outlined Theme */
.ui-button--theme-success-outlined {
  border-radius: var(--button-success-border-radius);
  background-color: transparent;
  border: 1px solid var(--button-success-background-color);
  color: var(--button-success-background-color);
}

.ui-button--theme-success-outlined .ui-spinner {
  --spinner-color: var(--button-success-active-background-color);
}

.ui-button--theme-success-outlined:not([disabled]):hover {
  background-color: var(--button-success-hover-background-color);
  border-color: var(--button-success-hover-background-color);
  color: var(--button-success-hover-color);
}

.ui-button--theme-success-outlined:not([disabled]):is(:active, .ui-button--active) {
  background-color: transparent;
  border-color: var(--button-success-active-background-color);
  color: var(--button-success-active-background-color);
}

.ui-button--theme-success-outlined:not([disabled]):focus-visible {
  outline: var(--button-focus-outline-width) solid var(--button-success-focus-border-color)
}

.ui-button--theme-success-outlined:not(.ui-button--state-loading)[disabled] {
  border-color: var(--button-default-disabled-background-color);
  color: var(--button-default-disabled-background-color);
}

/** Warning Theme */
.ui-button--theme-warning {
  border-radius: var(--button-warning-border-radius);
  background-color: var(--button-warning-background-color);
  color: var(--button-warning-color);
}

.ui-button--theme-warning .ui-spinner {
  --spinner-color: var(--button-warning-color);
}

.ui-button--theme-warning:not([disabled]):hover {
  background-color: var(--button-warning-hover-background-color);
  color: var(--button-warning-hover-color);
}

.ui-button--theme-warning:not([disabled]):is(:active, .ui-button--active) {
  background-color: var(--button-warning-active-background-color);
  color: var(--button-warning-active-color);
}

.ui-button--theme-warning:not([disabled]):focus-visible {
  outline: var(--button-focus-outline-width) solid var(--button-warning-focus-border-color)
}

.ui-button--theme-warning:not(.ui-button--state-loading)[disabled] {
  background-color: var(--button-warning-disabled-background-color);
  color: var(--button-warning-disabled-color) !important;
}

/** Warning Outlined Theme */
.ui-button--theme-warning-outlined {
  border-radius: var(--button-warning-border-radius);
  background-color: transparent;
  border: 1px solid var(--button-warning-background-color);
  color: var(--button-warning-background-color);
}

.ui-button--theme-warning-outlined .ui-spinner {
  --spinner-color: var(--button-warning-active-background-color);
}

.ui-button--theme-warning-outlined:not([disabled]):hover {
  background-color: var(--button-warning-hover-background-color);
  border-color: var(--button-warning-hover-background-color);
  color: var(--button-warning-hover-color);
}

.ui-button--theme-warning-outlined:not([disabled]):active {
  background-color: transparent;
  border-color: var(--button-warning-active-background-color);
  color: var(--button-warning-active-background-color);
}

.ui-button--theme-warning-outlined:not([disabled]):focus-visible {
  outline: var(--button-focus-outline-width) solid var(--button-warning-focus-border-color)
}

.ui-button--theme-warning-outlined:not(.ui-button--state-loading)[disabled] {
  border-color: var(--button-default-disabled-background-color);
  color: var(--button-default-disabled-background-color);
}

/** Error Theme */
.ui-button--theme-error {
  border-radius: var(--button-error-border-radius);
  background-color: var(--button-error-background-color);
  color: var(--button-error-color);
}

.ui-button--theme-error .ui-spinner {
  --spinner-color: var(--button-error-color);
}

.ui-button--theme-error:not([disabled]):hover {
  background-color: var(--button-error-hover-background-color);
  color: var(--button-error-hover-color);
}

.ui-button--theme-error:not([disabled]):active {
  background-color: var(--button-error-active-background-color);
  color: var(--button-error-active-color);
}

.ui-button--theme-error:not([disabled]):focus-visible {
  outline: var(--button-focus-outline-width) solid var(--button-error-focus-border-color)
}

.ui-button--theme-error:not(.ui-button--state-loading)[disabled] {
  background-color: var(--button-error-disabled-background-color);
  color: var(--button-error-disabled-color) !important;
}

/** Error Outlined Theme */
.ui-button--theme-error-outlined {
  border-radius: var(--button-error-border-radius);
  background-color: transparent;
  border: 1px solid var(--button-error-background-color);
  color: var(--button-error-background-color);
}

.ui-button--theme-error-outlined .ui-spinner {
  --spinner-color: var(--button-error-active-background-color);
}

.ui-button--theme-error-outlined:not([disabled]):hover {
  background-color: var(--button-error-hover-background-color);
  border-color: var(--button-error-hover-background-color);
  color: var(--button-error-hover-color);
}

.ui-button--theme-error-outlined:not([disabled]):active {
  background-color: transparent;
  border-color: var(--button-error-active-background-color);
  color: var(--button-error-active-background-color);
}

.ui-button--theme-error-outlined:not([disabled]):focus-visible {
  outline: var(--button-focus-outline-width) solid var(--button-error-focus-border-color)
}

.ui-button--theme-error-outlined:not(.ui-button--state-loading)[disabled] {
  border-color: var(--button-default-disabled-background-color);
  color: var(--button-default-disabled-background-color);
}
</style>
