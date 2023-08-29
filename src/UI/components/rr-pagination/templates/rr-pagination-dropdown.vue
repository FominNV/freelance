<template>
  <div :class="classes">
    <div class="ui-pagination-dropdown__text">{{ pageLabel }}</div>
    <ui-popover
      placement="bottom-end"
      :offsetY="4"
    >
      <template #trigger="{ toggle, isShow }">
        <button
          class="ui-pagination-dropdown__trigger"
          type="button"
          @click="toggle"
        >
          <span>{{ formatedPageNumber(modelValue) }}</span>
          <ui-icon
            :name="isShow.value ? chevronUp : chevronDown"
            size="sm"
          />
        </button>
      </template>
      <template #content="{ close }">
        <ui-popover-list
          :items="pagesList"
          v-ui-focus="true"
          v-ui-focus:delay="true"
          @select="onPageSelectedHandler($event, close)"
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
  RrPaginationPagesListItemImpl,
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
}

const props = withDefaults(defineProps<RrPaginationDropdownPropsImpl>(), {
  pageLabel: 'Страница',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'range-change', start: number, end: number): void;
}>();

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-pagination-dropdown',
]);

const iconsConfig = useConfigParam('icons') as IconsConfig;

const chevronUp = computed<IconsNamesType>(() => iconsConfig.systemIcons.arrows.chevronUp);
const chevronDown = computed<IconsNamesType>(() => iconsConfig.systemIcons.arrows.chevronDown);

const {
  pageChange,
  formatedPageNumber,
  pagesList,
} = usePagination(props, emit);

const onPageSelectedHandler = (value: RrPaginationPagesListItemImpl, closePopoverCallback: (delay?: number) => void) => {
  pageChange(value.pageNumber);
  if (typeof closePopoverCallback === 'function') {
    closePopoverCallback();
  }
};
</script>

<style scoped>
.ui-pagination-dropdown {
  --pagination-dropdown-gap: var(--spacing-2);

  --pagination-dropdown-font-size: var(--pagination-font-size);
  --pagination-dropdown-line-height: var(--pagination-line-height);
  --pagination-dropdown-font-weight: var(--pagination-font-weight);
  --pagination-dropdown-letter-spacing: var(--pagination-letter-spacing);

  --pagination-dropdown-label-text-color: var(--color-text-secondary);
  --pagination-dropdown-text-color: var(--color-text-primary);

  --pagination-dropdown-trigger-background-color: var(--color-neutral-0);
  --pagination-dropdown-trigger-background-color-hover: var(--color-neutral-200);
  --pagination-dropdown-trigger-padding: var(--spacing-0) var(--spacing-0-5);
  --pagination-dropdown-trigger-border-radius: var(--radius-sm);
  --pagination-dropdown-trigger-gap: 0 3px;

  display: flex;
  align-items: center;
  gap: 0 var(--pagination-dropdown-gap);
  font-size: var(--pagination-dropdown-font-size);
  line-height: var(--pagination-dropdown-line-height);
  font-weight: var(--pagination-dropdown-font-weight);
  letter-spacing: var(--pagination-dropdown-letter-spacing);
  color: var(--pagination-dropdown-text-color);
}

.ui-pagination-dropdown__text {
  color: var(--pagination-dropdown-label-text-color);
}

.ui-pagination-dropdown__trigger {
  cursor: pointer;
  background-color: var(--pagination-dropdown-trigger-background-color);
  padding: var(--pagination-dropdown-trigger-padding);
  border-radius: var(--pagination-dropdown-trigger-border-radius);
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  gap: var(--pagination-dropdown-trigger-gap);
}

.ui-pagination-dropdown__trigger:hover {
  background-color: var(--pagination-dropdown-trigger-background-color-hover);
}

.ui-pagination-dropdown__trigger svg {
  pointer-events: none;
}
</style>
