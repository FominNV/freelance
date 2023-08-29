<template>
  <ul :class="classes">
    <!-- @slot дефолтный слот для элементов списка табов -->
    <slot />
  </ul>
</template>

<script setup lang="ts">
import {
  computed,
} from 'vue';
import { ClassPropsType } from '../../@types/props';

export interface RrTabsPropsImpl {
  /** пресет списка табов (устанавливает отступы для предустановленным тем табов) */
  preset?: 'default' | 'stroke';
  /** направление списка (горизонтальное/вертикальное) */
  direction?: 'horizontal' | 'vertical',
}

const props = withDefaults(defineProps<RrTabsPropsImpl>(), {
  direction: 'horizontal',
});

const classes = computed<ClassPropsType>(() => [
  'ui-tab-list',
  {
    [`ui-tab-list--preset-${props.preset}`]: props.preset,
    [`ui-tab-list--direction-${props.direction}`]: props.direction,
  },
]);

</script>
<style>
.ui-tab-list {
  --tab-list-gap-default: var(--spacing-0-25);
  --tab-list-gap-stroke: var(--spacing-1-5);

  position: relative;
  display: flex;
  align-items: center;
}

.ui-tab-list--direction-vertical {
  flex-direction: column;
}

.ui-tab-list--preset-default {
  gap: var(--tab-list-gap-default);
}

.ui-tab-list--preset-stroke {
  gap: var(--tab-list-gap-stroke);
}
</style>
