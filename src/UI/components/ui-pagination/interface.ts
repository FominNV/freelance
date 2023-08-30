import { UiPopoverListItemImpl } from '../ui-popover/interface';

export interface UiPaginationPagesListItemImpl extends UiPopoverListItemImpl {  
  pageNumber: number;
}
export interface UiPaginationPageSizesListItemImpl extends UiPopoverListItemImpl {
  pageSize: number;
}
export interface UiPaginationDefaultPropsImpl {
  /** общее количество записей */
  total: number;
  /** количество записей на странице */
  pageSize: number;
  pageSizes?: number[];
  /** текущая страница */
  modelValue: number;
}

export interface UiPaginationDefaulEmitsImpl {
  (e: 'update:modelValue', value: number): void;
  (e: 'range-change', start: number, end: number): void;
}
