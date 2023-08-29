import { ColorNames } from '../../directives';
import { createGuid } from '../../lib/guid';

export class TreeViewNode implements TreeViewNodeImpl {
  /** id узла */
  id!: string;

  /** key для v-for vue */
  key?: string;

  /** Отображаемый текст */
  name!: string;

  /** Название иконки из пакета иконок */
  icon?: IconsNamesType;

  /** Цвет иконки в css */
  iconColor?: ColorNames;

  /** Возможность перетаскивания узла */
  draggable!: boolean;

  /** Открыт/закрыт */
  opened!: boolean;

  /** Чек-бокс */
  checked!: boolean;

  /** Чек-бокс частично */
  indeterminate!: boolean;

  /** Дочерние узлы */
  nodes?: TreeViewNode[];

  /** Дополнительная информация */
  meta?: any;

  /** Предзагрузка данных узла */
  fetch?: boolean;

  /** Имя слота для экшенов */
  actionsSlotName?: string;

  /** Предустановленные опции (иконка, цвет иконки, имя слота для экшенов) для узла */
  preset?: TreeViewNodePresetImpl;

  constructor(data: TreeViewNodeImpl) {
    if (data) {
      this.id = data.id;
      this.key = data.key || createGuid();
      this.name = data.name || '';
      this.draggable = data.draggable || true;
      this.opened = data.opened || false;
      this.checked = data.checked || false;
      this.indeterminate = data.indeterminate || false;
      this.fetch = data.fetch || false;
      this.icon = data.icon;
      this.iconColor = data.iconColor;
      this.nodes = data.nodes;
      this.meta = data.meta;
      this.actionsSlotName = data.actionsSlotName;
      if (data.preset) {
        this.setPreset(data.preset);
      }
    }
  }

  public setPreset(preset: TreeViewNodePresetImpl) {
    if (preset.icon) {
      this.icon = preset.icon;
    }
    if (preset.iconColor) {
      this.iconColor = preset.iconColor;
    }
    if (preset.actionsSlotName) {
      this.actionsSlotName = preset.actionsSlotName;
    }
  }
}

export interface TreeViewNodeImpl {
  /** id узла */
  id: string;

  /** key для v-for vue */
  key?: string;

  /** Отображаемый текст */
  name: string;

  /** Название иконки из пакета иконок */
  icon?: IconsNamesType;

  /** Цвет иконки в css */
  iconColor?: ColorNames;

  /** Возможность перетаскивания узла */
  draggable?: boolean;

  /** Открыт/закрыт */
  opened?: boolean;

  /** Чек-бокс */
  checked?: boolean;

  /** Чек-бокс частично */
  indeterminate?: boolean;

  /** Дочерние узлы */
  nodes?: TreeViewNode[];

  /** Дополнительная информация */
  meta?: any;

  /** Предзагрузка данных узла */
  fetch?: boolean;

  preset?: TreeViewNodePresetImpl;

  actionsSlotName?: string;
}

export interface TreeViewNodePresetImpl {
  /** Название иконки из пакета иконок */
  icon?: IconsNamesType;

  /** Цвет иконки в css */
  iconColor?: ColorNames;

  actionsSlotName?: string;
}
