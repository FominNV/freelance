<template>
  <ui-icon v-bind="props" />
</template>
<script setup lang="ts">
import { PropsSizeType } from '../../@types/size';
import { IconSizesType, IconTypesType } from '../ui-icon/const';

export interface UiEmptyIconPropsImpl {
  /**
   * Цвет иконки
   * @params none - остутствует. цвет берется из SVG
   * @params current - цвет иконки устанавливается в currentColor и определяется цветом текста родительского элемента
   */
  color?: 'none' | 'current';
  /**
   * Тип иконки
   * @params component - иконки в виде vue-компонентов
   * @params sprite - иконки берутся из спрайта
   */
  type?: IconTypesType;
  /**
   * Имя иконки. Список имен предоставляется пакетом иконок
   */
  name: IconsNamesType;
  /**
   * параметры атрибута ViewBox тэга ```<svg />```
   */
  viewBox?: string;
  /**
   * Размер иконки
   */
  size?: PropsSizeType<IconSizesType>;
}

const props = defineProps<UiEmptyIconPropsImpl>();
</script>
