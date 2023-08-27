<template>
  <div
    :class="classes"
    :style="style"
  >
    <!-- @slot содержимое строки -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { ClassPropsType } from '@ui/@types/props';
import { SpacingSizesType } from '@ui/composables/useSpacing';

export interface RrRowPropsImpl {
  reverse?: boolean;
  /** горизонтальное выравнивание */
  justify?: 'start' | 'center' | 'end' | 'around' | 'between';
  /** вертикальное выравнивание */
  align?: 'top' | 'middle' | 'bottom' | 'stretch';
  /** вертикальный отступ */
  gap?: SpacingSizesType | null;
}

const props = withDefaults(defineProps<RrRowPropsImpl>(), {
  //
});

const style = computed<string | undefined>(() => (props.gap ? `gap:var(--spacing-${props.gap}) 0` : undefined));

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'rr-row',
  'row',
  {
    reverse: props.reverse,
    [`${props.justify}-md`]: props.justify,
    [`${props.align}-md`]: props.align,
  },
]);

</script>
<style>
.rr-row.row {
  position: relative;
  --gutter-compensation: calc((var(--md-column-gutter-width) * 0.5) * -1);
}
</style>
