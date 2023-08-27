<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    v-if="name"
    :viewBox="viewBox"
    :class="classes"
    :width="iconSize"
    :height="iconSize"
    fill="none"
  >
    <component
      v-if="type === 'component'"
      :is="componentName"
    />
    <use
      v-else
      xmlns:xlink="http://www.w3.org/1999/xlink"
      :xlink:href="spriteHref"
    />
  </svg>
</template>

<script setup lang="ts">
import { ComputedRef, computed } from 'vue';
import { useSize } from '../../composables/useSize';
import { PropsSizeType } from '../../@types/size';
import { IconsConfig } from '../../@types/icons-config';
import { ClassPropsType } from '../../@types/props';
import { useConfigParam } from '../../lib/useConfigParam';
import { iconSizes, IconSizesType, IconTypesType } from './const';

export interface UiIconPropsImpl {
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

const props = withDefaults(defineProps<UiIconPropsImpl>(), {
  get type() {
    return (useConfigParam('icons') as IconsConfig).iconType;
  },
  viewBox: '0 0 20 20',
  size: 'md',
  color: 'current',
});

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-icon',
  {
    'ui-icon--current-color': props.color === 'current',
  },
]);

const componentName = computed<string>(() => props.name.replace('/', '-').concat('-icon'));
const spriteHref = computed<string>(() => `#${props.name.replace('/', '--')}`);
const iconSize = computed(() => useSize<IconSizesType>(props.size, iconSizes));

</script>
<style>
.ui-icon {
  position: relative;
  display: block;
  flex-shrink: 0;
}

.ui-icon--current-color path {
  color: inherit;
  stroke: currentColor !important;
}
</style>
