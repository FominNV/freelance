export interface UiEditorCustomModulesImpl {
  alias: string;
  module: any;
}

export interface UiEditorSettings {
  /**
   * Белый список форматов, разрешенных в редакторе.
   * Полный список https://quilljs.com/docs/formats/
   */
  formats?: Array<string>;
  /**
   * Коллекция модулей для включения и соответствующих опций
   * Дополнительные сведения https://quilljs.com/docs/modules/
   */
  modules?: Record<string, any>;
  /**
   * Элемент DOM или селектор CSS, внутри которого должны быть
   * ограничены элементы пользовательского интерфейса редактора
   * (например, всплывающие подсказки и т. д.).
   * В настоящее время он учитывает только левую и правую границы.
   */
  bounds?: HTMLElement | string;
  /**
   * Свойство для отладки. По умолчанию включены только
   * предупреждения и сообщения об ошибках.
   * @default warn
   */
  debug?: 'error' | 'warn' | 'log' | 'info' | boolean;
}

export interface UiEditorRangeImpl {
  index: number;
  length: number;
}
