<template>
  <div
    :class="classes"
    :tabindex="tabindex"
  >
    <v-node-render
      v-for="tab, i in tabs"
      :key="i"
      :vnode="tab"
      :props-data="{
        modelValue: isActiveTab(i),
        showToggleButton,
        expandIcon,
        collapseIcon,
        lazy,
        theme,
      }"
      :listeners="{
        toggle: function () { toggleTab(i, tab.componentOptions.propsData) },
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { ClassPropsType } from '../../@types/props';
import VNodeRender from '../../system/v-node-render.vue';
import { AccordionDefaultThemesType } from './interface';

// TODO: добавить управление клавиатурой

export interface UiAccordionPropsImpl {
  /** несколько аккордеонов могут быть активированы одновременно */
  multiple?: boolean;
  /** индекс активного аккордеона или массив индексов в множественном режиме */
  modelValue?: number | Array<number>;
  /** скрытые вкладки вообще не отображаются. По умолчанию установлено значение false, которое скрывает вкладки с помощью css */
  lazy?: boolean;
  /** иконка свернутого аккордеона */
  expandIcon?: IconsNamesType;
  /** иконка развернутого аккордеона */
  collapseIcon?: IconsNamesType;
  /** индекс элемента в порядке табуляции */
  tabindex?: number;
  /** отображать границы аккордеона */
  bordered?: boolean;
  /** тема аккордеона */
  theme?: AccordionDefaultThemesType;
  /** флаг отображающий кнопку скрытия/раскрытия с шевроном */
  showToggleButton?: boolean;
}

type TabType = any;

const slots = useSlots();

const props = defineProps<UiAccordionPropsImpl>();

const hasSlotContent = computed(() => slots && slots.default);

const emit = defineEmits<{
  /** событие изменения модели аккордеона */
  (e: 'update:modelValue', event: number | Array<number>): void;
}>();

const classes = computed<ClassPropsType>(() => [
  'ui-accordion',
  {
    'ui-accordion--bordered': props.bordered,
  },
]);

const isActiveTab = (index: number) => {
  if (!props.multiple) {
    return index === props.modelValue;
  } else {
    return Array.isArray(props.modelValue) && props.modelValue.includes(index);
  }
};

const toggleTab = (index: number, propsData: any) => {
  if (!Object.keys(propsData).includes('disabled')) {
    if (!props.multiple) {
      emit('update:modelValue', index === props.modelValue ? -1 : index);
    } else {
      let newValue = Array.from(props.modelValue as Array<number>);
      if (newValue.includes(index)) {
        newValue = newValue.filter((el) => el !== index);
      } else {
        newValue.push(index);
      }
      emit('update:modelValue', newValue);
    }
  }
};

const isAccordionTab = (child: TabType) => {
  return child.componentOptions?.tag === 'ui-accordion-tab';
};

const tabs = computed(() => {
  if (hasSlotContent.value && typeof slots.default === 'function') {
    return slots.default().reduce((tabs: Array<TabType>, child: TabType) => {
      if (isAccordionTab(child)) {
        tabs.push(child);
      } else if (child.children && child.children instanceof Array) {
        child.children.forEach((nestedChild: TabType) => {
          if (isAccordionTab(nestedChild)) {
            tabs.push(nestedChild);
          }
        });
      }
      return tabs;
    }, []);
  }
  return [];
});
</script>
<style>
.ui-accordion {
  position: relative;
}</style>
