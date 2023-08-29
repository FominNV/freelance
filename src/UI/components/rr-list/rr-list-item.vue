<template>
  <li
    :class="classes"
    @click="emit('click', $event)"
  >
    <!-- @slot слот для размещения контента элемента списка -->
    <slot />
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ClassPropsType } from '../../@types/props';

/**
 * Компонент элемента списка
 */
export interface Props {
  /** флаг позволяющий отобразить маркеры списка */
  marker?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  marker: false,
});

const emit = defineEmits<{
  /** Событие клика по элементу списка */
  (e: 'click', value: MouseEvent): void;
}>();

const classes = computed<ClassPropsType>(() => [
  'ui-list__item',
  {
    'ui-list__item--marker': props.marker,
  },
]);

</script>
