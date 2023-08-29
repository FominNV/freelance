<template>
  <div
    :class="classList"
    :style="[lengthStyle, offsetStyles]"
    v-ui-color:bg="props.color"
  />
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { StyleValue } from 'vue/types/jsx';
import { useSpacing, SpacingSizesType } from '../../composable/useSpacing';
import { ClassPropsType } from '../../@types/props';
import { ColorNames } from '../../directives';

export interface RrDividerPropsImpl {
  /** длина разделителя в заданном направление */
  length?: string | number;
  /** направление */
  direction?: 'vertical' | 'horizontal';
  /** цвет разделителя */
  color?: ColorNames;
  /** перпендикулярный отступ до и после разделителя */
  indent?: SpacingSizesType | null;
}

const props = withDefaults(defineProps<RrDividerPropsImpl>(), {
  length: '100%',
  direction: 'horizontal',
  color: 'neutral-200',
  indent: null,
});

const classList: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-divider',
  {
    [`ui-divider--direction-${props.direction}`]: props.direction,
  },
]);

const { offsetStyles } = useSpacing(
  props.direction === 'vertical' ? props.indent : null,
  props.direction === 'horizontal' ? props.indent : null,
  props.direction === 'vertical' ? props.indent : null,
  props.direction === 'horizontal' ? props.indent : null,
  'outer',
);

const buildLength = () => {
  return typeof props.length === 'number'
    ? `${props.length}px`
    : props.length;
};

const lengthStyle = computed<StyleValue>(() => {
  switch (props.direction) {
    case 'horizontal':
      return {
        width: buildLength(),
      };
    case 'vertical':
      return {
        height: buildLength(),
      };
    default: return {};
  }
});
</script>

<style>
.ui-divider {
  --divider-width: 1px;
  height: var(--divider-width);
}

.ui-divider--direction-vertical {
  width: var(--divider-width);
}
</style>
