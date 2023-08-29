<template>
  <span :class="classes">
    <ui-chip
      v-for="(item, index) in modelValue"
      :value="item"
      :allow-edit="allowEdit"
      :allow-remove="allowRemove"
      :input-max-width="inputMaxWidth"
      @remove="removeChip(index)"
      @change="onCurrentChange($event, index)"
      @click="emit('chip:click', item)"
      :key="item + index"
    />
    <ui-chip
      class="ui-chips__item"
      v-if="allowCreate"
      :default="creationDefaultText"
      :allowEdit="true"
      :allowCreate="true"
      :input-max-width="inputMaxWidth"
      v-on:create="onCreate"
    />
  </span>
</template>

<script setup lang="ts">
import {
  ComputedRef,
  computed,
  watch,
} from 'vue';
import { ClassPropsType } from '../../@types/props';
import RrChip from './ui-chip.vue';

export interface RrChipsPropsImpl {
  /** значение чипсов */
  modelValue: string[];
  /** разрешить создание чипсов */
  allowCreate?: boolean;
  /** разрешить редактирование чипсов */
  allowEdit?: boolean;
  /** разрешить удаление чипсов */
  allowRemove?: boolean;
  /** дефолтный текст создания чипса */
  creationDefaultText?: string;
  /** минимальная ширина, до которой будет сжиматься поле ввода. */
  inputMaxWidth?: string,
}

const props = withDefaults(defineProps<RrChipsPropsImpl>(), {
  modelValue: () => [],
  allowCreate: true,
  allowEdit: true,
  allowRemove: true,
  creationDefaultText: 'Введите наименование тега',
  inputMaxWidth: 'none',
});

const emit = defineEmits<{
  /** событие изменения чипсов */
  (e: 'update:modelValue', value: Array<string>): void;
  (e: 'chip:click', value: string | undefined): void;
}>();

const classes: ComputedRef<ClassPropsType> = computed<ClassPropsType>(() => [
  'ui-chips',
  {

  },
]);

const removeChip = (id: number): void => {
  const chips = props.modelValue.filter((item, index) => index !== id);
  emit('update:modelValue', [...chips]);
};

const onCreate = (val: string): void => {
  const chips = [...props.modelValue];
  chips.push(val);
  emit('update:modelValue', chips);
};

const onCurrentChange = (value: string, index: number): void => {
  const chips = props.modelValue;
  chips[index] = value;
  emit('update:modelValue', chips);
};

watch(() => props.modelValue, () => {
  emit('update:modelValue', props.modelValue);
}, { immediate: true, deep: true });
</script>

<style>
.ui-chips {
  --chips-gap-x: var(--spacing-1);
  --chips-gap-y: var(--spacing-1);
  display: flex;
  flex-wrap: wrap;
  user-select: none;
  gap: var(--chips-gap-y) var(--chips-gap-x);
}
</style>
