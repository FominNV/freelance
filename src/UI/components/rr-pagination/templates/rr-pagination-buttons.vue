<template>
  <div
    :class="classes"
    v-if="total > pageSize"
  >
    <button
      v-if="useArrows"
      :disabled="!hasPrev"
      class="ui-pagination__button"
      type="button"
      @click="gotoPrevPage"
    >
      <ui-icon
        :name="leftArrow"
        size="sm"
      />
    </button>
    <button
      type="button"
      :class="buttonClasses(button.active, button.page)"
      v-for="(button, key) in buttons"
      @click="onPageSelectedHandler(button.page)"
      :key="key"
    >
      <ui-icon
        :name="kebabIcon"
        v-if="typeof button.page === 'string'"
      />
      <span v-else>{{ button.title }}</span>
    </button>
    <button
      v-if="useArrows"
      :disabled="!hasNext"
      class="ui-pagination__button"
      type="button"
      :inner-paddings="false"
      @click="gotoNextPage"
    >
      <ui-icon
        :name="rightArrow"
        size="sm"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  ComputedRef,
  computed,
} from 'vue';
import { IconsConfig } from '../../../@types/icons-config';

import { ClassPropsType } from '../../../@types/props';
import { useConfigParam } from '../../../lib/useConfigParam';
import { usePagination } from '../usePagination';

export interface RrPaginationDropdownPropsImpl {
  /** общее количество записей */
  total: number;
  /** количество записей на странице */
  pageSize: number;
  /** текущая страница */
  modelValue: number;
  /** максимальное количество видимых страниц */
  maxVisiblePages?: number;
  /** флаг отображающий кнопки перехода к предыдущей/следующей странице */
  useArrows?: boolean;
}

const props = withDefaults(defineProps<RrPaginationDropdownPropsImpl>(), {
  maxVisiblePages: 5,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'range-change', start: number, end: number): void;
}>();

const iconsConfig = useConfigParam('icons') as IconsConfig;
const kebabIcon: IconsNamesType = iconsConfig.systemIcons.menu.menuKebabH;
const leftArrow: IconsNamesType = iconsConfig.systemIcons.arrows.chevronLeft;
const rightArrow: IconsNamesType = iconsConfig.systemIcons.arrows.chevronRight;

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-pagination-buttons',
]);

const buttonClasses = (active: boolean, page: string | number) => {
  return ['ui-pagination__button', {
    'ui-pagination__button--active': active,
    'ui-pagination__button--separator': typeof page === 'string',
  }];
};

const {
  pageChange,
  pagesCount,
  formatedPageNumber,
  currentPage,
  hasNext,
  hasPrev,
  gotoNextPage,
  gotoPrevPage,
} = usePagination(props, emit);

const filteredPages = computed(() => {
  const diff = props.maxVisiblePages / 2;
  const toFilterPages = [
    ...Array(pagesCount.value).keys(),
  ].slice(3, -1);

  if (toFilterPages.length > props.maxVisiblePages) {
    const diffFirst = currentPage.value - toFilterPages[0];
    const diffLast = currentPage.value - toFilterPages[toFilterPages.length - 1];

    if (diffFirst < diff) {
      return toFilterPages.slice(0, props.maxVisiblePages);
    } else if (diffLast >= -diff) {
      return toFilterPages.slice(-props.maxVisiblePages);
    } else {
      return toFilterPages.filter((page) => {
        const diffPage = currentPage.value - page;

        return diffPage < 0 ? Math.abs(diffPage) <= diff : diffPage < diff;
      });
    }
  }

  return null;
});

const pages = computed(() => {
  const fPages = filteredPages.value;
  const pages = fPages
    ? [
      fPages[0] - 1 === 2 ? 2 : '...',
      ...fPages,
      fPages[fPages.length - 1] + 1 === pagesCount.value - 1 ? pagesCount.value - 1 : '...',
    ]
    : [
      ...Array(pagesCount.value - 2).keys(),
    ].map((page) => page + 2);

  return [
    1,
    ...pages,
    pagesCount.value,
  ];
});

const buttons = computed(() => {
  return pages.value.map((page) => {
    return {
      page,
      active: page === currentPage.value,
      title: typeof page === 'number' ? formatedPageNumber(page) : page,
    };
  });
});

const onPageSelectedHandler = (value: string | number) => {
  pageChange(value as number);
};
</script>

<style scoped>
.ui-pagination-buttons {
  display: flex;
  align-items: center;
  gap: var(--pagination-spacing);
}
</style>
