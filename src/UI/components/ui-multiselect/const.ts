import { tuple } from '../../lib/types';

export const multiselectSizesList = tuple('sm', 'lg');

export type MultiselectSizesType = typeof multiselectSizesList[number];

export const rrMultiselectLabels = {
  placeholder: 'Выберите вариант',
  placeholderMultiple: 'Выберите один или несколько вариантов',
  tagPlaceholder: 'Нажмите Enter, чтобы добавить',
  selectLabel: 'Нажмите Enter, чтобы выбрать',
  selectGroupLabel: 'Нажмите Enter, чтобы выбрать группу',
  selectedLabel: 'Выбрано',
  deselectLabel: 'Нажмите Enter, чтобы отменить выбор',
  deselectGroupLabel: 'Нажмите Enter, чтобы отменить выбор группы',
  noResultLabel: 'Ничего не найдено',
  searchLabel: 'Идет поиск...',
  noOptionsLabel: 'Список пуст',
  maxElements: (max: number) => `Выбрано максимальное количество элементов (${max}/${max})`,
  limitText: (count: number) => `и еще ${count}`,
};
