export interface RrClipboardAdapterImpl {
  /** метод записи в буфер обмена */
  write: (data: string) => Promise<void>;
  /** метод чтения из буфера обмена */
  read: () => Promise<string>;
}
