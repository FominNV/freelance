<template>
  <div :class="classes">
    <!-- @slot слот для смены компонента списка табов -->
    <slot
      name="tab-items"
      :items="items"
    >
      <ui-tab-list :preset="preset">
        <ui-tab-list-item
          v-for="tab in items"
          :active="tab.id === modelValue?.id"
          :disabled="tab.disabled"
          :key="tabsKeys[tab.id]"
          :theme="preset"
          @click="emit('update:modelValue', tab)"
        >
          <!-- @slot слот для смены содержимого элемента списка табов -->
          <slot
            :name="`tab-${tab.id}`"
            :tab="tab"
          >
            {{ tab.title }}
          </slot>
        </ui-tab-list-item>
      </ui-tab-list>
    </slot>
    <!-- @slot слот для смены компонента панелей табов -->
    <slot name="tab-panels">
      <ui-tab-panels>
        <ui-tab-panels-item
          v-for="tab in items"
          :key="tabsPanelsKeys[tab.id]"
          :active="tab.id === modelValue?.id"
          :theme="preset"
        >
          <!-- @slot слот для смены содержимого панели таба -->
          <slot :name="`tab-panel-${tab.id}`" />
        </ui-tab-panels-item>
      </ui-tab-panels>
    </slot>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
} from 'vue';
import { ClassPropsType } from '../../@types/props';
import { createGuid } from '../../lib/guid';
import { ValuesOf } from '../../lib/types';
import {
  RrTabListItemImpl,
} from './interfaces';

export interface UiTabsPropsImpl {
  /** пресет табов */
  preset?: 'default' | 'stroke';
  /** список табов */
  items: RrTabListItemImpl[];
  /** активный таб */
  modelValue: RrTabListItemImpl;
}

const props = withDefaults(defineProps<UiTabsPropsImpl>(), {
  //
});

const emit = defineEmits<{
  /** Событие смены таба */
  (e: 'update:modelValue', value: RrTabListItemImpl): void;
}>();

const tabIds = props.items?.map((el) => el.id) || [];

const tabsKeys: Record<ValuesOf<typeof tabIds>, string> = {};
const tabsPanelsKeys: Record<ValuesOf<typeof tabIds>, string> = {};

tabIds.forEach((el) => {
  tabsKeys[el] = createGuid();
  tabsPanelsKeys[el] = createGuid();
});

const classes = computed<ClassPropsType>(() => [
  'ui-tabs',
  {
    [`ui-tabs--preset-${props.preset}`]: props.preset,
  },
]);

</script>
<style>
.ui-tabs {
  position: relative;
}
</style>
