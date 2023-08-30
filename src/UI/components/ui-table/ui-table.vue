<template>
  <ve-table
    ref="tbl"
    :max-height="maxHeight"
    :class="classes"
    :columns="preparedColumns"
    :table-data="items"
    :scroll-width="scrollWidth"
    :column-hidden-option="columnHiddenOption"
    :fixed-header="fixedHeader"
    :show-header="showHeader"
    :checkbox-option="checkOption"
    :radio-option="radioOption"
    :row-key-field-name="rowKeyFieldName"
    :cellSelectionOption="cellSelectionOption"
    :rowStyleOption="rowStyleOption"
    :cell-style-option="cellStyleOption"
    :virtual-scroll-option="virtualScrollOption"
    :event-custom-option="eventCustomOption"
    :contextmenu-body-option="contextmenuBodyOption"
    :expand-option="expandOption"
    :border-around="borderAround"
    :border-x="borderX"
    :border-y="borderY"
    locale="ru"
  />
</template>

<script setup lang="ts">
import {
  ref,
  useSlots,
  computed,
  onMounted,
  watch,
} from 'vue';
import { VeTable } from 'vue-easytable';
import 'vue-easytable/libs/theme-default/index.css';
import {
  UiTableColumnImpl,
  UiTableCellStylePropImpl,
  UiTableChangeSelectionEventImpl,
  UiTableComtextMenuItemImpl,
} from './interface';
import { ClassPropsType } from '../../@types/props';

export interface UiTablePropsImpl {
  /** высота ячейки */
  cellHeight?: number | string;
  /**
   * максимальная высота таблицы.
   * необходимо ее указывать если требуется зафиксировать заголовок таблицы
   */
  maxHeight?: number | string;
  /** ширина горизонтального скролла */
  scrollWidth?: number | string;
  /** список колонок таблицы */
  columns: UiTableColumnImpl[];
  /** список элементов таблицы */
  items: unknown[];
  /**
   * тема таблицы. параметр отвечает за внешний вид таблицы.
   * если нужно добавить еще одну тему таблицы, то задаем данному
   * параметру значение = <имя-темы> и описываем стили для данной
   * темы отталкиваясь от класса ```.ui-table--<имя-темы>```
   */
  theme?: string;
  /** включить возможность выделения ячеек */
  cellSelection?: boolean;
  /** подсветка выбранной строки (по которой был совершен клик) */
  clickHighlight?: boolean;
  /** включить ховер строк */
  hoverHighlight?: boolean;
  /** cursor:pointer при наведении на строку */
  pointer?: boolean;
  /** включить виртуальный скрол */
  virtualScroll?: boolean;
  /** параметр для кастомизации ячейки */
  cellStyle?: UiTableCellStylePropImpl;
  /** список стоблцов которые необходимо скрыть */
  hiddenColumns?: string[];
  /** список строк которые необходимо отметить checkbox/radio */
  defaultSelectedRowKeys?: string[];
  /** список строк у которых необходимо отключить checkbox/radio */
  disableSelectedRowKeys?: string[];
  /** внешяя граница */
  borderAround?: boolean;
  /** горизонтальная граница */
  borderX?: boolean;
  /** вертикальная граница */
  borderY?: boolean;
  /** размеры отступов таблицы */
  size?: 'xs' | 'sm' | 'md';
  /** высота строки (если параметр не auto, то лишний текст обрезается) */
  rowHeight?: 'auto' | 'sm' | 'md' | 'lg' | 'xl';
  /** показать заголовок таблицы */
  showHeader?: boolean;
  /** зафиксировать заголовок таблицы при скроле */
  fixedHeader?: boolean;
  /**
   * параметры конетекстного меню таблицы, которо будет показано
   * при клике правой кнопкой мыши по строке
   */
  contextMenu?: Array<UiTableComtextMenuItemImpl>;
  /** включить возможность раскрытия строки для отображения дополнительного контента */
  expandRow?: boolean;
  /** Свойство элемента таблицы для идентификации при выборе элемента с помощью чекбокса/радио */
  rowKeyFieldName?: string;
}

const emit = defineEmits<{
  /** клик по строке */
  (e: 'row-click', row: any): void;
  /** клик по ячейке */
  (e: 'cell-click', row: any, column: UiTableColumnImpl): void;
  /** смена состояния checkbox/radio */
  (e: 'change:selection', event: UiTableChangeSelectionEventImpl): void;
  /** событие перед открытием контекстного меню */
  (e: 'menu:beforeshow', event: { isWholeColSelection: boolean, selectionRangeKeys: Array<string>, selectionRangeIndexes: Array<number> }): void;
  /** событие при выборе пункта контекстного меню */
  (e: 'menu:item-click', event: { type: string, selectionRangeKeys: Array<string>, selectionRangeIndexes: Array<number> }): void;
  /** событие, срабатывающее при открытии/закрытии строки */
  (e: 'row:toggle', event: { row: any, rowIndex: number, toggle: () => void, expand: () => void, collapse: () => void }): void;
}>();

const slots = useSlots();
const tbl = ref<any | null>(null);

const props = withDefaults(defineProps<UiTablePropsImpl>(), {
  cellHeight: 44,
  columns: () => [],
  items: () => [],
  theme: 'default-view',
  cellSelection: false,
  clickHighlight: false,
  hoverHighlight: false,
  virtualScroll: false,
  hiddenColumns: () => [],
  defaultSelectedRowKeys: () => [],
  disableSelectedRowKeys: () => [],
  borderAround: false,
  borderX: true,
  borderY: false,
  showHeader: true,
  fixedHeader: false,
  rowKeyFieldName: 'id',
  size: 'sm',
  rowHeight: 'auto',
  pointer: false,
});

const tableHeader = {
  height: 0,
};

watch(() => props.columns, () => {
  const header = tbl.value.$el.querySelector('.ve-table-header');
  tableHeader.height = header?.offsetHeight || 0;
});

const preparedColumns = computed<UiTableColumnImpl[]>(() => {
  return props.columns.map((col) => ({
    ...col,
    // TODO: Типизировать any
    renderBodyCell: ({ row, column, rowIndex }: any, h: any) => {
      const cellSlot = slots[`cell(${column.field})`];

      if (props.rowHeight === 'auto') {
        if (cellSlot) {
          return cellSlot({ row, column, rowIndex });
        }
        return h('span', { class: 'ui-paragraph--xs' }, row[column.field]);
      }

      if (cellSlot) {
        return h('div', { class: 'ui-table-cell' }, cellSlot({ row, column, rowIndex }));
      } else if (column.field !== 'checkbox' && column.field !== 'radio' && column.type !== 'expand') {
        return h('div', { class: 'ui-table-cell' }, [h('span', { class: 'ui-paragraph--xs' }, row[column.field])]);
      }
    },
    // TODO: Типизировать any
    renderHeaderCell: ({ column }: any, h: any) => {
      const cellSlot = slots[`column(${column.field})`];

      if (props.rowHeight === 'auto') {
        if (cellSlot) {
          return cellSlot({ column });
        }
        return h('span', { class: 'ui-subtitle--xs' }, [column.title]);
      }

      if (cellSlot) {
        return h('div', { class: 'ui-table-header-cell' }, cellSlot({ column }));
      } else if (column.field !== 'checkbox') {
        return h('div', { class: 'ui-table-header-cell' }, [h('span', { class: 'ui-subtitle--xs' }, [column.title])]);
      }
    },
  }));
});

const contextmenuBodyOption = computed<object>(() => {
  return props.expandRow ? {
    beforeShow: ({ isWholeColSelection, selectionRangeKeys, selectionRangeIndexes }: any) => {
      emit('menu:beforeshow', {
        isWholeColSelection,
        selectionRangeKeys,
        selectionRangeIndexes,
      });
    },
    afterMenuClick: ({ type, selectionRangeKeys, selectionRangeIndexes }: any) => {
      // FIXME: Не пробрасывается эвент
      emit('menu:item-click', {
        type,
        selectionRangeKeys,
        selectionRangeIndexes,
      });
    },
    contextmenus: Array.isArray(props.contextMenu) && Array.from(props.contextMenu),
  } : {};
});

const eventCustomOption = computed<object>(() => {
  return {
    bodyRowEvents: ({ row }: any) => {
      return {
        click: (event: any) => {
          if (!event.target.classList.contains('ve-checkbox-input')) {
            emit('row-click', row);
          }
        },
        // dblclick: (event) => {},
        // contextmenu: (event) => {},
        // mouseenter: (event) => {},
        // mouseleave: (event) => {},
        // mousemove: (event) => {},
        // mouseover: (event) => {},
        // mousedown: (event) => {},
        // mouseup: (event) => {},
      };
    },
    bodyCellEvents: ({ row, column }: any) => {
      return {
        click: () => { emit('cell-click', row, column); },
        // dblclick: (event) => { },
        // contextmenu: (event) => { },
        // mouseenter: (event) => { },
        // mouseleave: (event) => { },
        // mousemove: (event) => { },
        // mouseover: (event) => { },
        // mousedown: (event) => { },
        // mouseup: (event) => { },
      };
    },
  };
});

const cellStyleOption = computed<UiTableCellStylePropImpl | null>(() => {
  if (props.cellStyle) {
    return {
      ...props.cellStyle,
    };
  }
  return null;
});

const cellSelectionOption = computed<object>(() => ({ enable: props.cellSelection }));
const columnHiddenOption = computed<object>(() => ({ defaultHiddenColumnKeys: props.hiddenColumns }));
const virtualScrollOption = computed<object>(() => ({ enable: props.virtualScroll }));
const rowStyleOption = computed<object>(() => ({
  clickHighlight: props.clickHighlight,
  hoverHighlight: props.hoverHighlight,
}));
const expandedRowKeys = ref<string[]>([]);

// TODO: Подумать над тем как раскрывать строку без кнопки раскрытия
const expandOption = computed(() => ({
  trigger: 'row',
  expandedRowKeys: expandedRowKeys.value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({ row, column, rowIndex }: any, h: any) => {
    const cellSlot = slots['expand-row-content'];
    if (cellSlot) {
      return cellSlot({ column, row, rowIndex });
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeExpandRowChange: ({ beforeExpandedRowKeys, row, rowIndex }: { beforeExpandedRowKeys: string[], row: any, rowIndex: number }) => {
    const index: number = expandedRowKeys.value.indexOf(row[props.rowKeyFieldName]);
    const isExpanded: boolean = index > -1;
    const expand = (): void => { !isExpanded ? expandedRowKeys.value.push(row[props.rowKeyFieldName]) : undefined; };
    const collapse = (): void => { isExpanded ? expandedRowKeys.value.splice(index, 1) : undefined; };
    const toggle = (): void => (isExpanded ? collapse() : expand());

    emit('row:toggle', {
      row,
      rowIndex,
      expand,
      collapse,
      toggle,
    });
  },
}));

const checkOption = computed<object>(() => {
  return {
    disableSelectedRowKeys: props.disableSelectedRowKeys,
    defaultSelectedRowKeys: props.defaultSelectedRowKeys,
    selectedRowChange: ({ row, isSelected }: { row: any, isSelected: boolean }) => {
      emit('change:selection', { row, isSelected });
    },
    selectedAllChange: ({ isSelected, selectedRowKeys }: { isSelected: boolean, selectedRowKeys: Array<string> }) => {
      if (!isSelected) {
        selectedRowKeys = props.items.map((row: any) => row[props.rowKeyFieldName]);
      }
      selectedRowKeys.forEach((key) => {
        const row = props.items.find((el: any) => el[props.rowKeyFieldName] === key);
        emit('change:selection', { row, isSelected });
      });
    },
  };
});

const radioOption = computed<object>(() => {
  return {
    selectedRowChange: ({ row }: { row: any }) => {
      emit('change:selection', { row });
    },
  };
});

onMounted(() => {
  tbl.value.scrollBarWidth = 6;
});

const classes = computed<ClassPropsType>(() => {
  return [
    'ui-table',
    {
      [`ui-table--${props.theme}`]: props.theme,
      [`ui-table--size-${props.rowHeight !== 'auto' ? 'xs' : props.size}`]: props.size,
      [`ui-table--row-height-${props.rowHeight}`]: props.rowHeight,
      'ui-table--pointer': props.pointer,
    },
  ];
});
</script>
<style>
.ve-radio,
.ve-checkbox {
  margin: 0;
}

.ve-contextmenu-popper {
  box-shadow: var(--shadow-sm);
  border-color: var(--color-neutral-200);
  border-radius: var(--radius-sm);
}

.ve-contextmenu-panel .ve-contextmenu-list .ve-contextmenu-node {
  padding-left: 12px;
  padding-right: 12px;
}

.ve-contextmenu-panel .ve-contextmenu-list .ve-contextmenu-node:not(.ve-contextmenu-panel .ve-contextmenu-list .ve-contextmenu-node-disabled):hover {
  background-color: var(--color-primary-50);
  color: var(--color-primary-500);
}

.ui-table {
  /** table checkbox */

  --table-checkbox-border: 1px solid var(--checkbox-default-border, #DFE1E7);
  --table-checkbox-size: var(--checkbox-sm-size, 16px);
  --table-checkbox-radius: var(--checkbox-border-radius, 4px);
  --table-checkbox-border-color-hover: var(--checkbox-background-hover);
  --table-checkbox-border-color-checked: var(--checkbox-background);
  --table-checkbox-border-color-disabled: var(--checkbox-disabled-border-color);
  --table-checkbox-background-color: transparent;
  --table-checkbox-background-color-checked: var(--checkbox-background);
  --table-checkbox-background-color-checked-hover: var(--checkbox-background-hover);
  --table-checkbox-background-color-checked-disabled: var(--checkbox-disabled-checked-background);
  --table-checkbox-background-color-disabled: var(--checkbox-disabled-background);
  --table-checkbox-indeterminate-after-width: calc(var(--table-checkbox-size) / 2);
  --table-checkbox-indeterminate-after-height: calc(var(--table-checkbox-size) / 100 * 10);
  --table-checkbox-indeterminate-after-background-color: var(--color-neutral-0);
  --table-checkbox-indeterminate-size: var(--checkbox-sm-indeterminate-size);

  --table-checkbox-after-width: 30.5%;
  --table-checkbox-after-height: 60%;
  --table-checkbox-after-top: 15.25%;
  --table-checkbox-after-left: 36.75%;

  /** table radio */

  --table-radio-size: var(--radio-sm-size, 16px);
  --table-radio-border: 1px solid var(--radio-border-color, #DFE1E7);
  --table-radio-hover-border-color: var(--radio-border-color-hover);
  --table-radio-background-color: transparent;
  --table-radio-checked-background-color: var(--radio-background);
  --table-radio-checked-background-color-hover: var(--radio-background-hover);
  --table-radio-checked-background-color-after: var(--radio-pseudo-after-color);
  --table-radio-checked-after-width: calc(var(--table-radio-size) / 2);
  --table-radio-checked-after-height: calc(var(--table-radio-size) / 2);

  /** table scroll */

  --table-scroll-size: var(--scrollbar-lg-size);
  --table-scroll-track-background: var(--scrollbar-track-bg-color);
  --table-scroll-thumb-background: var(--scrollbar-thumb-bg-color);
  --table-scroll-thumb-hover-background: var(--scrollbar-thumb-hover-bg-color);

  /** theme default */

  --table-default-view-border: none;
  --table-default-view-row-outer-border: 1px solid var(--color-neutral-200);
  --table-default-view-row-inner-border: 1px solid var(--color-neutral-200);

  --table-default-view-header-cell-background-color: transparent;
  --table-default-view-header-cell-text-color: var(--color-text-placeholder);

  --table-default-view-header-cell-xs-spacing-x: var(--spacing-1-5);
  --table-default-view-header-cell-xs-spacing-y: var(--spacing-0-5);

  --table-default-view-header-cell-sm-spacing-x: var(--spacing-1-5);
  --table-default-view-header-cell-sm-spacing-y: var(--spacing-1);

  --table-default-view-header-cell-md-spacing-x: var(--spacing-1-5);
  --table-default-view-header-cell-md-spacing-y: var(--spacing-1-5);

  --table-default-view-header-cell-row-height-sm-height: 28px;
  --table-default-view-header-cell-row-height-sm-clamp: 1;

  --table-default-view-header-cell-row-height-md-height: 40px;
  --table-default-view-header-cell-row-height-md-clamp: 1;

  --table-default-view-header-cell-row-height-lg-height: 48px;
  --table-default-view-header-cell-row-height-lg-clamp: 2;

  --table-default-view-header-cell-row-height-xl-height: 62px;
  --table-default-view-header-cell-row-height-xl-clamp: 3;

  --table-default-view-header-font-size: var(--subtitle-xs-font-size);
  --table-default-view-header-line-height: var(--subtitle-xs-line-height);
  --table-default-view-header-font-weight: var(--subtitle-xs-font-weight);
  --table-default-view-header-letter-spacing: var(--subtitle-xs-letter-spacing);
  --table-default-view-header-text-transform: none;

  --table-default-view-cell-xs-spacing-x: var(--spacing-1-5);
  --table-default-view-cell-xs-spacing-y: var(--spacing-0-5);

  --table-default-view-cell-sm-spacing-x: var(--spacing-1-5);
  --table-default-view-cell-sm-spacing-y: var(--spacing-1);

  --table-default-view-cell-md-spacing-x: var(--spacing-1-5);
  --table-default-view-cell-md-spacing-y: var(--spacing-1-5);

  --table-default-view-cell-row-height-sm-height: 28px;
  --table-default-view-cell-row-height-sm-clamp: 1;

  --table-default-view-cell-row-height-md-height: 40px;
  --table-default-view-cell-row-height-md-clamp: 1;

  --table-default-view-cell-row-height-lg-height: 48px;
  --table-default-view-cell-row-height-lg-clamp: 2;

  --table-default-view-cell-row-height-xl-height: 62px;
  --table-default-view-cell-row-height-xl-clamp: 3;

  --table-default-view-cell-radius: var(--radius-lg);
  --table-default-view-cell-background-color: var(--color-neutral-0);
  --table-default-view-cell-hover-background-color: var(--color-neutral-100);
  --table-default-view-cell-text-color: var(--color-text-primary);
  --table-default-view-cell-height: auto;

  --table-default-view-cell-font-size: var(--paragraph-xs-font-size);
  --table-default-view-cell-line-height: var(--paragraph-xs-line-height);
  --table-default-view-cell-font-weight: var(--paragraph-xs-font-weight);
  --table-default-view-cell-letter-spacing: var(--paragraph-xs-letter-spacing);

  --table-default-view-fixed-column-shadow: 7px 0px 10px 0px rgba(31, 36, 43, 0.1);
  --table-default-view-fixed-column-shadow-width: 10px;
  --table-default-view-first-cell-border: 7px solid transparent;

  --table-default-view-shadow: -3px 0px 20px rgba(0, 0, 0, 0.1);

  /** theme list-view */

  --table-list-view-border: none;
  --table-list-view-row-outer-border: none;
  --table-list-view-row-inner-border: 1px solid var(--color-neutral-200);

  --table-list-view-header-cell-background-color: transparent;
  --table-list-view-header-cell-text-color: var(--color-text-placeholder);

  --table-list-view-header-cell-xs-spacing-x: var(--spacing-1-5);
  --table-list-view-header-cell-xs-spacing-y: var(--spacing-0-5);

  --table-list-view-header-cell-sm-spacing-x: var(--spacing-1-5);
  --table-list-view-header-cell-sm-spacing-y: var(--spacing-1);

  --table-list-view-header-cell-md-spacing-x: var(--spacing-1-5);
  --table-list-view-header-cell-md-spacing-y: var(--spacing-1-5);

  --table-list-view-header-cell-row-height-sm-height: 28px;
  --table-list-view-header-cell-row-height-sm-clamp: 1;

  --table-list-view-header-cell-row-height-md-height: 40px;
  --table-list-view-header-cell-row-height-md-clamp: 1;

  --table-list-view-header-cell-row-height-lg-height: 48px;
  --table-list-view-header-cell-row-height-lg-clamp: 2;

  --table-list-view-header-cell-row-height-xl-height: 62px;
  --table-list-view-header-cell-row-height-xl-clamp: 3;

  --table-list-view-header-font-size: var(--subtitle-xs-font-size);
  --table-list-view-header-line-height: var(--subtitle-xs-line-height);
  --table-list-view-header-font-weight: var(--subtitle-xs-font-weight);
  --table-list-view-header-letter-spacing: var(--subtitle-xs-letter-spacing);
  --table-list-view-header-text-transform: none;

  --table-list-view-cell-xs-spacing-x: var(--spacing-1-5);
  --table-list-view-cell-xs-spacing-y: var(--spacing-0-5);

  --table-list-view-cell-sm-spacing-x: var(--spacing-1-5);
  --table-list-view-cell-sm-spacing-y: var(--spacing-1);

  --table-list-view-cell-md-spacing-x: var(--spacing-1-5);
  --table-list-view-cell-md-spacing-y: var(--spacing-1-5);

  --table-list-view-cell-row-height-sm-height: 28px;
  --table-list-view-cell-row-height-sm-clamp: 1;

  --table-list-view-cell-row-height-md-height: 40px;
  --table-list-view-cell-row-height-md-clamp: 1;

  --table-list-view-cell-row-height-lg-height: 48px;
  --table-list-view-cell-row-height-lg-clamp: 2;

  --table-list-view-cell-row-height-xl-height: 62px;
  --table-list-view-cell-row-height-xl-clamp: 3;

  --table-list-view-cell-radius: var(--radius-lg);
  --table-list-view-cell-background-color: var(--color-neutral-0);
  --table-list-view-cell-hover-background-color: var(--color-neutral-100);
  --table-list-view-cell-text-color: var(--color-text-primary);
  --table-list-view-cell-height: auto;

  --table-list-view-cell-font-size: var(--paragraph-xs-font-size);
  --table-list-view-cell-line-height: var(--paragraph-xs-line-height);
  --table-list-view-cell-font-weight: var(--paragraph-xs-font-weight);
  --table-list-view-cell-letter-spacing: var(--paragraph-xs-letter-spacing);

  --table-list-view-fixed-column-shadow: 7px 0px 10px 0px rgba(31, 36, 43, 0.1);
  --table-list-view-fixed-column-shadow-width: 10px;
  overflow: visible;
  z-index: 4;
  width: 100%;
}

.ui-table--pointer.ui-table td {
  cursor: pointer;
}

/** Scrollbar styles */
.ui-table .ve-table-container {
  scrollbar-face-color: var(--table-scroll-thumb-background);
  scrollbar-track-color: var(--table-scroll-track-background);
  scrollbar-color: var(--table-scroll-thumb-background) var(--table-scroll-track-background);
}

.ui-table .ve-table-container::-webkit-scrollbar {
  width: var(--table-scroll-size);
}

.ui-table .ve-table-container::-webkit-scrollbar:horizontal {
  height: var(--table-scroll-size);
  width: auto;
}

.ui-table .ve-table-container::-webkit-scrollbar-corner {
  display: none;
}

.ui-table .ve-table-container::-webkit-scrollbar-track {
  background-color: var(--table-scroll-track-background);
  border-radius: var(--table-scroll-size);
}

.ui-table .ve-table-container::-webkit-scrollbar-thumb {
  background-color: var(--table-scroll-thumb-background);
  transition: background 0.2s;
  border-radius: var(--table-scroll-size);
}

.ui-table .ve-table-container::-webkit-scrollbar-thumb:hover {
  background-color: var(--table-scroll-thumb-hover-background);
}

/** RadioButton Styles */

.ui-table .ve-radio {
  line-height: 1;
}

.ui-table .ve-radio .ve-radio-container {
  top: 0;
}

.ui-table .ve-radio .ve-radio-container .ve-radio-inner {
  width: var(--table-radio-size);
  height: var(--table-radio-size);
  border: var(--table-checkbox-border);
  background-color: var(--table-checkbox-background-color);
}

.ui-table .ve-radio .ve-radio-checked:hover .ve-radio-inner {
  background-color: var(--table-radio-checked-background-color-hover);
}

.ui-table .ve-radio .ve-radio-container:hover .ve-radio-inner {
  border-color: var(--table-radio-hover-border-color);
}

.ve-radio .ve-radio-container .ve-radio-inner:after {
  width: var(--table-radio-checked-after-width);
  height: var(--table-radio-checked-after-height);
  background-color: var(--table-radio-checked-background-color-after);
}

.ve-radio .ve-radio-container.ve-radio-checked .ve-radio-inner {
  border-color: var(--table-checkbox-border-color-checked);
  background-color: var(--table-radio-checked-background-color);
}

/** Checkbox Styles */
.ui-table .ve-checkbox-content .ve-checkbox-inner {
  width: var(--table-checkbox-size);
  height: var(--table-checkbox-size);
  border-radius: var(--table-checkbox-radius);
  border: var(--table-checkbox-border);
  background-color: var(--table-checkbox-background-color);
}

.ui-table .ve-checkbox .ve-checkbox-checked .ve-checkbox-inner,
.ui-table .ve-checkbox .ve-checkbox-indeterminate .ve-checkbox-inner {
  border-color: var(--table-checkbox-border-color-checked);
  background-color: var(--table-checkbox-background-color-checked);
}

.ui-table .ve-checkbox-content:hover .ve-checkbox-inner {
  border-color: var(--table-checkbox-border-color-hover);
}

.ui-table .ve-checkbox .ve-checkbox-checked:hover .ve-checkbox-inner,
.ui-table .ve-checkbox .ve-checkbox-indeterminate:hover .ve-checkbox-inner {
  background-color: var(--table-checkbox-background-color-checked-hover);
}

.ui-table .ve-checkbox-content .ve-checkbox-inner:after {
  display: block;
  left: var(--table-checkbox-after-left);
  top: var(--table-checkbox-after-top);
  width: var(--table-checkbox-after-width);
  height: var(--table-checkbox-after-height);
  border-width: 1px;
}

.ui-table .ve-checkbox .ve-checkbox-indeterminate .ve-checkbox-inner {
  border-color: var(--table-checkbox-border-color-checked);
  position: relative;
}

.ui-table .ve-checkbox .ve-checkbox-indeterminate:is(:not(.ve-checkbox-checked)) .ve-checkbox-inner::after {
  content: "";
  display: block;
  position: absolute;
  transform: none;
  background-color: #fff;
  width: 60%;
  height: 1px;
  top: 50%;
  left: 22%;
  border-radius: 50px;
}

.ui-table .ve-checkbox .ve-checkbox-indeterminate:hover .ve-checkbox-inner::before {
  background-color: var(--table-checkbox-background-color-checked-hover);
}

.ui-table .ve-checkbox .ve-checkbox-indeterminate:hover .ve-checkbox-inner {
  border-color: var(--table-checkbox-border-color-hover);
}

.ui-table .ve-checkbox .ve-checkbox-checked .ve-checkbox-inner:after {
  display: block;
  transform: rotate(45deg) scale(1);
  position: absolute;
  display: table;
  border: 1px solid #fff;
  border-top: 0;
  border-left: 0;
  content: " ";
  transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
  background-color: transparent;
}

.ui-table .ve-checkbox .ve-checkbox-disabled .ve-checkbox-inner {
  cursor: not-allowed;
  border-color: var(--table-checkbox-border-color-disabled) !important;
  background-color: var(--table-checkbox-background-color-disabled);
}

.ui-table .ve-checkbox .ve-checkbox-disabled.ve-checkbox-checked .ve-checkbox-inner,
.ui-table .ve-checkbox .ve-checkbox-disabled:is(.ve-checkbox-checked:hover) .ve-checkbox-inner {
  background-color: var(--table-checkbox-background-color-checked-disabled);

}

/** Table styles */

.ui-table .ve-table-body-td {
  vertical-align: middle;
}

.ui-table-header-cell,
.ui-table-cell {
  overflow: hidden;
  display: inline-flex;
  align-items: center;
}

.ui-table-header-cell>*,
.ui-table-cell>* {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-box-pack: center;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body .ve-table-body-tr .ve-table-body-td .ve-table-row-expand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/** Default View */

.ui-table--default-view>.ve-table:not(.ve-table-border-around) .ve-table-container .ve-table-border-y th {
  border-right: none;
}

.ui-table--default-view>.ve-table {
  border: var(--table-default-view-border);
}

.ui-table--default-view>.ve-table .ve-table-container .ve-table-border-x th {
  border-bottom: none;
}

.ui-table--default-view>.ve-table:not(.ve-table-border-around) .ve-table-container .ve-table-border-x tr:first-child>th,
.ui-table--default-view>.ve-table:not(.ve-table-border-around) .ve-table-container .ve-table-border-x tr.ve-table-footer-tr:first-child>td {
  border-top: none;
}

.ui-table--default-view>.ve-table .ve-table-container.ve-table-container-right-scrolling .ve-table-first-right-fixed-column,
.ui-table--default-view>.ve-table:not(.ve-table-border-around) .ve-table-container .ve-table-border-y th:first-child {
  border-left: none;
}

.ui-table--default-view>.ve-table .ve-table-container th {
  vertical-align: bottom;
}

.ui-table--default-view>.ve-table.ve-table-border-around .ve-table-container .ve-table-border-y th:first-child {
  border-top-left-radius: var(--table-default-view-cell-radius);
}

.ui-table--default-view>.ve-table.ve-table-border-around .ve-table-container .ve-table-border-y th:last-child {
  border-top-right-radius: var(--table-default-view-cell-radius);
}

.ui-table--default-view>.ve-table .ve-table-container table.ve-table-content.ve-table-border-x tr:nth-child(2)>td {
  border-top: var(--table-default-view-row-outer-border);
}

.ui-table--default-view>.ve-table .ve-table-container .ve-table-border-x td {
  border-bottom: var(--table-default-view-row-inner-border);
}

.ui-table--default-view>.ve-table .ve-table-container table.ve-table-content.ve-table-border-x:not(.ve-table-border-around) tr:last-child>td {
  border-bottom: var(--table-default-view-row-outer-border);
}

.ui-table--default-view>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr,
.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-expand-tr {
  height: var(--table-default-view-cell-height);
}

.ui-table--default-view>.ve-table:not(.ve-table-border-around) .ve-table-container table.ve-table-content tr:nth-child(2)>td:first-child {
  border-top-left-radius: var(--table-default-view-cell-radius);
  position: relative;
}

.ui-table--default-view>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td {
  overflow: visible;
}

.ui-table--default-view>.ve-table:not(.ve-table-border-around) .ve-table-container table.ve-table-content tr:nth-child(2)>td:first-child {
  box-shadow: -1px -3px 0px 0px var(--table-default-view-header-cell-background-color);
}

.ui-table--default-view>.ve-table:not(.ve-table-border-around) .ve-table-container table.ve-table-content tr:last-child>td:first-child {
  box-shadow: -1px 3px 0px 0px var(--table-default-view-header-cell-background-color);
}

.ui-table--default-view>.ve-table:not(.ve-table-border-around) .ve-table-container table.ve-table-content tr:nth-child(2)>td:last-child {
  border-top-right-radius: var(--table-default-view-cell-radius);
}

.ui-table--default-view>.ve-table .ve-table-container table.ve-table-content tr:last-child>td:first-child {
  border-bottom-left-radius: var(--table-default-view-cell-radius);
}

.ui-table--default-view>.ve-table .ve-table-container table.ve-table-content tr:last-child>td:last-child {
  border-bottom-right-radius: var(--table-default-view-cell-radius);
}

.ui-table--default-view>.ve-table.ve-table-border-around .ve-table-container table.ve-table-content.ve-table-border-x tr:first-child>th {
  border-top: var(--table-default-view-row-outer-border);
}

.ui-table--default-view>.ve-table.ve-table-border-around .ve-table-container table.ve-table-content.ve-table-border-y th:first-child {
  border-left: var(--table-default-view-row-outer-border);
}

.ui-table--default-view>.ve-table.ve-table-border-around .ve-table-container table.ve-table-content.ve-table-border-y th.ve-table-last-column {
  border-right: var(--table-default-view-row-outer-border);
}

.ui-table--default-view>.ve-table .ve-table-container .ve-table-border-x td {
  background-color: var(--table-default-view-cell-background-color);
  color: var(--table-default-view-cell-text-color);
  font-size: var(--table-default-view-cell-font-size);
  line-height: var(--table-default-view-cell-line-height);
  font-weight: var(--table-default-view-cell-font-weight);
  letter-spacing: var(--table-default-view-cell-letter-spacing);
  text-transform: var(--table-default-view-cell-text-transform);
}

.ui-table--default-view>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body.ve-table-row-hover tr.ve-table-body-tr:hover td {
  background-color: var(--table-default-view-cell-hover-background-color);
}

.ui-table--default-view>.ve-table .ve-table-container .ve-table-border-x td:first-child {
  border-left: var(--table-default-view-row-outer-border);
}

.ui-table--default-view>.ve-table.ve-table-border-around .ve-table-container table.ve-table-content.ve-table-border-y td:first-child {
  border-left: var(--table-default-view-row-inner-border);
}

.ui-table--default-view>.ve-table .ve-table-container .ve-table-border-x td:last-child {
  border-right: var(--table-default-view-row-outer-border);
}

.ui-table--default-view>.ve-table.ve-table-border-around .ve-table-container table.ve-table-content.ve-table-border-y td:last-child {
  border-right: var(--table-default-view-row-inner-border);
}

.ui-table--default-view>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th {
  background-color: var(--table-default-view-header-cell-background-color);
  font-size: var(--table-default-view-header-font-size);
  line-height: var(--table-default-view-header-line-height);
  font-weight: var(--table-default-view-header-font-weight);
  letter-spacing: var(--table-default-view-header-letter-spacing);
  text-transform: var(--table-default-view-header-text-transform);
  color: var(--table-default-view-header-cell-text-color);
}

.ui-table--default-view .ve-table-container-left-scrolling td.ve-table-last-left-fixed-column {
  overflow: visible !important;
}

.ui-table--default-view .ve-table-container-left-scrolling td.ve-table-last-left-fixed-column:after {
  content: "";
  position: absolute;
  right: 0;
  top: 0;
  width: var(--table-default-view-fixed-column-shadow-width);
  height: 100%;
  box-shadow: var(--table-default-view-fixed-column-shadow);
}

/** Фикс z-index при вызове ui-tooltip или ui-popover в фиксированном столбце */
.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body .ve-table-body-tr .ve-table-body-td.ve-table-fixed-left:has(.ui-tooltip__help:not(.vue-use-popperjs-none)),
.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body .ve-table-body-tr .ve-table-body-td.ve-table-fixed-right:has(.ui-tooltip__help:not(.vue-use-popperjs-none)),
.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body .ve-table-body-tr .ve-table-body-td.ve-table-fixed-left:has(.ui-popover-panel:not(.vue-use-popperjs-none)),
.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body .ve-table-body-tr .ve-table-body-td.ve-table-fixed-right:has(.ui-popover-panel:not(.vue-use-popperjs-none)) {
  z-index: 11;
}

/** default view size: auto - cell */
.ui-table--default-view>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr,
.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-expand-tr {
  height: unset;
}

.ui-table--default-view:not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td {
  padding: 0;
}

.ui-table--default-view:is(.ui-table--size-xs)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell,
.ui-table--default-view:is(.ui-table--size-xs)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td:not(:has(.ui-table-cell)),
.ui-table--default-view:is(.ui-table--size-xs.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td {
  padding: var(--table-default-view-cell-xs-spacing-y) var(--table-default-view-cell-xs-spacing-x);
}

.ui-table--default-view:is(.ui-table--size-sm)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell,
.ui-table--default-view:is(.ui-table--size-sm)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td:not(:has(.ui-table-cell)),
.ui-table--default-view:is(.ui-table--size-sm.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td {
  padding: var(--table-default-view-cell-sm-spacing-y) var(--table-default-view-cell-sm-spacing-x);
}

.ui-table--default-view:is(.ui-table--size-md)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell,
.ui-table--default-view:is(.ui-table--size-md)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td:not(:has(.ui-table-cell)),
.ui-table--default-view:is(.ui-table--size-md.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td {
  padding: var(--table-default-view-cell-md-spacing-y) var(--table-default-view-cell-md-spacing-x);
}

/** default view size: auto - header-cell */
.ui-table--default-view>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr {
  height: unset;
}

.ui-table--default-view:not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr,
.ui-table--default-view:not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th {
  padding: 0;
}

.ui-table--default-view:is(.ui-table--size-xs):not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell,
.ui-table--default-view:is(.ui-table--size-xs):not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th:not(:has(.ui-table-header-cell)),
.ui-table--default-view:is(.ui-table--size-xs.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th {
  padding: var(--table-default-view-header-cell-xs-spacing-y) var(--table-default-view-header-cell-xs-spacing-x);
  vertical-align: middle;
}

.ui-table--default-view:is(.ui-table--size-sm):not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell,
.ui-table--default-view:is(.ui-table--size-sm):not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th:not(:has(.ui-table-header-cell)),
.ui-table--default-view:is(.ui-table--size-sm.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th {
  padding: var(--table-default-view-header-cell-sm-spacing-y) var(--table-default-view-header-cell-sm-spacing-x);
  vertical-align: middle;
}

.ui-table--default-view:is(.ui-table--size-md):not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell,
.ui-table--default-view:is(.ui-table--size-md):not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th:not(:has(.ui-table-header-cell)),
.ui-table--default-view:is(.ui-table--size-md.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th {
  padding: var(--table-default-view-header-cell-md-spacing-y) var(--table-default-view-header-cell-md-spacing-x);
  vertical-align: middle;
}

/** default view row-height: sm - cell */

.ui-table--default-view:is(.ui-table--row-height-sm)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell {
  height: var(--table-default-view-cell-row-height-sm-height);
}

.ui-table--default-view:is(.ui-table--row-height-sm)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell>* {
  -webkit-line-clamp: var(--table-default-view-cell-row-height-sm-clamp);
}

/** default view row-height: sm - header - cell */

.ui-table--default-view:is(.ui-table--row-height-sm)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell {
  height: var(--table-default-view-header-cell-row-height-sm-height);
}

.ui-table--default-view:is(.ui-table--row-height-sm)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell * {
  -webkit-line-clamp: var(--table-default-view-header-cell-row-height-sm-clamp);
}

/** default view row-height: md - cell */

.ui-table--default-view:is(.ui-table--row-height-md)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell {
  height: var(--table-default-view-cell-row-height-md-height);
}

.ui-table--default-view:is(.ui-table--row-height-md)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell>* {
  -webkit-line-clamp: var(--table-default-view-cell-row-height-md-clamp);
}

/** default view row-height: md - header - cell */

.ui-table--default-view:is(.ui-table--row-height-md)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell {
  height: var(--table-default-view-header-cell-row-height-md-height);
}

.ui-table--default-view:is(.ui-table--row-height-md)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell * {
  -webkit-line-clamp: var(--table-default-view-header-cell-row-height-md-clamp);
}

/** default view row-height: lg - cell */

.ui-table--default-view:is(.ui-table--row-height-lg)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell {
  height: var(--table-default-view-cell-row-height-lg-height);
}

.ui-table--default-view:is(.ui-table--row-height-lg)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell>* {
  -webkit-line-clamp: var(--table-default-view-cell-row-height-lg-clamp);
}

/** default view row-height: lg - header - cell */

.ui-table--default-view:is(.ui-table--row-height-lg)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell {
  height: var(--table-default-view-header-cell-row-height-lg-height);
}

.ui-table--default-view:is(.ui-table--row-height-lg)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell * {
  -webkit-line-clamp: var(--table-default-view-header-cell-row-height-lg-clamp);
}

/** default view row-height: xl - cell */

.ui-table--default-view:is(.ui-table--row-height-xl)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell {
  height: var(--table-default-view-cell-row-height-xl-height);
}

.ui-table--default-view:is(.ui-table--row-height-xl)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell>* {
  -webkit-line-clamp: var(--table-default-view-cell-row-height-xl-clamp);
}

/** default view row-height: xl - header - cell */

.ui-table--default-view:is(.ui-table--row-height-xl)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell {
  height: var(--table-default-view-header-cell-row-height-xl-height);
}

.ui-table--default-view:is(.ui-table--row-height-xl)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell * {
  -webkit-line-clamp: var(--table-default-view-header-cell-row-height-xl-clamp);
}

/** List View */

.ui-table--list-view>.ve-table:not(.ve-table-border-around) .ve-table-container .ve-table-border-y th {
  border-right: none;
}

.ui-table--list-view>.ve-table {
  border: var(--table-list-view-border);
}

.ui-table--list-view>.ve-table .ve-table-container .ve-table-border-x th {
  border-bottom: none;
}

.ui-table--list-view>.ve-table:not(.ve-table-border-around) .ve-table-container .ve-table-border-x tr:first-child>th,
.ui-table--list-view>.ve-table:not(.ve-table-border-around) .ve-table-container .ve-table-border-x tr.ve-table-footer-tr:first-child>td {
  border-top: none;
}

.ui-table--list-view>.ve-table .ve-table-container.ve-table-container-right-scrolling .ve-table-first-right-fixed-column,
.ui-table--list-view>.ve-table:not(.ve-table-border-around) .ve-table-container .ve-table-border-y th:first-child {
  border-left: none;
}

.ui-table--list-view>.ve-table .ve-table-container th {
  vertical-align: bottom;
}

.ui-table--list-view>.ve-table:not(.ve-table-border-around) .ve-table-container table.ve-table-content tr>td:first-child {
  border-left: none;
}

.ui-table--list-view>.ve-table:not(.ve-table-border-around) .ve-table-container table.ve-table-content tr>td:last-child {
  border-right: none;
}

.ui-table--list-view>.ve-table:not(.ve-table-border-around) .ve-table-container table.ve-table-content tr:nth-child(2)>td:first-child {
  border-top-left-radius: 0;
}

.ui-table--list-view>.ve-table:not(.ve-table-border-around) .ve-table-container table.ve-table-content tr:nth-child(2)>td:last-child {
  border-top-right-radius: 0;
}

.ui-table--list-view>.ve-table:not(.ve-table-border-around) .ve-table-container table.ve-table-content tr:last-child>td:first-child {
  border-bottom-left-radius: 0;
}

.ui-table--list-view>.ve-table:not(.ve-table-border-around) .ve-table-container table.ve-table-content tr:last-child>td:last-child {
  border-bottom-right-radius: 0;
}

.ui-table--list-view>.ve-table .ve-table-container table.ve-table-content:not(.ve-table-border-x) tr:nth-child(2)>td {
  border-top: none;
}

.ui-table--list-view>.ve-table .ve-table-container table.ve-table-content:is(.ve-table-border-x) tr:nth-child(2)>td {
  border-top: var(--table-list-view-row-outer-border);
}

.ui-table--list-view>.ve-table .ve-table-container .ve-table-content:not(.ve-table-border-x) td {
  border-bottom: none;
}

.ui-table--list-view>.ve-table .ve-table-container .ve-table-content:is(.ve-table-border-x) td {
  border-bottom: var(--table-list-view-row-inner-border);
}

.ui-table--list-view>.ve-table .ve-table-container table.ve-table-content:not(.ve-table-border-x):not(.ve-table-border-around) tr:last-child>td {
  border-bottom: var(--table-list-view-row-outer-border);
}

.ui-table--list-view>.ve-table .ve-table-container table.ve-table-content.ve-table-border-x:not(.ve-table-border-around) tr:last-child>td {
  border-bottom: var(--table-list-view-row-outer-border);
}

.ui-table--list-view>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr,
.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-expand-tr {
  height: var(--table-list-view-cell-height);
}

.ui-table--list-view>.ve-table:not(.ve-table-border-around) .ve-table-container table.ve-table-content tr:nth-child(2)>td:first-child {
  position: relative;
}

.ui-table--list-view>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td {
  overflow: visible;
}

.ui-table--list-view>.ve-table.ve-table-border-around .ve-table-container table.ve-table-content.ve-table-border-x tr:first-child>th {
  border-top: var(--table-list-view-row-outer-border);
}

.ui-table--list-view>.ve-table.ve-table-border-around .ve-table-container table.ve-table-content.ve-table-border-y th:first-child {
  border-left: none;
}

.ui-table--list-view>.ve-table.ve-table-border-around .ve-table-container table.ve-table-content.ve-table-border-y th.ve-table-last-column {
  border-right: var(--table-list-view-row-outer-border);
}

.ui-table--list-view>.ve-table .ve-table-container .ve-table-border-x td {
  background-color: var(--table-list-view-cell-background-color);
  color: var(--table-list-view-cell-text-color);
  font-size: var(--table-list-view-cell-font-size);
  line-height: var(--table-list-view-cell-line-height);
  font-weight: var(--table-list-view-cell-font-weight);
  letter-spacing: var(--table-list-view-cell-letter-spacing);
  text-transform: var(--table-list-view-cell-text-transform);
}

.ui-table--list-view>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body.ve-table-row-hover tr.ve-table-body-tr:hover td {
  background-color: var(--table-list-view-cell-hover-background-color);
}

.ui-table--list-view>.ve-table .ve-table-container .ve-table-border-x td:first-child {
  border-left: var(--table-list-view-row-outer-border);
}

.ui-table--list-view>.ve-table.ve-table-border-around .ve-table-container table.ve-table-content.ve-table-border-y td:first-child {
  border-left: var(--table-list-view-row-inner-border);
}

.ui-table--list-view>.ve-table .ve-table-container .ve-table-border-x td:last-child {
  border-right: var(--table-list-view-row-outer-border);
}

.ui-table--list-view>.ve-table.ve-table-border-around .ve-table-container table.ve-table-content.ve-table-border-y td:last-child {
  border-right: var(--table-list-view-row-inner-border);
}

.ui-table--list-view>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th {
  background-color: var(--table-list-view-header-cell-background-color);
  font-size: var(--table-list-view-header-font-size);
  line-height: var(--table-list-view-header-line-height);
  font-weight: var(--table-list-view-header-font-weight);
  letter-spacing: var(--table-list-view-header-letter-spacing);
  text-transform: var(--table-list-view-header-text-transform);
  color: var(--table-list-view-header-cell-text-color);
}

.ui-table--list-view>.ve-table-container-left-scrolling td.ve-table-last-left-fixed-column {
  overflow: visible !important;
}

.ui-table--list-view>.ve-table-container-left-scrolling td.ve-table-last-left-fixed-column:after {
  content: "";
  position: absolute;
  right: 0px;
  top: 0;
  width: var(--table-list-view-fixed-column-shadow-width);
  height: 100%;
  box-shadow: var(--table-list-view-fixed-column-shadow);
}

/** list view size: auto - cell */
.ui-table--list-view>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr,
.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-expand-tr {
  height: unset;
}

.ui-table--list-view:not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td {
  padding: 0;
}

.ui-table--list-view:is(.ui-table--size-xs)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell,
.ui-table--list-view:is(.ui-table--size-xs)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td:not(:has(.ui-table-cell)),
.ui-table--list-view:is(.ui-table--size-xs.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td {
  padding: var(--table-list-view-cell-xs-spacing-y) var(--table-list-view-cell-xs-spacing-x);
}

.ui-table--list-view:is(.ui-table--size-sm)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell,
.ui-table--list-view:is(.ui-table--size-sm)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td:not(:has(.ui-table-cell)),
.ui-table--list-view:is(.ui-table--size-sm.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td {
  padding: var(--table-list-view-cell-sm-spacing-y) var(--table-list-view-cell-sm-spacing-x);
}

.ui-table--list-view:is(.ui-table--size-md)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell,
.ui-table--list-view:is(.ui-table--size-md)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td:not(:has(.ui-table-cell)),
.ui-table--list-view:is(.ui-table--size-md.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td {
  padding: var(--table-list-view-cell-md-spacing-y) var(--table-list-view-cell-md-spacing-x);
}

/** list view size: auto - header-cell */
.ui-table--list-view>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr {
  height: unset;
}

.ui-table--list-view:not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr,
.ui-table--list-view:not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th {
  padding: 0;
}

.ui-table--list-view:is(.ui-table--size-xs):not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell,
.ui-table--list-view:is(.ui-table--size-xs):not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th:not(:has(.ui-table-header-cell)),
.ui-table--list-view:is(.ui-table--size-xs.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th {
  padding: var(--table-list-view-header-cell-xs-spacing-y) var(--table-list-view-header-cell-xs-spacing-x);
  vertical-align: middle;
}

.ui-table--list-view:is(.ui-table--size-sm):not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell,
.ui-table--list-view:is(.ui-table--size-sm):not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th:not(:has(.ui-table-header-cell)),
.ui-table--list-view:is(.ui-table--size-sm.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th {
  padding: var(--table-list-view-header-cell-sm-spacing-y) var(--table-list-view-header-cell-sm-spacing-x);
  vertical-align: middle;
}

.ui-table--list-view:is(.ui-table--size-md):not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell,
.ui-table--list-view:is(.ui-table--size-md):not(.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th:not(:has(.ui-table-header-cell)),
.ui-table--list-view:is(.ui-table--size-md.ui-table--row-height-auto)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th {
  padding: var(--table-list-view-header-cell-md-spacing-y) var(--table-list-view-header-cell-md-spacing-x);
  vertical-align: middle;
}

/** list view row-height: sm - cell */

.ui-table--list-view:is(.ui-table--row-height-sm)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell {
  height: var(--table-list-view-cell-row-height-sm-height);
}

.ui-table--list-view:is(.ui-table--row-height-sm)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell>* {
  -webkit-line-clamp: var(--table-list-view-cell-row-height-sm-clamp);
}

/** list view row-height: sm - header - cell */

.ui-table--list-view:is(.ui-table--row-height-sm)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell {
  height: var(--table-list-view-header-cell-row-height-sm-height);
}

.ui-table--list-view:is(.ui-table--row-height-sm)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell * {
  -webkit-line-clamp: var(--table-list-view-header-cell-row-height-sm-clamp);
}

/** list view row-height: md - cell */

.ui-table--list-view:is(.ui-table--row-height-md)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell {
  height: var(--table-list-view-cell-row-height-md-height);
}

.ui-table--list-view:is(.ui-table--row-height-md)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell>* {
  -webkit-line-clamp: var(--table-list-view-cell-row-height-md-clamp);
}

/** list view row-height: md - header - cell */

.ui-table--list-view:is(.ui-table--row-height-md)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell {
  height: var(--table-list-view-header-cell-row-height-md-height);
}

.ui-table--list-view:is(.ui-table--row-height-md)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell * {
  -webkit-line-clamp: var(--table-list-view-header-cell-row-height-md-clamp);
}

/** list view row-height: lg - cell */

.ui-table--list-view:is(.ui-table--row-height-lg)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell {
  height: var(--table-list-view-cell-row-height-lg-height);
}

.ui-table--list-view:is(.ui-table--row-height-lg)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell>* {
  -webkit-line-clamp: var(--table-list-view-cell-row-height-lg-clamp);
}

/** list view row-height: lg - header - cell */

.ui-table--list-view:is(.ui-table--row-height-lg)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell {
  height: var(--table-list-view-header-cell-row-height-lg-height);
}

.ui-table--list-view:is(.ui-table--row-height-lg)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell * {
  -webkit-line-clamp: var(--table-list-view-header-cell-row-height-lg-clamp);
}

/** list view row-height: xl - cell */

.ui-table--list-view:is(.ui-table--row-height-xl)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell {
  height: var(--table-list-view-cell-row-height-xl-height);
}

.ui-table--list-view:is(.ui-table--row-height-xl)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content tbody.ve-table-body tr.ve-table-body-tr td.ve-table-body-td .ui-table-cell>* {
  -webkit-line-clamp: var(--table-list-view-cell-row-height-xl-clamp);
}

/** list view row-height: xl - header - cell */

.ui-table--list-view:is(.ui-table--row-height-xl)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell {
  height: var(--table-list-view-header-cell-row-height-xl-height);
}

.ui-table--list-view:is(.ui-table--row-height-xl)>.ve-table .ve-table-container .ve-table-content-wrapper table.ve-table-content thead.ve-table-header tr.ve-table-header-tr th.ve-table-header-th .ui-table-header-cell * {
  -webkit-line-clamp: var(--table-list-view-header-cell-row-height-xl-clamp);
}
</style>
