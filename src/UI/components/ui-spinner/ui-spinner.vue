<template>
  <svg
    class="ui-spinner"
    xmlns:svg="http://www.w3.org/2000/svg"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.0"
    :width="loaderSize"
    :height="loaderSize"
    viewBox="0 0 128 128"
    xml:space="preserve"
  >
    <component :is="loaderComponent" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useConfigParam } from '@ui/lib/useConfigParam';
import { SpinnerSizesType, SpinnerTypesType, spinnerSizes } from './const';
import { useSize } from '@ui/composables/useSize';
import { PropsSizeType } from '@ui/@types/size';
import { SpinnerConfig } from '@ui/@types/spinner-config';

export interface UiSpinnerPropsImpl {
  /** размер загрузчика */
  size?: PropsSizeType<SpinnerSizesType>;
  /** тип загрузчика */
  type?: SpinnerTypesType;
}

const templates: any = {
  'fading-balls': () => import('./templates/ui-fading-balls-loader.vue'),
  'rounded-blocks': () => import('./templates/ui-rounded-blocks-loader.vue'),
  'two-arrows': () => import('./templates/ui-two-arrows-loader.vue'),
  'spinning-arrow': () => import('./templates/ui-spinning-arrow-loader.vue'),
  'three-dots': () => import('./templates/ui-three-dots-loader.vue'),
  'tail-spin': () => import('./templates/ui-tail-spin.vue'),
  'spinner-loader': () => import('./templates/ui-spinner-loader.vue'),
};

const props = withDefaults(defineProps<UiSpinnerPropsImpl>(), {
  get type() {
    return (useConfigParam('spinner') as SpinnerConfig).defaultType;
  },
  size: 'md',
});

const loaderSize = computed(() => useSize<SpinnerSizesType>(props.size, spinnerSizes));
const loaderComponent = computed(() => () => templates[props.type]());
</script>

<style>
.ui-spinner {
  --spinner-color: currentColor;
  display: inline-block;
  color: var(--spinner-color);
  flex-shrink: 0;
}

.ui-spinner .gradient-stop {
  stop-color: var(--spinner-color);
}
</style>
