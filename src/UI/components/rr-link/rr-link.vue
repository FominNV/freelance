<template>
  <a
    v-if="!routerLink && typeof to === 'string'"
    :href="to ? to : undefined"
    :class="classList"
    :target="`_${target}`"
    @click="emit('click', $event)"
  >
    <!-- @slot слот для размещения текста ссылки -->
    <slot>
      <ui-text
        type="action"
        :size="size"
        :text="text"
      />
    </slot>
  </a>
  <router-link
    v-else
    :to="to"
    :class="classList"
    @click="emit('click', $event)"
  >
    <!-- @slot слот для размещения текста ссылки -->
    <slot>
      <ui-text
        type="action"
        size="sm"
        :text="text"
      />
    </slot>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Location, RouterLink } from 'vue-router';
import { ClassPropsType } from '../../@types/props';

export interface RrLinkPropsImpl {
  /** Маршрут ссылки */
  to?: string | Location;
  /** Текст ссылки */
  text?: string;
  /** Отключение ссылки */
  disabled?: boolean;
  /**
   * Определяет, где показать содержимое по ссылке
   * @param blank загружает документ в новой вкладке
   * @param self загружает документ в текущем фрейме
   * @param parent загружает документ в родительском фрейме
   * @param top В HTML5 загружает в окне высшего уровня. Если родителя нет, опция ведёт себя как self
   */
  target?: 'self' | 'blank' | 'parent' | 'top';
  /** Тема ссылки */
  theme?: 'default' | 'primary';
  /** Размер текста ссылки */
  size?: 'sm' | 'md' | 'lg';
  /** флаг переключения на router-link */
  routerLink?: boolean
  /** Показать нижнее подчеркивание */
  underline?: boolean;
}

const props = withDefaults(defineProps<RrLinkPropsImpl>(), {
  theme: 'primary',
  to: '',
  text: '',
  disabled: false,
  underline: false,
  routerLink: false,
  target: 'self',
  size: 'sm',
});

const emit = defineEmits<{
  /** Событие клика по ссылке */
  (e: 'click', value: MouseEvent): void;
}>();

const classList = computed<ClassPropsType>(() => [
  'ui-link',
  `ui-link--${props.theme}`,
  {
    'ui-link--underline': props.underline,
    'ui-link--disabled': props.disabled,
  },
]);
</script>

<style>
.ui-link {
  /** default theme */
  --link-default-color: var(--color-text-primary);
  --link-default-color-hover: var(--color-primary-300);
  --link-default-color-active: var(--color-primary-500);
  --link-default-color-disabled: var(--color-text-light);

  /** primary theme */
  --link-primary-color: var(--color-primary-500);
  --link-primary-color-hover: var(--color-primary-300);
  --link-primary-color-active: var(--color-primary-600);
  --link-primary-color-disabled: var(--color-text-light);

  text-decoration: none;
  transition: color ease .2s;
  cursor: pointer;
}

/** default theme */

.ui-link--default {
  color: var(--link-default-color);
}

.ui-link--default:focus {
  color: var(--link-default-color);
}

.ui-link--default:hover {
  color: var(--link-default-color-hover);
  cursor: pointer;
}

.ui-link--default:active {
  color: var(--link-default-color-active);
}

.ui-link--default.ui-link--disabled,
.ui-link--default.ui-link--disabled:hover {
  color: var(--link-default-color-disabled);
}

/** primary theme */

.ui-link--primary {
  color: var(--link-primary-color);
}

.ui-link--primary:hover {
  color: var(--link-primary-color-hover);
}

.ui-link--primary.ui-link--disabled,
.ui-link--primary.ui-link--disabled:hover {
  color: var(--link-primary-color-disabled);
}

.ui-link--primary:active {
  color: var(--link-primary-color-active);
}

.ui-link--disabled {
  pointer-events: none;
  cursor: default;
}

.ui-link--underline .ui-text {
  text-decoration: underline;
}
</style>
