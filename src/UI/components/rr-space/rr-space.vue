<template>
  <div
    :class="classes"
    :style="sizeStyles"
    v-on="$listeners"
  >
    <!-- @slot дефолтный слот для размещения компонентов -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ClassPropsType } from '../../@types/props';
import {
  SpacingSizesType,
  useGapSpacing,
} from '../../composable/useSpacing';

export interface RrSpacePropsImpl {
  /** выравнивание элементов вдоль главной оси */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  /** выравнивание элементов вдоль поперечной */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  /** направление */
  direction?: 'vertical' | 'horizontal',
  /** размер отступов */
  size?: SpacingSizesType | null;
  /** переносить элементы на следующую строку при direction = 'horizontal' */
  wrap?: boolean;
  /** растянуть на всю ширину */
  stretch?: boolean;
}

const props = withDefaults(defineProps<RrSpacePropsImpl>(), {
  direction: 'horizontal',
  align: 'start',
});

const classes = computed<ClassPropsType>(() => [
  'ui-space',
  {
    [`ui-space--justify-${props.justify}`]: props.justify,
    [`ui-space--align-${props.align}`]: props.align,
    [`ui-space--direction-${props.direction}`]: props.direction,
    [`ui-space--size-${props.size}`]: props.size,
    'ui-space--state-wrapped': props.wrap,
    'ui-space--state-stretch': props.stretch,
  },
]);

const sizeStyles = useGapSpacing(props.size);

</script>
<style>
.ui-space {
  position: relative;
  display: flex;
}

.ui-space--direction-vertical {
  flex-direction: column;
}

.ui-space--justify-start {
  justify-content: flex-start;
}

.ui-space--justify-end {
  justify-content: flex-end;
}

.ui-space--justify-center {
  justify-content: center;
}

.ui-space--justify-between {
  justify-content: space-between;
}

.ui-space--justify-around {
  justify-content: space-around;
}

.ui-space--justify-evenly {
  justify-content: space-evenly;
}

.ui-space--align-start {
  align-items: flex-start;
}

.ui-space--align-end {
  align-items: flex-end;
}

.ui-space--align-center {
  align-items: center;
}

.ui-space--align-baseline {
  align-items: baseline;
}

.ui-space--align-stretch {
  align-items: stretch;
}

.ui-space--state-wrapped {
  flex-wrap: wrap;
}

.ui-space--state-stretch {
  width: 100%;
}
</style>
