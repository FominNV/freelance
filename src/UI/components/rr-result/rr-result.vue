<template>
  <section :class="classes">
    <ui-icon
      class="ui-result__image"
      :name="icon"
      size="xl"
      color="none"
    />
    <ui-subtitle
      size="lg"
      class="ui-result__title"
      :text="title"
      v-if="title"
    />
    <ui-text
      size="sm"
      class="ui-result__message"
      :text="message"
      v-if="message"
    />
    <div class="ui-result__actions">
      <!-- @slot слот для добавления кастомных экшенов -->
      <slot name="actions" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ClassPropsType } from '../../@types/props';
import { useConfigParam } from '../../lib/useConfigParam';
import { IconsConfig } from '../../@types/icons-config';

export interface RrResultPropsImpl {
  /** заголовок */
  title?: string;
  /** сообщение */
  message?: string;
  /** тип результата */
  type?: 'success' | 'warning' | 'error' | 'info';
}

const props = withDefaults(defineProps<RrResultPropsImpl>(), {
  message: '',
  type: 'info',
});

const classes = computed<ClassPropsType>(() => [
  'ui-result',
]);

const icon = computed<IconsNamesType>(() => {
  const { systemIcons } = useConfigParam('icons') as IconsConfig;
  return systemIcons.indicators[props.type];
});

</script>
<style>
.ui-result {
  --result-spacing: var(--spacing-6) var(--spacing-6);
  --result-title-spacing-y: var(--spacing-2);
  --result-message-spacing-y: var(--spacing-1);
  --result-actions-spacing-y: var(--spacing-2-5);

  position: relative;
  text-align: center;
  padding: var(--result-spacing);
  width: 100%;
}

.ui-result__image {
  margin: 0 auto;
}

.ui-result__title {
  display: block;
  margin-top: var(--result-title-spacing-y);
}

.ui-result__message {
  margin-top: var(--result-message-spacing-y);
  max-width: 50%;
}

.ui-result__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0 var(--result-message-spacing-y);
  margin-top: var(--result-actions-spacing-y);
}
</style>
