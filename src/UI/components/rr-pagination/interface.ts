import { RrPopoverListItemImpl } from '../ui-popover/interface';

export interface RrPaginationPagesListItemImpl extends RrPopoverListItemImpl {
  pageNumber: number;
}
export interface RrPaginationPageSizesListItemImpl extends RrPopoverListItemImpl {
  pageSize: number;
}
export interface RrPaginationDefaultPropsImpl {
  /** общее количество записей */
  total: number;
  /** количество записей на странице */
  pageSize: number;
  pageSizes?: number[];
  /** текущая страница */
  modelValue: number;
}

export interface RrPaginationDefaulEmitsImpl {
  (e: 'update:modelValue', value: number): void;
  (e: 'range-change', start: number, end: number): void;
}
