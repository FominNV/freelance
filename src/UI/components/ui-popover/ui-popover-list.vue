<template>
  <ui-list class="ui-popover-list" tabindex="0" hoverable pointer>
    <!-- @slot слот для вывода элементов списка -->
    <slot>
      <ui-popover-list-item
        v-for="item, index in items"
        :tab-index="index"
        :key="item.id"
        :selected="item.selected"
        @click="select(item)"
      >
        {{ item.title }}
      </ui-popover-list-item>
    </slot>
  </ui-list>
</template>

<script setup lang="ts">
import { UiPopoverListItemImpl } from './interface';
import rrPopoverListItem from './ui-popover-list-item.vue';
// TODO: Навигация клавиатурой
export interface UiPopoverListPropsImpl {
  /** максимальная высота панели */
  items?: Array<UiPopoverListItemImpl>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<UiPopoverListPropsImpl>(), {
  items: () => [],
});

const emit = defineEmits<{
  /** Событие выбора элемента списка */
  (e: 'select', value: UiPopoverListItemImpl): void;
}>();

const select = (item: UiPopoverListItemImpl) => {
  emit('select', { ...item, selected: true });
};
</script>

<style scoped>
.ui-popover-list {
  --list-gap-y: 0;
}
</style>
