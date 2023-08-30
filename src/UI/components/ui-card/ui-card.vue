<template>
  <section :class="classes">
    <div class="ui-card__inner">
      <header
        class="ui-card__header"
        v-if="!isEmptyHeader"
      >
        <!-- @slot Шапка карточки -->
        <slot name="header">
          <div class="ui-card__heading">
            <!-- @slot Вместо заголовка карточки -->
            <slot name="heading">
              <div class="ui-card__title">
                <!-- @slot Текст заголовка -->
                <slot name="title-slot">
                  <h3>{{ title }}</h3>
                </slot>
              </div>
              <div class="ui-card__text">
                <!-- @slot Текст под заголовком -->
                <slot name="text-slot">
                  {{ text }}
                </slot>
              </div>
            </slot>
          </div>
          <div
            class="ui-card__toolbar"
            v-if="$slots.toolbar"
          >
            <!-- @slot Группы и элементы тулбара -->
            <slot name="toolbar" />
          </div>
        </slot>
      </header>
      <transition name="fade">
        <div
          class="ui-card__content"
          v-if="slots.default"
        >
          <!-- @slot Контент карточки -->
          <slot />
        </div>
      </transition>
      <footer
        class="ui-card__footer"
        v-if="$slots.footer"
      >
        <!-- @slot Подвал карточки -->
        <slot name="footer" />
      </footer>
    </div>
    <div
      class="ui-card__caption"
      v-if="showError && errorText"
    >
      <ui-icon
        name="system/attention-circle"
        v-if="showError"
      />
      {{ errorText }}
    </div>
  </section>
</template>

<script setup lang="ts">
import { ComputedRef, computed, useSlots } from 'vue';
import { ClassPropsType } from '../../@types/props';
import { PropsSizeType } from '../../@types/size';
import { CardSizesType, CardThemesType } from './const';

export interface UiCardPropsImpl {
  /** заголовок карточки  */
  title?: string;
  /** текст под заголовком */
  text?: string;
  /** указатель "палец" */
  pointer?: boolean;
  /** тема карточки */
  theme?: CardThemesType;
  /** отбросить тень */
  useShadow?: boolean;
  /** добавить отступ хедеру карточки */
  useHeaderOffset?: boolean;
  /** размер внутренних отступов */
  size?: PropsSizeType<CardSizesType>;
  /** Применить стиль ошибки */
  showError?: boolean;
  /** Текст ошибки для отображения под карточкой */
  errorText?: string;
  /** Вкл./Выкл. overflow-hidden для контента карточки */
  overflowContent?: boolean;
}

const slots = useSlots();

const props = withDefaults(defineProps<UiCardPropsImpl>(), {
  theme: 'default',
  size: 'md',
  useHeaderOffset: true,
  showError: false,
  overflowContent: false,
});

const isEmptyHeader = !props.title && !props.text && !slots['title-slot'] && !slots['text-slot'] && !slots.header && !slots.heading;

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-card',
  {
    [`ui-card--theme-${props.theme}`]: props.theme,
    [`ui-card--size-${props.size}`]: props.size,
    'ui-card--pointer': props.pointer,
    'ui-card--error': props.showError,
    'ui-card--empty-header': isEmptyHeader,
    'ui-card--use-shadow': props.useShadow,
    'ui-card--overflow-hidden': props.overflowContent,
    'ui-card--use-header-offset': props.useHeaderOffset,
  },
]);

</script>
<style>
.ui-card {
  --card-default-theme-background-color: var(--color-neutral-0);
  --card-default-theme-color: var(--color-text-primary);

  --card-light-theme-background-color: var(--color-neutral-100);
  --card-light-theme-color: var(--color-text-primary);

  --card-dark-theme-background-color: var(--color-neutral-200);
  --card-dark-theme-color: var(--color-text-primary);

  --card-ghost-theme-background-color: transparent;
  --card-ghost-theme-color: var(--color-text-primary);

  --card-error-color: var(--color-error-500);
  --card-error-background-color: var(--color-error-100);
  --card-error-border-color: var(--color-error-500);
  --card-error-border: 1px solid var(--card-error-border-color);

  --card-inner-vertical-spacing-sm: var(--spacing-1-5);
  --card-inner-horizontal-spacing-sm: var(--spacing-2);
  --card-inner-paddings-size-sm: var(--card-inner-vertical-spacing-sm) var(--card-inner-horizontal-spacing-sm);
  --card-header-bottom-offset-size-sm: var(--spacing-2);

  --card-inner-vertical-spacing-md: var(--spacing-2);
  --card-inner-horizontal-spacing-md: var(--spacing-2-5);
  --card-inner-paddings-size-md: var(--card-inner-vertical-spacing-md) var(--card-inner-horizontal-spacing-md);
  --card-header-bottom-offset-size-md: var(--spacing-2);

  --card-inner-vertical-spacing-lg: var(--spacing-2-5);
  --card-inner-horizontal-spacing-lg: var(--spacing-3);
  --card-inner-paddings-size-lg: var(--card-inner-vertical-spacing-lg) var(--card-inner-horizontal-spacing-lg);
  --card-header-bottom-offset-size-lg: var(--spacing-2);

  --card-border-radius: var(--radius-lg);
  --card-box-shadow-sm: var(--shadow-sm);
  --card-box-shadow-md: var(--shadow-md);
  --card-box-shadow-lg: var(--shadow-lg);

  --card-title-font-weight: var(--subtitle-md-font-weight);
  --card-title-font-size: var(--subtitle-md-font-size);
  --card-title-line-height: var(--subtitle-md-line-height);
  --card-title-letter-spacing: var(--subtitle-md-letter-spacing);

  --card-subtitle-font-weight: var(--subtitle-xs-font-weight);
  --card-subtitle-font-size: var(--subtitle-xs-font-size);
  --card-subtitle-line-height: var(--subtitle-xs-line-height);
  --card-subtitle-letter-spacing: var(--subtitle-xs-letter-spacing);

  --card-footer-padding-top: var(--spacing-1-5);

  --card-caption-color: var(--color-text-secondary);
  --card-caption-gap: var(--spacing-1);
  --card-caption-font-size: var(--paragraph-sm-font-size);

  display: flex;
  flex-direction: column;
  gap: var(--spacing-1-5);
  flex: 1;
  position: relative;
  width: 100%;
}

.ui-row.stretch-xs .ui-card,
.ui-row.stretch-xs .ui-card__inner,
.ui-space--stretch .ui-card,
.ui-space--stretch .ui-card__inner {
  height: 100%;
}

.ui-row.stretch-xs .ui-card__content,
.ui-space--stretch .ui-card__content {
  flex: 0;
}

.ui-card--pointer {
  cursor: pointer;
}

.ui-card--theme-default>.ui-card__inner {
  background-color: var(--card-default-theme-background-color);
  color: var(--card-light-theme-color);
}

.ui-card--theme-light>.ui-card__inner {
  background-color: var(--card-light-theme-background-color);
  color: var(--card-light-theme-color);
}

.ui-card--theme-dark>.ui-card__inner {
  background-color: var(--card-dark-theme-background-color);
  color: var(--card-dark-theme-color);
}

.ui-card--theme-ghost>.ui-card__inner {
  background-color: var(--card-ghost-theme-background-color);
  color: var(--card-ghost-theme-color);
}

.ui-card--use-shadow:is(.ui-card--size-sm) .ui-card__inner {
  box-shadow: var(--card-box-shadow-sm);
}

.ui-card--use-shadow:is(.ui-card--size-md) .ui-card__inner {
  box-shadow: var(--card-box-shadow-md);
}

.ui-card--use-shadow:is(.ui-card--size-lg) .ui-card__inner {
  box-shadow: var(--card-box-shadow-lg);
}

.ui-card__inner {
  display: flex;
  flex-direction: column;
  max-height: 100%;
  width: 100%;
  border-radius: var(--card-border-radius);
}

.ui-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 0 0 auto;
  transition: margin-bottom .3s;
}

.ui-card__header:empty {
  display: none;
}

.ui-card__title {
  font-weight: var(--card-title-font-weight);
  font-size: var(--card-title-font-size);
  line-height: var(--card-title-line-height);
  letter-spacing: var(--card-title-letter-spacing);
  text-align: left;
}

.ui-card__text {
  font-weight: var(--card-subtitle-font-weight);
  font-size: var(--card-subtitle-font-size);
  line-height: var(--card-subtitle-line-height);
  letter-spacing: var(--card-subtitle-letter-spacing);
}

.ui-card__content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.ui-card.ui-card--overflow-hidden .ui-card__content {
  overflow: hidden;
}

.ui-card__footer {
  padding-top: var(--card-footer-padding-top);
  margin-top: auto;
  flex: 0 0 auto;
}

.ui-card--size-sm>.ui-card__inner {
  padding: var(--card-inner-paddings-size-sm);
}

.ui-card--size-sm.ui-card--use-header-offset>.ui-card__inner>.ui-card__header:has(+.ui-card__content) {
  margin-bottom: var(--card-header-bottom-offset-size-sm);
}

.ui-card--size-md>.ui-card__inner {
  padding: var(--card-inner-paddings-size-md);
}

.ui-card--size-md.ui-card--use-header-offset>.ui-card__inner>.ui-card__header:has(+.ui-card__content) {
  margin-bottom: var(--card-header-bottom-offset-size-md);
}

.ui-card--size-lg>.ui-card__inner {
  padding: var(--card-inner-paddings-size-lg);
}

.ui-card--size-lg.ui-card--use-header-offset>.ui-card__inner>.ui-card__header:has(+.ui-card__content) {
  margin-bottom: var(--card-header-bottom-offset-size-lg);
}

.ui-card--empty-header>.ui-card__inner>.ui-card__content {
  padding-bottom: 0;
}

.ui-card--empty-header:is(.ui-card--size-sm, .ui-card--size-md, .ui-card--size-lg)>.ui-card__inner>.ui-card__header {
  margin-bottom: 0;
}

.ui-card__caption {
  display: flex;
  align-items: center;
  justify-content: start;
  gap: var(--card-caption-gap);
  font-size: var(--card-caption-font-size);
  color: var(--card-caption-color);
}

.ui-card--error>.ui-card__inner {
  border: var(--card-error-border);
  background-color: var(--card-error-background-color);
}

.ui-card--error .ui-card__caption {
  color: var(--card-error-color);
}
</style>
