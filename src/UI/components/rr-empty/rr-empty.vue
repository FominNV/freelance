<template>
  <div :class="classes">
    <div class="ui-empty__icon-container">
      <ui-empty-icon-adapter
        :name="icon"
        size="xl"
      />
    </div>
    <div
      class="ui-empty__title"
      v-if="title"
    >
      {{ title }}
    </div>
    <div
      class="ui-empty__message"
      v-if="message"
    >
      {{ message }}
    </div>
    <div class="ui-empty__action">
      <!-- @slot слот для размещения кнопок действий, например, кнопка "Повторить запрос"-->
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ClassPropsType } from '../../@types/props';
import RrEmptyIconAdapter from './ui-empty-icon-adapter.vue';

export interface RrEmptyPropsImpl {
  // заголовок
  title?: string;
  // сообщение
  message?: string;
  /** иконка */
  icon: IconsNamesType;
  /** размер */
  size?: 'md' | 'lg';
  /** тема */
  theme?: 'light' | 'dark';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<RrEmptyPropsImpl>(), {
  title: 'Ничего не найдено',
  theme: 'light',
  size: 'lg',
});

const classes = computed<ClassPropsType>(() => [
  'ui-empty',
  `ui-empty--${props.theme}`,
  `ui-empty--${props.size}`,
]);
</script>
<style>
.ui-empty {
  --empty-icon-container-radius: var(--radius-round);

  /** lg size */
  --empty-lg-icon-container-size: 80px;
  --empty-lg-icon-container-margin-bottom: var(--spacing-2);
  --empty-lg-title-margin-bottom: var(--spacing-1);
  --empty-lg-button-margin-top: var(--spacing-2-5);

  --empty-lg-title-font-size: var(--subtitle-lg-font-size);
  --empty-lg-title-line-height: var(--subtitle-lg-line-height);
  --empty-lg-title-font-weight: var(--subtitle-lg-font-weight);
  --empty-lg-title-letter-spacing: var(--subtitle-lg-letter-spacing);

  --empty-lg-text-font-size: var(--paragraph-sm-font-size);
  --empty-lg-text-line-height: var(--paragraph-sm-line-height);
  --empty-lg-text-font-weight: var(--paragraph-sm-font-weight);
  --empty-lg-text-letter-spacing: var(--paragraph-sm-letter-spacing);

  /** md size */
  --empty-md-icon-container-size: 60px;
  --empty-md-icon-container-margin-bottom: var(--spacing-1-5);
  --empty-md-title-margin-bottom: var(--spacing-0-5);
  --empty-md-button-margin-top: var(--spacing-2);

  --empty-md-title-font-size: var(--subtitle-sm-font-size);
  --empty-md-title-line-height: var(--subtitle-sm-line-height);
  --empty-md-title-font-weight: var(--subtitle-sm-font-weight);
  --empty-md-title-letter-spacing: var(--subtitle-sm-letter-spacing);

  --empty-md-text-font-size: var(--paragraph-sm-font-size);
  --empty-md-text-line-height: var(--paragraph-sm-line-height);
  --empty-md-text-font-weight: var(--paragraph-sm-font-weight);
  --empty-md-text-letter-spacing: var(--paragraph-sm-letter-spacing);

  /** light theme */
  --empty-light-icon-container-background-color: var(--color-neutral-100);
  --empty-light-icon-color: var(--color-text-primary);
  --empty-light-title-color: var(--color-text-primary);
  --empty-light-message-color: var(--color-text-secondary);

  /** dark theme */
  --empty-dark-icon-container-background-color: var(--color-neutral-200);
  --empty-dark-icon-color: var(--color-text-primary);
  --empty-dark-title-color: var(--color-text-primary);
  --empty-dark-message-color: var(--color-text-secondary);

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.ui-empty__icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--empty-icon-container-radius);
}

.ui-empty__message,
.ui-empty__title {
  text-align: center;
}

/** lg size */

.ui-empty--lg .ui-empty__icon-container {
  width: var(--empty-lg-icon-container-size);
  height: var(--empty-lg-icon-container-size);
  margin-bottom: var(--empty-lg-icon-container-margin-bottom);
}

.ui-empty--lg .ui-empty__title {
  font-weight: var(--empty-lg-title-font-weight);
  font-size: var(--empty-lg-title-font-size);
  line-height: var(--empty-lg-title-line-height);
  letter-spacing: var(--empty-lg-title-letter-spacing);
}

.ui-empty--lg .ui-empty__title:has(+.ui-empty__message) {
  margin-bottom: var(--empty-lg-title-margin-bottom);
}

.ui-empty--lg .ui-empty__message {
  font-weight: var(--empty-lg-text-font-weight);
  font-size: var(--empty-lg-text-font-size);
  line-height: var(--empty-lg-text-line-height);
  letter-spacing: var(--empty-lg-text-letter-spacing);
}

.ui-empty--lg .ui-empty__action {
  margin-top: var(--empty-lg-button-margin-top);
}

/** md size */

.ui-empty--md .ui-empty__icon-container {
  width: var(--empty-md-icon-container-size);
  height: var(--empty-md-icon-container-size);
  margin-bottom: var(--empty-md-icon-container-margin-bottom);
}

.ui-empty--md .ui-empty__title {
  font-weight: var(--empty-md-title-font-weight);
  font-size: var(--empty-md-title-font-size);
  line-height: var(--empty-md-title-line-height);
  letter-spacing: var(--empty-md-title-letter-spacing);
}

.ui-empty--md .ui-empty__title:has(+.ui-empty__message) {
  margin-bottom: var(--empty-md-title-margin-bottom);
}

.ui-empty--md .ui-empty__message {
  font-weight: var(--empty-md-text-font-weight);
  font-size: var(--empty-md-text-font-size);
  line-height: var(--empty-md-text-line-height);
  letter-spacing: var(--empty-md-text-letter-spacing);
}

.ui-empty--md .ui-empty__action {
  margin-top: var(--empty-md-button-margin-top);
}

/** light theme */

.ui-empty--light .ui-empty__icon-container {
  background-color: var(--empty-light-icon-container-background-color);
  color: var(--empty-light-icon-color)
}

.ui-empty--light .ui-empty__title {
  color: var(--empty-light-title-color);
}

.ui-empty--light .ui-empty__message {
  color: var(--empty-light-message-color);
}

/** dark theme */

.ui-empty--dark .ui-empty__icon-container {
  background-color: var(--empty-dark-icon-container-background-color);
  color: var(--empty-dark-icon-color)
}

.ui-empty--dark .ui-empty__title {
  color: var(--empty-dark-title-color);
}

.ui-empty--dark .ui-empty__message {
  color: var(--empty-dark-message-color);
}
</style>
