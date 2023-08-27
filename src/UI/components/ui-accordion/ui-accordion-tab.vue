<template>
  <div :class="classes">
    <div
      class="ui-accordion-tab__header"
      @click.prevent="emit('toggle', $event)"
    >
      <div class="ui-accordion-tab__header-content">
        <!-- @slot слот для текста заколовка -->
        <slot
          name="header"
          :toggleIcon="toggleIcon"
        />
      </div>
      <div class="ui-accordion-tab__controls">
        <!-- @slot слот для размещения кастомных контролов -->
        <slot name="controls" />
        <button
          class="ui-accordion-tab__toggle-btn"
          type="button"
          v-if="showToggleButton"
        >
          <ui-icon :name="toggleIcon" />
        </button>
      </div>
    </div>
    <div
      class="ui-accordion-tab__body-wr"
      v-if="$slots.default"
      ref="accordionBody"
    >
      <div
        class="ui-accordion-tab__body"
        v-if="!lazy || lazy && modelValue"
      >
        <!-- @slot дефолтный слот для контента который будет отображен при раскрытом аккордеоне -->
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  useSlots,
  ref,
  onMounted,
  onUpdated,
} from 'vue';
import { ClassPropsType } from '../../@types/props';
import { AccordionDefaultThemesType } from './interface';

export interface UiAccordionTabPropsImpl {
  /** флаг аккордеона раскрыт/свернут */
  modelValue?: boolean;
  /** доступность аккордеона */
  disabled?: boolean;
  /** иконка свернутого аккордеона */
  expandIcon?: IconsNamesType;
  /** иконка развернутого аккордеона */
  collapseIcon?: IconsNamesType;
  /** скрытые вкладки вообще не отображаются. По умолчанию установлено значение false, которое скрывает вкладки с помощью css */
  lazy?: boolean;
  /** тема аккордеона */
  theme?: AccordionDefaultThemesType;
  /** флаг отображающий кнопку скрытия/раскрытия с шевроном */
  showToggleButton?: boolean;
}

const slots = useSlots();
const withTransition = ref<boolean>(false);

const props = withDefaults(defineProps<UiAccordionTabPropsImpl>(), {
  expandIcon: 'arrows/chevron-down',
  collapseIcon: 'arrows/chevron-up',
  lazy: false,
  theme: 'default',
  showToggleButton: true,
});

const emit = defineEmits<{
  /** событие раскрытия/закрытия аккордеона */
  (e: 'toggle', event: MouseEvent): void;
}>();

const classes = computed<ClassPropsType>(() => [
  'ui-accordion-tab',
  {
    [`ui-accordion-tab--theme-${props.theme}`]: props.theme,
    'ui-accordion-tab--opened': props.modelValue,
    'ui-accordion-tab--disabled': props.disabled,
    'ui-accordion-tab--with-transition': withTransition.value,
  },
]);

const toggleIcon = computed(() => {
  return props.modelValue ? props.collapseIcon : props.expandIcon;
});

const accordionBody = ref<null | HTMLElement>(null);

function setAccordionBodyHeight() {
  if (accordionBody.value) {
    accordionBody.value.style.height = props.modelValue && slots.default ? `${accordionBody.value.scrollHeight}px` : '0';
  }
}

onMounted(() => {
  setAccordionBodyHeight();
  withTransition.value = true;
});

onUpdated(() => {
  setAccordionBodyHeight();
});

</script>
<style>
.ui-accordion-tab {
  /** Default Theme */
  --accordion-default-background-color: var(--color-neutral-0);
  --accordion-default-text-color: var(--color-text-primary);
  --accordion-default-hover-background-color: var(--color-neutral-200);
  --accordion-default-hover-text-color: var(--color-text-primary);
  --accordion-default-toggle-hover-background-color: transparent;
  --accordion-default-toggle-hover-text-color: var(--color-primary-500);
  --accordion-default-disabled-background-color: var(--color-neutral-0);
  --accordion-default-disabled-text-color: var(--color-text-light);
  --accordion-default-border-width: 1px;
  --accordion-default-border-type: solid;
  --accordion-default-border-color: var(--color-neutral-300);
  --accordion-default-radius: var(--radius-lg);
  --accordion-default-shadow: var(--shadow-sm);
  --accordion-default-header-font-weight: var(--subtitle-sm-font-weight);
  --accordion-default-header-font-size: var(--subtitle-sm-font-size);
  --accordion-default-header-line-height: var(--subtitle-sm-line-height);
  --accordion-default-header-letter-spacing: var(--subtitle-sm-letter-spacing);
  --accordion-default-header-spacing-x: var(--spacing-2);
  --accordion-default-header-spacing-y: var(--spacing-1-5);
  --accordion-default-content-spacing-x: var(--spacing-2);
  --accordion-default-content-spacing-y: var(--spacing-1-5);
  --accordion-default-between-spacing: var(--spacing-1-5);

  /** Ghost Theme */
  --accordion-ghost-background-color: transparent;
  --accordion-ghost-text-color: var(--color-text-primary);
  --accordion-ghost-disabled-background-color: transparent;
  --accordion-ghost-disabled-text-color: var(--color-text-placeholder);
  --accordion-ghost-border-width: 1px;
  --accordion-ghost-border-type: solid;
  --accordion-ghost-border-color: var(--color-neutral-300);
  --accordion-ghost-radius: var(--radius-lg);
  --accordion-ghost-shadow: var(--shadow-sm);
  --accordion-ghost-header-font-weight: var(--subtitle-sm-font-weight);
  --accordion-ghost-header-font-size: var(--subtitle-sm-font-size);
  --accordion-ghost-header-line-height: var(--subtitle-sm-line-height);
  --accordion-ghost-header-letter-spacing: var(--subtitle-sm-letter-spacing);
  --accordion-ghost-header-spacing-x: var(--spacing-2);
  --accordion-ghost-header-spacing-y: var(--spacing-1-5);
  --accordion-ghost-content-spacing-x: var(--spacing-2);
  --accordion-ghost-content-spacing-y: var(--spacing-1-5);
  --accordion-ghost-between-spacing: var(--spacing-1-5);

  position: relative;
}

.ui-accordion-tab--with-transition,
.ui-accordion-tab--with-transition .ui-accordion-tab__body-wr {
  transition: background-color .2s ease, height .2s ease;
}

.ui-accordion-tab__header,
.ui-accordion-tab__header-content {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.ui-accordion-tab__controls {
  display: flex;
  align-items: center;
  gap: 0 var(--accordion-ghost-header-spacing-x);
}

.ui-accordion-tab__header {
  justify-content: space-between;
}

.ui-accordion-tab__header-content {
  width: 100%;
}

.ui-accordion-tab__body-wr {
  overflow: hidden;
}

.ui-accordion-tab--opened .ui-accordion-tab__body {
  display: block;
}

.ui-accordion-tab__toggle-btn {
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
}

.ui-accordion-tab--disabled {
  cursor: default;
  pointer-events: none;
}

/** Accordion Theme Default */

.ui-accordion-tab--theme-default {
  border: var(--accordion-default-border-width) var(--accordion-default-border-type) transparent;
  border-radius: var(--accordion-default-radius);
  background-color: var(--accordion-default-background-color);
  color: var(--accordion-default-text-color);
  box-shadow: var(--accordion-default-radius);
}

.ui-accordion-tab--theme-default:hover {
  background-color: var(--accordion-default-hover-background-color);
  color: var(--accordion-default-hover-text-color);
}

.ui-accordion-tab--theme-default.ui-accordion--bordered .ui-accordion-tab {
  border: var(--accordion-default-border-width) var(--accordion-default-border-type) var(--accordion-default-border-color);
}

.ui-accordion-tab--theme-default.ui-accordion--bordered .ui-accordion-tab--opened .ui-accordion-tab__header {
  border-bottom: var(--accordion-default-border-width) var(--accordion-default-border-type) var(--accordion-default-border-color);
}

.ui-accordion-tab--theme-default.ui-accordion-tab+.ui-accordion-tab {
  margin-top: var(--accordion-default-between-spacing);
}

.ui-accordion-tab--theme-default .ui-accordion-tab__header {
  padding: var(--accordion-default-header-spacing-y) var(--accordion-default-header-spacing-x);
}

.ui-accordion-tab--theme-default .ui-accordion-tab__body {
  padding: var(--accordion-default-content-spacing-y) var(--accordion-default-content-spacing-x);
}

.ui-accordion-tab--theme-default.ui-accordion-tab--disabled {
  background-color: var(--accordion-default-disabled-background-color);
  color: var(--accordion-default-disabled-text-color);
}

.ui-accordion-tab--theme-default.ui-accordion-tab--disabled .ui-accordion-tab__toggle-btn {
  color: var(--accordion-default-disabled-text-color);
}

.ui-accordion-tab--theme-default:not(.ui-accordion-tab--disabled) .ui-accordion-tab__toggle-btn:hover {
  background-color: var(--accordion-default-toggle-hover-background-color);
  color: var(--accordion-default-toggle-hover-text-color);
}

.ui-accordion-tab--theme-default .ui-accordion-tab__header-content {
  font-size: var(--accordion-default-header-font-size);
  line-height: var(--accordion-default-header-line-height);
  font-weight: var(--accordion-default-header-font-weight);
  letter-spacing: var(--accordion-default-header-letter-spacing);
}

/** Accordion Theme Ghost */

.ui-accordion-tab--theme-ghost {
  border: var(--accordion-ghost-border-width) var(--accordion-ghost-border-type) transparent;
  border-radius: var(--accordion-ghost-radius);
  background-color: var(--accordion-ghost-background-color);
  color: var(--accordion-ghost-text-color);
  box-shadow: var(--accordion-ghost-radius);
}

.ui-accordion-tab--theme-ghost.ui-accordion--bordered .ui-accordion-tab {
  border: var(--accordion-ghost-border-width) var(--accordion-ghost-border-type) var(--accordion-ghost-border-color);
}

.ui-accordion-tab--theme-ghost.ui-accordion--bordered .ui-accordion-tab--opened .ui-accordion-tab__header {
  border-bottom: var(--accordion-ghost-border-width) var(--accordion-ghost-border-type) var(--accordion-ghost-border-color);
}

.ui-accordion-tab--theme-ghost.ui-accordion-tab+.ui-accordion-tab {
  margin-top: var(--accordion-ghost-between-spacing);
}

.ui-accordion-tab--theme-ghost .ui-accordion-tab__header {
  padding: var(--accordion-ghost-header-spacing-y) var(--accordion-ghost-header-spacing-x);
}

.ui-accordion-tab--theme-ghost .ui-accordion-tab__body {
  padding: var(--accordion-ghost-content-spacing-y) var(--accordion-ghost-content-spacing-x);
}

.ui-accordion-tab--theme-ghost.ui-accordion-tab--disabled {
  background-color: var(--accordion-ghost-disabled-background-color);
  color: var(--accordion-ghost-disabled-text-color);
}

.ui-accordion-tab--theme-ghost.ui-accordion-tab--disabled .ui-accordion-tab__toggle-btn {
  color: var(--accordion-ghost-disabled-text-color);
}

.ui-accordion-tab--theme-ghost .ui-accordion-tab__header-content {
  font-size: var(--accordion-ghost-header-font-size);
  line-height: var(--accordion-ghost-header-line-height);
  font-weight: var(--accordion-ghost-header-font-weight);
  letter-spacing: var(--accordion-ghost-header-letter-spacing);
}
</style>
