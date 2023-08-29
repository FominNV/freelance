<template>
  <div :class="classes">
    <div class="ui-pagination-dropdown-page-size__text">{{ pageLabel }}</div>
    <ui-popover
      placement="bottom-end"
      :offsetY="4"
    >
      <template #trigger="{ toggle, isShow }">
        <button
          class="ui-pagination-dropdown-page-size__trigger"
          type="button"
          @click="toggle"
        >
          <span>{{ pageSize }}</span>
          <ui-icon
            :name="isShow.value ? chevronUp : chevronDown"
            size="sm"
          />
        </button>
      </template>
      <template #content="{ close }">
        <ui-popover-list
          :items="pageSizesList"
          v-ui-focus="true"
          v-ui-focus:delay="true"
          @select="onRangeSelectedHandler($event, close)"
        />
      </template>
    </ui-popover>
  </div>
</template>

<script setup lang="ts">
import {
  ComputedRef,
  computed,
} from 'vue';
import { ClassPropsType } from '../../../@types/props';
import {
  RrPaginationPageSizesListItemImpl,
} from '../interface';
import { usePagination } from '../usePagination';
import { useConfigParam } from '../../../lib/useConfigParam';
import { IconsConfig } from '../../../@types/icons-config';

export interface RrPaginationDropdownPropsImpl {
  /** текст надписи */
  pageLabel?: string;
  /** общее количество записей */
  total: number;
  /** количество записей на странице */
  pageSize: number;
  /** текущая страница */
  modelValue: number;
  /** Массив возможных вариантов кол-ва элементов на странице */
  pageSizes?: number[];
}

const props = withDefaults(defineProps<RrPaginationDropdownPropsImpl>(), {
  pageLabel: 'Записей на странице',
  pageSizes: () => [25, 50, 100],
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'range-change', start: number, end: number): void;
  (e: 'update:pageSize', pageSize: number): void;
}>();

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-pagination-dropdown-page-size',
]);

const iconsConfig = useConfigParam('icons') as IconsConfig;

const chevronUp = computed<IconsNamesType>(() => iconsConfig.systemIcons.arrows.chevronUp);
const chevronDown = computed<IconsNamesType>(() => iconsConfig.systemIcons.arrows.chevronDown);

const {
  rangeChange,
  pageSizesList,
} = usePagination(props, emit);

const onRangeSelectedHandler = (value: RrPaginationPageSizesListItemImpl, closePopoverCallback: (delay?: number) => void) => {
  rangeChange();
  emit('update:pageSize', value.pageSize);
  if (typeof closePopoverCallback === 'function') {
    closePopoverCallback();
  }
};
</script>

<style scoped>
.ui-pagination-dropdown-page-size {
  --pagination-dropdown-page-size-gap: var(--spacing-2);

  --pagination-dropdown-page-size-font-size: var(--pagination-font-size);
  --pagination-dropdown-page-size-line-height: var(--pagination-line-height);
  --pagination-dropdown-page-size-font-weight: var(--pagination-font-weight);
  --pagination-dropdown-page-size-letter-spacing: var(--pagination-letter-spacing);

  --pagination-dropdown-page-size-label-text-color: var(--color-text-secondary);
  --pagination-dropdown-page-size-text-color: var(--color-text-primary);

  --pagination-dropdown-page-size-trigger-background-color: var(--color-neutral-0);
  --pagination-dropdown-page-size-trigger-background-color-hover: var(--color-neutral-200);
  --pagination-dropdown-page-size-trigger-padding: var(--spacing-0) var(--spacing-0-5);
  --pagination-dropdown-page-size-trigger-border-radius: var(--radius-sm);
  --pagination-dropdown-page-size-trigger-gap: 0 3px;

  display: flex;
  align-items: center;
  gap: 0 var(--pagination-dropdown-page-size-gap);
  font-size: var(--pagination-dropdown-page-size-font-size);
  line-height: var(--pagination-dropdown-page-size-line-height);
  font-weight: var(--pagination-dropdown-page-size-font-weight);
  letter-spacing: var(--pagination-dropdown-page-size-letter-spacing);
  color: var(--pagination-dropdown-page-size-text-color);
}

.ui-pagination-dropdown-page-size__text {
  color: var(--pagination-dropdown-page-size-label-text-color);
}

.ui-pagination-dropdown-page-size__trigger {
  cursor: pointer;
  background-color: var(--pagination-dropdown-page-size-trigger-background-color);
  padding: var(--pagination-dropdown-page-size-trigger-padding);
  border-radius: var(--pagination-dropdown-page-size-trigger-border-radius);
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  gap: var(--pagination-dropdown-page-size-trigger-gap);
}

.ui-pagination-dropdown-page-size__trigger:hover {
  background-color: var(--pagination-dropdown-page-size-trigger-background-color-hover);
}

.ui-pagination-dropdown-page-size__trigger svg {
  pointer-events: none;
}
</style>
