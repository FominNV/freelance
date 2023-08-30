<template>
  <div
    :class="classes"
    :style="{ width: width ? `${width}px` : undefined }"
    @click="emit('click', $event)"
  >
    <header class="ui-alert__header">
      <div class="ui-alert__title">
        <ui-icon
          v-if="headerIcon"
          class="ui-alert__icon"
          :name="headerIcon"
          :size="size === 'lg' ? 'sm' : 'sm'"
          color="none"
        />
        <ui-subtitle
          class="ui-alert__title"
          :text="title"
          :size="size === 'lg' ? 'sm' : 'xs'"
        />
      </div>
      <ui-alert-control
        class="ui-alert__control--remove"
        v-if="showRemoveButton"
        :icon="removeIcon"
        @click.stop="emit('remove', $event)"
      />
    </header>
    <section
      class="ui-alert__content"
      v-if="hasContent"
    >
      <!-- @slot слот для размещений кастомного контента вместо текста сообщения -->
      <slot>
        <ui-text
          class="ui-alert__message"
          :size="size === 'lg' ? 'sm' : 'xs'"
          :text="text"
        />
      </slot>
      <div
        class="ui-alert__action"
        v-if="$slots.action"
      >
        <!-- @slot слот для размещения дополнительных действий-->
        <slot name="action" />
      </div>
      <div
        v-if="showIndicator"
        class="ui-alert__indicator"
      />
    </section>
    <ui-alert-control
      class="ui-alert__control--link"
      v-if="showLink"
      :icon="linkIcon"
      @click.stop="emit('goto', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { IconsConfig } from '../../@types/icons-config';
import { ClassPropsType } from '../../@types/props';
import { PropsSizeType } from '../../@types/size';
import { useConfigParam } from '../../lib/useConfigParam';
import { AlertSizesType } from './const';
import UiAlertControl from './ui-alert-control.vue';

export interface UiAlertPropsImpl {
  /** заголовок */
  title?: string;
  /** сообщение */
  text?: string;
  /** тип сообщения */
  type?: 'success' | 'attention' | 'error' | 'information';
  /** выровнять текст сообщения относительно заголовка */
  alignContentByTitle?: boolean;
  /** фиксированная ширина */
  width?: number;
  /** заменить цвет фона в зависимости от типа уведомления */
  bgAsType?: boolean;
  /** уведомление встроенное в страницу */
  theme?: 'dark' | 'light';
  /** иконка удаления уведомления */
  removeIcon?: IconsNamesType;
  /** иконка ссылки */
  linkIcon?: IconsNamesType;
  /** отобразить кнопку закрытия */
  showRemoveButton?: boolean;
  /** отобразить иконку типа уведомления в заголовке */
  showHeaderIcon?: boolean;
  /** отобразить индикатор нового уведомления */
  showIndicator?: boolean;
  /** отобразить кнопку перехода к сущности сгенерировавшей уведомление */
  showLink?: boolean;
  /** Размер алерта */
  size?: PropsSizeType<AlertSizesType>;
  /** Показать открытое состояние */
  opened?: boolean;
  /** Применить стили при наведении на алерт */
  hoverable?: boolean;
}

const slots = useSlots();

const props = withDefaults(defineProps<UiAlertPropsImpl>(), {
  text: '',
  theme: 'dark',
  showRemoveButton: true,
  showHeaderIcon: true,
  opened: false,
  size: 'lg',
  hoverable: true,
  get removeIcon() {
    return (useConfigParam('icons') as IconsConfig).systemIcons.actions.close;
  },
  get linkIcon() {
    return (useConfigParam('icons') as IconsConfig).systemIcons.actions.link;
  },
});

const emit = defineEmits<{
  /** клик по кнопке удаления уведомления */
  (e: 'remove', event: MouseEvent): void;
  /** клик по кнопке ссылке  */
  (e: 'goto', event: MouseEvent): void;
  /** клик по уведомлению  */
  (e: 'click', event: MouseEvent): void;
}>();

const hasContent = computed<boolean>(() => !!props.text || !!slots.default);
const isContentCustom = computed<boolean>(() => !!slots.default);
const headerIcon = computed<IconsNamesType | null>(() => {
  if (props.type && props.showHeaderIcon) {
    return props.theme === 'dark' ? `system/${props.type}-invert` : `system/${props.type}`;
  }
  return null;
});

const classes = computed<ClassPropsType>(() => [
  'ui-alert',
  `ui-alert--${props.size}`,
  {
    'ui-alert--hoverable': props.hoverable,
    'ui-alert--opened': props.opened,
    'ui-alert--align-content-by-title': props.alignContentByTitle && !!headerIcon.value,
    'ui-alert--custom-content': isContentCustom.value,
    'ui-alert--without-remove-button': !props.showRemoveButton,
    'ui-alert--with-link-button': props.showLink,
    'ui-alert--fill-bg': props.bgAsType,
    [`ui-alert--theme-${props.theme}`]: props.theme,
    [`ui-alert--type-${props.type}`]: props.type,
  },
]);
</script>

<style>
.ui-alert {
  --alert-background-color-dark: var(--color-neutral-900-alpha-2);
  --alert-hover-background-color-dark: var(--color-neutral-900);
  --alert-text-color-dark: var(--color-text-inversion-secondary);
  --alert-color-dark: var(--color-text-inversion);
  --alert-color-background-dark-control-hover: var(--color-neutral-0-alpha-1);

  --alert-background-color-light: var(--color-neutral-100);
  --alert-hover-background-color-light: var(--color-neutral-200);
  --alert-text-color-light: var(--color-text-secondary);
  --alert-color-light: var(--color-text-primary);
  --alert-color-background-light-control-hover: var(--color-neutral-300);

  --alert-background-color-success: var(--color-success-100);
  --alert-hover-background-color-success: var(--color-success-300);
  --alert-background-color-success-control-hover: var(--color-success-500);
  --alert-text-color-success: var(--color-success-600);
  --alert-text-color-hover-success: var(--color-text-inversion);

  --alert-background-color-attention: var(--color-warning-100);
  --alert-hover-background-color-attention: var(--color-warning-300);
  --alert-background-color-attention-control-hover: var(--color-warning-500);
  --alert-text-color-attention: var(--color-warning-600);
  --alert-text-color-hover-attention: var(--color-text-inversion);

  --alert-background-color-error: var(--color-error-100);
  --alert-hover-background-color-error: var(--color-error-300);
  --alert-background-color-error-control-hover: var(--color-error-500);
  --alert-text-color-error: var(--color-error-600);
  --alert-text-color-hover-error: var(--color-text-inversion);

  --alert-background-color-information: var(--color-primary-100);
  --alert-hover-background-color-information: var(--color-primary-300);
  --alert-background-color-information-control-hover: var(--color-primary-500);
  --alert-text-color-information: var(--color-primary-600);
  --alert-text-color-hover-information: var(--color-text-inversion);

  --alert-control-padding: var(--spacing-0-25);
  --alert-control-border-radius: var(--radius-sm);

  --alert-radius: var(--radius-lg);
  --alert-custom-content-top-spacing: var(--spacing-1-5);
  --alert-action-top-spacing: var(--spacing-1-5);
  --alert-indicator-color: var(--color-error-500);
  --alert-indicator-size: 7px;
  --alert-indicator-offset: 8px;

  --alert-md-vertical-spacing: var(--spacing-1-5);
  --alert-md-horizontal-spacing: var(--spacing-1-5);
  --alert-md-title-gap: var(--spacing-1);

  --alert-lg-vertical-spacing: var(--spacing-2);
  --alert-lg-horizontal-spacing: var(--spacing-2);
  --alert-lg-title-gap: var(--spacing-1-5);

  transition: background-color .2s ease;
  position: relative;
  background-color: var(--alert-background-color-dark);
  color: var(--alert-color-dark);
  border-radius: var(--alert-radius);
}

.ui-alert--md {
  padding: var(--alert-md-vertical-spacing) var(--alert-md-horizontal-spacing);
}

.ui-alert--md .ui-alert__title {
  gap: var(--alert-md-title-gap);
}

.ui-alert--lg {
  padding: var(--alert-lg-vertical-spacing) var(--alert-lg-horizontal-spacing);
}

.ui-alert--lg .ui-alert__title {
  gap: var(--alert-lg-title-gap);
}

.ui-alert:is(.ui-alert--hoverable):hover {
  background-color: var(--alert-hover-background-color-dark);
}

.ui-alert__header,
.ui-alert__title {
  display: flex;
  align-items: start;
}

.ui-alert__header {
  justify-content: space-between;
  padding-right: calc(24px - var(--alert-control-padding));
}

.ui-alert:is(.ui-alert--without-remove-button) .ui-alert__header {
  padding-right: 0;
}

.ui-alert__icon {
  flex-shrink: 0;
}

.ui-alert.ui-alert--opened {
  background-color: var(--alert-hover-background-color-dark);
}

.ui-alert.ui-alert--opened::after {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  bottom: 0;
  margin: auto;
  right: -20px;
  content: '';
  border: 10px solid transparent;
  border-left: 10px solid var(--alert-hover-background-color-dark);
}

.ui-alert--align-content-by-title .ui-alert__content {
  padding-left: 32px;
  padding-right: 32px;
}

.ui-alert__header+.ui-alert__content {
  margin-top: 8px;
}

.ui-alert--custom-content .ui-alert__header+.ui-alert__content {
  margin-top: var(--alert-custom-content-top-spacing);
}

.ui-alert.ui-alert--with-link-button:not(.ui-alert--without-remove-button) {
  min-height: 80px;
}

.ui-alert--with-link-button .ui-alert__content {
  padding-right: 24px;
}

.ui-alert__message {
  color: var(--alert-text-color-dark);
}

.ui-alert__action {
  margin-top: var(--alert-action-top-spacing);
}

.ui-alert--inline {
  background-color: #fff;
}

/** Light theme */

.ui-alert--theme-light {
  background-color: var(--alert-background-color-light);
  color: var(--alert-color-light);
}

.ui-alert--theme-light .ui-alert__message {
  color: var(--alert-text-color-light);
}

.ui-alert:is(.ui-alert--theme-light):is(.ui-alert--hoverable):not(.ui-alert--fill-bg):hover {
  background-color: var(--alert-hover-background-color-light);
}

.ui-alert:is(.ui-alert--theme-light):not(.ui-alert--fill-bg).ui-alert--opened {
  background-color: var(--alert-hover-background-color-light);
}

.ui-alert:is(.ui-alert--theme-light):not(.ui-alert--fill-bg).ui-alert--opened::after {
  border-left-color: var(--alert-hover-background-color-light);
}

/** success bg */

.ui-alert--fill-bg.ui-alert--type-success {
  background-color: var(--alert-background-color-success);
  color: var(--alert-text-color-success);
}

.ui-alert--fill-bg.ui-alert--type-success .ui-alert__message {
  color: var(--alert-text-color-success);
}

.ui-alert--fill-bg.ui-alert--type-success:is(.ui-alert--hoverable):hover {
  background-color: var(--alert-hover-background-color-success);
}

.ui-alert--fill-bg.ui-alert--type-success.ui-alert--opened {
  background-color: var(--alert-hover-background-color-success);
}

.ui-alert--fill-bg.ui-alert--type-success.ui-alert--opened::after {
  border-left-color: var(--alert-hover-background-color-success);
}

/** attention bg */

.ui-alert--fill-bg.ui-alert--type-attention {
  background-color: var(--alert-background-color-attention);
  color: var(--alert-text-color-attention);
}

.ui-alert--fill-bg.ui-alert--type-attention .ui-alert__message {
  color: var(--alert-text-color-warning);
}

.ui-alert--fill-bg.ui-alert--type-attention:is(.ui-alert--hoverable):hover {
  background-color: var(--alert-hover-background-color-attention);
}

.ui-alert--fill-bg.ui-alert--type-attention.ui-alert--opened {
  background-color: var(--alert-hover-background-color-attention);
}

.ui-alert--fill-bg.ui-alert--type-attention.ui-alert--opened::after {
  border-left-color: var(--alert-hover-background-color-attention);
}

/** error bg */

.ui-alert--fill-bg.ui-alert--type-error {
  background-color: var(--alert-background-color-error);
  color: var(--alert-text-color-error);
}

.ui-alert--fill-bg.ui-alert--type-error .ui-alert__message {
  color: var(--alert-text-color-error);
}

.ui-alert--fill-bg.ui-alert--type-error:is(.ui-alert--hoverable):hover {
  background-color: var(--alert-hover-background-color-error);
}

.ui-alert--fill-bg.ui-alert--type-error.ui-alert--opened {
  background-color: var(--alert-hover-background-color-error);
}

.ui-alert--fill-bg.ui-alert--type-error.ui-alert--opened::after {
  border-left-color: var(--alert-hover-background-color-error);
}

/** information bg */

.ui-alert--fill-bg.ui-alert--type-information {
  background-color: var(--alert-background-color-information);
  color: var(--alert-text-color-information);
}

.ui-alert--fill-bg.ui-alert--type-information .ui-alert__message {
  color: var(--alert-text-color-information);
}

.ui-alert--fill-bg.ui-alert--type-information:is(.ui-alert--hoverable):hover {
  background-color: var(--alert-hover-background-color-information);
}

.ui-alert--fill-bg.ui-alert--type-information.ui-alert--opened {
  background-color: var(--alert-hover-background-color-information);
}

.ui-alert--fill-bg.ui-alert--type-information.ui-alert--opened::after {
  border-left-color: var(--alert-hover-background-color-information);
}

.ui-alert__indicator {
  position: absolute;
  top: var(--alert-indicator-offset);
  right: var(--alert-indicator-offset);
  width: var(--alert-indicator-size);
  height: var(--alert-indicator-size);
  background-color: var(--alert-indicator-color);
  border-radius: 50%;
}

.ui-alert__control--link {
  position: absolute;
  right: var(--alert-indicator-offset);
  bottom: var(--alert-indicator-offset);
}
</style>
