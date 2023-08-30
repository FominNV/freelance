<template>
  <component
    :class="classes"
    :is="paginationComponent"
    :total="total"
    :model-value="modelValue"
    :page-size="pageSize"
    :page-sizes="pageSizes"
    v-on="$attrs"
    :max-visible-pages="maxVisiblePages"
    :use-arrows="useArrows"
    :pageLabel="pageLabel"
  />
</template>

<script setup lang="ts">
import {
  ComputedRef,
  computed,
} from 'vue';
import { ClassPropsType } from '../../@types/props';

// TODO: Подумать над типизацией чтобы в зависимости от пропса type у компонента был нужный набор пропсов
export interface UiPaginationPropsImpl {
  /** общее количество записей */
  total: number;
  /** количество записей на странице */
  pageSize: number;
  /** текущая страница */
  modelValue: number;
  /** тема панели пагинации (темная/светлая) */
  theme: 'dark' | 'light';
  /**
   * тип панели пагинации
   * @params mini надпись с выпадающим списком страниц
   * @params default кнопоки для переключения страниц
   */
  type: 'mini' | 'default' | 'pageSize';
  /** тескт надписи (для type = 'mini') */
  pageLabel?: string;
  /** максимальное количество видимых страниц (для type = 'default') */
  maxVisiblePages?: number;
  /** флаг отображающий кнопки перехода к предыдущей/следующей странице (для type = 'default') */
  useArrows?: boolean;
  /** Массив возможных вариантов кол-ва элементов на странице */
  pageSizes?: number[];
}

const props = withDefaults(defineProps<UiPaginationPropsImpl>(), {
  pageSize: 10,
  pageSizes: () => [25, 50, 100],
  type: 'default',
  theme: 'light',
});

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-pagination',
  {
    [`ui-pagination--theme-${props.theme}`]: props.theme,
  },
]);

const templates: any = {
  mini: () => import('./templates/ui-pagination-dropdown.vue'),
  default: () => import('./templates/ui-pagination-buttons.vue'),
  pageSize: () => import('./templates/ui-pagination-dropdown-page-size.vue'),
};

const paginationComponent = computed(() => templates[props.type]);
</script>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<style>
.ui-pagination {
  --pagination-spacing: var(--spacing-0-5);
  --pagination-dark-button-background-color: var(--color-neutral-300);
  --pagination-dark-button-text-color: var(--color-text-primary);

  --pagination-dark-button-background-color-hover: var(--color-primary-300);
  --pagination-dark-button-text-color-hover: var(--color-text-inversion);

  --pagination-dark-button-background-color-active: var(--color-primary-500);
  --pagination-dark-button-text-color-active: var(--color-text-inversion);

  --pagination-dark-button-background-color-disabled: var(--color-neutral-200);
  --pagination-dark-button-text-color-disabled: var(--color-text-light);

  --pagination-dark-button-border: none;

  --pagination-light-button-background-color: var(--color-neutral-100);
  --pagination-light-button-text-color: var(--color-text-primary);

  --pagination-light-button-background-color-hover: var(--color-primary-300);
  --pagination-light-button-text-color-hover: var(--color-text-inversion);

  --pagination-light-button-background-color-active: var(--color-primary-500);
  --pagination-light-button-text-color-active: var(--color-text-inversion);

  --pagination-light-button-background-color-disabled: var(--color-neutral-200);
  --pagination-light-button-text-color-disabled: var(--color-text-light);

  --pagination-light-button-border: none;

  --pagination-button-radius: var(--radius-xs);
  --pagination-button-height: calc(var(--control-height-lg) / 2);
  --pagination-button-min-width: 28px;
  --pagination-button-border: none;
  --pagination-button-outline: none;
  --pagination-font-size: var(--subtitle-xs-font-size);
  --pagination-line-height: var(--subtitle-xs-line-height);
  --pagination-font-weight: var(--subtitle-xs-font-weight);
  --pagination-letter-spacing: var(--subtitle-xs-letter-spacing);
}

.ui-pagination__button {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: var(--pagination-font-size);
  line-height: var(--pagination-line-height);
  font-weight: var(--pagination-font-weight);
  letter-spacing: var(--pagination-letter-spacing);
  border: var(--pagination-button-border);
  outline: var(--pagination-button-outline);
  border-radius: var(--pagination-button-radius);
  min-width: var(--pagination-button-min-width);
  height: var(--pagination-button-height);
  cursor: pointer;
}

.ui-pagination--theme-dark .ui-pagination__button.ui-pagination__button--separator,
.ui-pagination--theme-light .ui-pagination__button.ui-pagination__button--separator,
.ui-pagination__button--separator {
  pointer-events: none;
  background-color: transparent;
  cursor: default;
  min-width: 20px;
  position: relative;
  bottom: -0.55em;
}

.ui-pagination--theme-dark .ui-pagination__button {
  background-color: var(--pagination-dark-button-background-color);
  border: var(--pagination-dark-button-border);
  color: var(--pagination-dark-button-text-color);
}

.ui-pagination--theme-dark .ui-pagination__button[disabled]:hover,
.ui-pagination--theme-dark .ui-pagination__button[disabled] {
  background-color: var(--pagination-dark-button-background-color-disabled);
  color: var(--pagination-dark-button-text-color-disabled);
}

.ui-pagination--theme-dark .ui-pagination__button:hover {
  background-color: var(--pagination-dark-button-background-color-hover);
  color: var(--pagination-dark-button-text-color-hover);
}

.ui-pagination--theme-dark .ui-pagination__button--active,
.ui-pagination--theme-dark .ui-pagination__button.ui-pagination__button--active:hover {
  background-color: var(--pagination-dark-button-background-color-active);
  color: var(--pagination-dark-button-text-color-active);
}

.ui-pagination--theme-light .ui-pagination__button[disabled]:hover,
.ui-pagination--theme-light .ui-pagination__button[disabled] {
  background-color: var(--pagination-light-button-background-color-disabled);
  color: var(--pagination-light-button-text-color-disabled);
}

.ui-pagination--theme-light .ui-pagination__button {
  background-color: var(--pagination-light-button-background-color);
  border: var(--pagination-light-button-border);
  color: var(--pagination-light-button-text-color);
}

.ui-pagination--theme-light .ui-pagination__button--active,
.ui-pagination--theme-light .ui-pagination__button.ui-pagination__button--active:hover {
  background-color: var(--pagination-light-button-background-color-active);
  color: var(--pagination-light-button-text-color-active);
}

.ui-pagination--theme-light .ui-pagination__button:hover {
  background-color: var(--pagination-light-button-background-color-hover);
  color: var(--pagination-light-button-text-color-hover);
}
</style>
