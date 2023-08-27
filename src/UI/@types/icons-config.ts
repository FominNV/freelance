import type { IconTypesType } from '../components/ui-icon/const';

interface SystemIconsControlsImpl {
  /** иконка очистки инпута */
  clear: IconsNamesType;
  /** иконка календаря для контрола выбора даты */
  calendar: IconsNamesType;
  /** иконка часов для контрола выбора времени */
  clock: IconsNamesType;
  /** иконка галочки для чекбокса */
  check: IconsNamesType;
  /** иконка показать пароль для инпута пароля */
  eye: IconsNamesType;
  /** иконка скрыть пароль для инпута пароля */
  eyeSlash: IconsNamesType;
  /** иконка минуса для indeterminate состояния checkbox */
  minusSmall: IconsNamesType;
  /** иконка минуса для input number */
  minus: IconsNamesType;
  /** иконка плюса для input number */
  plus: IconsNamesType;
  /** иконка плюса для input number */
  file: IconsNamesType;
  /** иконка плюса для input number */
  filePlus: IconsNamesType;
  /** иконка папки для treeview */
  folder: IconsNamesType;
  /** иконка открытой папки для treeview */
  folderOpen: IconsNamesType;
  /** иконка ручки для перетаскивания в treeview */
  gripIcon: IconsNamesType;
}

interface SystemIconsArrowsImpl {
  /** иконка стрелки влево */
  chevronLeft: IconsNamesType;
  /** иконка стрелки вправо */
  chevronRight: IconsNamesType;
  /** иконка стрелки вверх */
  chevronUp: IconsNamesType;
  /** иконка стрелки вниз */
  chevronDown: IconsNamesType;
}

interface SystemIconsActionsImpl {
  /** иконка закрытия сущности */
  close: IconsNamesType;
  /** иконка ссылки */
  link: IconsNamesType;
  /** иконка копирования */
  copy: IconsNamesType;
}

interface SystemIconsIndicatorsImpl {
  success: IconsNamesType;
  warning: IconsNamesType;
  error: IconsNamesType;
  info: IconsNamesType;
}

interface SystemIconsMenuImpl {
  menuKebabH: IconsNamesType;
  menuKebabV: IconsNamesType;
}

/**
 * Интерфейс системных иконок
 */
interface SystemIconsImpl {
  /** иконки контролов (инпуты, селекты и т.д.) */
  controls: SystemIconsControlsImpl;
  /** иконки стрелок */
  arrows: SystemIconsArrowsImpl;
  /** системные иконки действий */
  actions: SystemIconsActionsImpl
  /** системные иконки индикаторов */
  indicators: SystemIconsIndicatorsImpl;
  /** системные иконки меню */
  menu: SystemIconsMenuImpl;
}

export interface IconsConfig {
  /** тип иконок (component | sprite) */
  iconType: IconTypesType;
  /**
   * Системные иконки
   * @description необходимо указать имена иконок из пакета иконок для корректного отображения в компонентах
   */
  systemIcons: SystemIconsImpl;
}
