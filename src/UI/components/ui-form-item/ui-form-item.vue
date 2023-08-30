<template>
  <div
    :class="classes"
    v-if="$slots.default"
  >
    <div
      class="ui-form-item__title"
      v-if="isShowTitle"
    >
      <span
        class="ui-form-item__title-icon"
        v-if="icon"
      >
        <ui-icon
          :name="icon"
          size="sm"
        />
      </span>

      <span
        class="ui-form-item__title-text"
        v-if="title"
      >
        {{ title }}
      </span>

      <ui-tooltip
        v-if="tooltipText || $slots['tooltip-content']"
        :text="tooltipText"
        strategy="absolute"
        style="z-index:1"
      >
        <ui-icon
          name="system/question-Circle"
          size="sm"
        />
        <template #content>
          <!-- @slot слот для кастомной подсказки в тултипе -->
          <slot
            name="tooltip-content"
            :tooltip-text="tooltipText"
          />
        </template>
      </ui-tooltip>
      <span
        class="ui-form-item__right-block"
        v-if="$slots['title-right']"
      >
        <slot name="title-right" />
      </span>
    </div>

    <div class="ui-form-item__content">
      <span class="ui-form-item__control">
        <!-- @slot дефолтный слот для контрола -->
        <slot />

      </span>

      <div
        class="ui-form-item__actions"
        v-if="$slots.actions"
      >
        <!-- @slot слот для экшенов -->
        <slot name="actions" />
      </div>
    </div>

    <span
      class="ui-form-item__caption"
      v-if="caption"
    >
      {{ caption }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { ClassPropsType } from '../../@types/props';
import { PropsSizeType } from '../../@types/size';
import { FormInputSizesType } from './const';

export interface UiFormItemPropsImpl {
  /** применить стиль ошибки */
  showError?: boolean;
  /** текст ошибки */
  errorText?: string;
  /** заголовок элемента формы */
  title?: string;
  /** описание элемента формы */
  caption?: string;
  /** Показать отметку обязательного поля */
  required?: boolean;
  /** Сообщение для подсказки */
  tooltipText?: string;
  /** Название иконки */
  icon?: IconsNamesType;
  /** Размер (соответствует размерам инпутов) */
  size?: PropsSizeType<FormInputSizesType>;
  /** Применить disabled стиль */
  disabled?: boolean;
  /** Вертикальное выравнивание контрола */
  controlAlign?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
}

const props = withDefaults(defineProps<UiFormItemPropsImpl>(), {
  showError: false,
  errorText: '',
  caption: '',
  required: false,
  size: 'lg',
  disabled: false,
  controlAlign: 'start',
});
const slots = useSlots();
const caption = computed<string>(() => (props.showError && !!props.errorText ? props.errorText : props.caption));
const isShowTitle = computed<boolean>(() => !!props.title || !!props.icon || !!props.tooltipText || !!slots['title-right']);
const classes = computed<ClassPropsType>(() => {
  return [
    'ui-form-item',
    `ui-form-item--${props.size}`,
    `ui-form-item--control-align-${props.controlAlign}`,
    {
      'ui-form-item--error': props.showError,
      'ui-form-item--required': props.required,
      'ui-form-item--disabled': props.disabled,
    },
  ];
});
</script>
<style>
.ui-form-item {
  --form-item-width: 100%;
  --form-item-asterisk-color: var(--color-error-500);
  --form-item-icon-color: var(--color-text-primary);

  --form-item-title-font-size: var(--paragraph-sm-font-size);
  --form-item-title-font-weight: var(--paragraph-sm-font-weight);
  --form-item-title-line-height: var(--paragraph-sm-line-height);
  --form-item-title-letter-spacing: var(--paragraph-sm-letter-spacing);
  --form-item-title-margin-bottom: var(--spacing-0-5);
  --form-item-title-items-gap: var(--spacing-0-5);
  --form-item-title-color: var(--color-text-secondary);
  --form-item-title-word-break: break-word;

  --form-item-caption-font-size: var(--paragraph-xs-font-size);
  --form-item-caption-font-weight: var(--paragraph-xs-font-weight);
  --form-item-caption-line-height: var(--paragraph-xs-line-height);
  --form-item-caption-letter-spacing: var(--paragraph-xs-letter-spacing);
  --form-item-caption-color: var(--color-text-placeholder);
  --form-item-caption-error-color: var(--color-error-500);
  --form-item-caption-margin-top: var(--spacing-0-5);

  --form-item-disabled-color: var(--color-text-placeholder);

  --form-item-actions-margin-left: 10px;
  --form-item-auto-control-min-height: auto;
  --form-item-sm-control-min-height: var(--control-height-sm);
  --form-item-lg-control-min-height: var(--control-height-lg);

  --form-item-right-block-color: var(--color-text-placeholder);

  position: relative;
  display: inline;
  width: var(--form-item-width);
}

.ui-form-item--error .ui-form-item__caption {
  color: var(--form-item-caption-error-color);
}

.ui-form-item__title {
  font-size: var(--form-item-title-font-size);
  font-weight: var(--form-item-title-font-weight);
  letter-spacing: var(--form-item-title-letter-spacing);
  line-height: var(--form-item-title-line-height);
  color: var(--form-item-title-color);
  margin-bottom: var(--form-item-title-margin-bottom);
  display: inline-flex;
  align-items: flex-start;
  gap: var(--form-item-title-items-gap);
  width: 100%;
}

.ui-form-item--required .ui-form-item__title::before {
  content: '*';
  color: var(--form-item-asterisk-color);
}

.ui-form-item__title-icon {
  color: var(--form-item-icon-color);
}

.ui-form-item__control {
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
}

.ui-form-item--control-align-start .ui-form-item__control {
  align-items: flex-start;
}

.ui-form-item--control-align-center .ui-form-item__control {
  align-items: center;
}

.ui-form-item--control-align-end .ui-form-item__control {
  align-items: flex-end;
}

.ui-form-item--control-align-baseline .ui-form-item__control {
  align-items: baseline;
}

.ui-form-item--control-align-stretch .ui-form-item__control {
  align-items: stretch;
}

.ui-form-item__caption {
  margin-top: var(--form-item-caption-margin-top);
  font-weight: var(--form-item-caption-font-weight);
  font-size: var(--form-item-caption-font-size);
  letter-spacing: var(--form-item-caption-letter-spacing);
  line-height: var(--form-item-caption-line-height);
  color: var(--form-item-caption-color);
  display: inline-block;
}

.ui-form-item__content,
.ui-form-item__actions {
  display: flex;
  align-items: flex-start;
}

.ui-form-item__actions {
  flex-shrink: 0;
  margin-left: var(--form-item-actions-margin-left);
}

.ui-form-item--lg .ui-form-item__control {
  min-height: var(--form-item-lg-control-min-height);
}

.ui-form-item--sm .ui-form-item__control {
  min-height: var(--form-item-sm-control-min-height);
}

.ui-form-item--auto .ui-form-item__control {
  min-height: var(--form-item-auto-control-min-height);
}

/** disabled */

.ui-form-item--disabled .ui-form-item__title,
.ui-form-item--disabled .ui-form-item__title-icon,
.ui-form-item--disabled:not(.ui-form-item--error) .ui-form-item__caption {
  color: var(--form-item-disabled-color);
}

.ui-form-item__right-block {
  margin-left: auto;
  color: var(--form-item-right-block-color);
}

.ui-form-item__title-text {
  word-break: var(--form-item-title-word-break);
}
</style>
