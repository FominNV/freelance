<template>
  <div :class="classes">
    <slot :active="active" />
  </div>
</template>

<script setup lang="ts">
import {
  computed,
} from 'vue';
import { ClassPropsType } from '../../@types/props';

export interface UiTabsPropsImpl {
  /** флаг активной панели */
  active?: boolean;
}

const props = withDefaults(defineProps<UiTabsPropsImpl>(), {
  //
});

const classes = computed<ClassPropsType>(() => [
  'ui-tab-panels-item',
  {
    'ui-tab-panels-item--active': props.active,
  },
]);

</script>
<style>
.ui-tab-panels-item {
  position: relative;
  display: none;
}
.ui-tab-panels-item--active {
  display: block;
}
</style>
