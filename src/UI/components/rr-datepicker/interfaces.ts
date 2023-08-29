export interface TimePickerOptionsImpl {
  /** Начальное время */
  start: string;
  /** Шаг */
  step: string;
  /** Конечное время */
  end: string;
  /** Формат времени, соответствует format - (по умолчанию HH:mm) */
  format: string;
}

export interface DatePickerShortcutsItemImpl {
  /** Текст шортката */
  text: string;
  /** Хэндлер клика шортката */
  onClick: () => void;
}
