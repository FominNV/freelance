export interface UiClipboardAdapterImpl {
  /** метод записи в буфер обмена */
  write: (data: string) => Promise<void>;
  /** метод чтения из буфера обмена */
  read: () => Promise<string>;
}
