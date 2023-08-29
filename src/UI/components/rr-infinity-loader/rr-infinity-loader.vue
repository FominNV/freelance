<template>
  <div
    :class="classes"
    :style="{ position: position }"
  />
</template>

<script setup lang="ts">
import { ComputedRef, computed } from 'vue';
import { ClassPropsType } from '../../@types/props';

export interface RrInfinityLoaderPropsImpl {
  /** позиционирование загрузчика */
  position?: 'relative' | 'fixed' | 'absolute';
  /** сторона размещения загрузчика */
  placement?: 'top' | 'bottom';
}

const props = withDefaults(defineProps<RrInfinityLoaderPropsImpl>(), {
  position: 'absolute',
  placement: 'top',
});

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-infinity-loader',
  {
    [`ui-infinity-loader--placement-${props.placement}`]: props.placement,
  },
]);

</script>
<style>
.ui-infinity-loader {
  --infinity-loader-background-color: var(--color-neutral-300);
  --infinity-loader-gradient-color-100: var(--color-primary-500);
  --infinity-loader-gradient-color-200: var(--color-primary-300);
  --infinity-loader-height: 4px;
  --infinity-loader-speed: 1.5s;

  background: var(--infinity-loader-background-color) linear-gradient(to right, var(--infinity-loader-gradient-color-200) 2%, var(--infinity-loader-gradient-color-100) 30%, var(--infinity-loader-gradient-color-200) 50%);
  background-repeat: no-repeat;
  background-size: 70% 100%;

  animation-duration: var(--infinity-loader-speed);
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: progressbar;
  animation-timing-function: linear;
}

.ui-infinity-loader--placement-top,
.ui-infinity-loader--placement-bottom {
  width: 100%;
  height: var(--infinity-loader-height);
  left: 0;
}

.ui-infinity-loader--placement-left,
.ui-infinity-loader--placement-right {
  width: var(--infinity-loader-height);
  height: 100%;
  top: 0;
}

.ui-infinity-loader--placement-top {
  top: 0;
}

.ui-infinity-loader--placement-bottom {
  bottom: 0;
}

.ui-infinity-loader--placement-left {
  left: 0;
}

.ui-infinity-loader--placement-right {
  right: 0;
}

@keyframes progressbar {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 400% 0;
  }
}
</style>
