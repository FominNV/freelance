import { CreateElement } from 'vue';

interface RrTableEllipsisImpl {
  showTitle: boolean;
  lineClamp: number;
}
export interface RrTableColumnImpl {
  title: string;
  key: string;
  field: string;
  width?: number | string;
  type?: 'radio' | 'checkbox' | 'expand';
  align?: 'left' | 'right' | 'center';
  fixed?: 'left' | 'right';
  children?: Array<RrTableColumnImpl>;
  ellipsis?: Partial<RrTableEllipsisImpl>;
}

export interface RrTableCellStylePropImpl {
  /** TODO: Типизировать any */
  bodyCellClass?: ({ row, column, rowIndex }: any) => string;
  headerCellClass?: ({ column, rowIndex }: any) => string;
  footerCellClass?: ({ row, column, rowIndex }: any) => string;
}

export interface RrTableCellImpl {
  title: string;
  key: string;
  field: string;
  align?: 'left' | 'right' | 'center';
  fixed?: 'left' | 'right';
  /** TODO: Типизировать any */
  renderBodyCell?: ({ row, column, rowIndex }: any, h: CreateElement) => void;
  /** TODO: Типизировать any */
  renderHeaderCell?: ({ row, column, rowIndex }: any, h: CreateElement) => void;
  width?: number | string;
  _colspan?: number;
  _keys?: string;
  _level?: number;
  _realTimeWidth?: number;
  _rowspan?: number;
}

export interface RrTableComtextMenuItemImpl {
  label?: string;
  type: string;
  children?: Array<RrTableComtextMenuItemImpl>;
}

export interface RrTableChangeSelectionEventImpl<T = any> {
  row: T;
  isSelected?: boolean;
}
