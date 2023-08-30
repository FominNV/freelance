interface UiTableEllipsisImpl {
  showTitle: boolean;
  lineClamp: number;
}
export interface UiTableColumnImpl {
  title: string;
  key: string;
  field: string;
  width?: number | string;
  type?: 'radio' | 'checkbox' | 'expand';
  align?: 'left' | 'right' | 'center';
  fixed?: 'left' | 'right';
  children?: Array<UiTableColumnImpl>;
  ellipsis?: Partial<UiTableEllipsisImpl>;
}

export interface UiTableCellStylePropImpl {
  /** TODO: Типизировать any */
  bodyCellClass?: ({ row, column, rowIndex }: any) => string;
  headerCellClass?: ({ column, rowIndex }: any) => string;
  footerCellClass?: ({ row, column, rowIndex }: any) => string;
}

export interface UiTableCellImpl {
  title: string;
  key: string;
  field: string;
  align?: 'left' | 'right' | 'center';
  fixed?: 'left' | 'right';
  /** TODO: Типизировать any */
  renderBodyCell?: ({ row, column, rowIndex }: any, h: any) => void;
  /** TODO: Типизировать any */
  renderHeaderCell?: ({ row, column, rowIndex }: any, h: any) => void;
  width?: number | string;
  _colspan?: number;
  _keys?: string;
  _level?: number;
  _realTimeWidth?: number;
  _rowspan?: number;
}

export interface UiTableComtextMenuItemImpl {
  label?: string;
  type: string;
  children?: Array<UiTableComtextMenuItemImpl>;
}

export interface UiTableChangeSelectionEventImpl<T = any> {
  row: T;
  isSelected?: boolean;
}
