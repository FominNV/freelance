<template>
  <div :class="classes">
    <!-- @slot содержимое колонки -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { ClassPropsType } from '../../@types/props';

export interface RrColPropsImpl {
  /** инверсия направления */
  reverse?: boolean;
  /** горизонтальное выравнивание */
  justify?: 'start' | 'center' | 'end' | 'around' | 'between';
  /** вертикальное выравнивание */
  align?: 'top' | 'middle' | 'bottom';
  /** порядок следования flex-элемента */
  order?: 'first' | 'last';
  /** размер колонки (0 - 12) */
  size?: number | string;
  /** отступ колонки (0 - 11) */
  offset?: number | string;
  /**
   * классы для адаптивности
   * например, col-md-5 или col-lg-2 и т.д.
   * @example grid.css
   */
  responsive?: string[];
}

const props = withDefaults(defineProps<RrColPropsImpl>(), {
  size: 0,
});

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-col',
  Number(props.size) > 0 ? `col-xs-${props.size} col-md-${props.size} col-lg-${props.size}` : 'col-xs col-md col-lg',
  {
    [`col-xs-offset-${props.offset} col-md-offset-${props.offset} col-lg-offset-${props.offset}`]: props.offset,
    [`${props.justify}-xs ${props.justify}-md ${props.justify}-lg`]: props.justify,
    [`${props.align}-xs ${props.align}-md ${props.align}-lg`]: props.align,
    [`${props.order}-xs ${props.order}-md ${props.order}-lg`]: props.order,
    reverse: props.reverse,
  },
  props.responsive || [],
]);

</script>
