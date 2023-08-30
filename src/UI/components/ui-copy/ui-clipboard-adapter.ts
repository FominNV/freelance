import { UiClipboardAdapterImpl } from './interfaces';

/**
 * Дефолтный адаптер для работы с буфером обмена
 * @implements UiClipboardAdapterImpl
 */
export class UiClipboardAdapter implements UiClipboardAdapterImpl {
  /**
   * Метод записи текста в буфер обмена
   * @param data текст
   */
  public async write(data: string) {
    try {
      navigator.clipboard.writeText(data);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  /**
   * Метод чтения текста из буфера обмена
   * @returns { string }
   */
  public async read() {
    try {
      return navigator.clipboard.readText();
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
