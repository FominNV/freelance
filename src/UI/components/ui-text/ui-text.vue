<template>
  <component
    :is="tag"
    :class="classes"
    :style="offsetStyles"
    v-ui-typo="{ type, size }"
    v-ui-color:text="color"
  >
    <ui-tooltip
      v-if="ellipsis && useTooltip"
      :text="text"
      trigger="hover"
    >
      <span class="ui-text__content">{{ text }}</span>
    </ui-tooltip>
    <template v-else>
      <span class="ui-text__content">{{ text }}</span>
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSpacing, SpacingSizesType } from '../../composables/useSpacing';
import { PropsSizeType } from '../../@types/size';
import { ColorNames } from '../../directives/ui-color';
import { TextSizesType } from './const';

export interface UiTextPropsImpl {
  /** тип текста */
  type?: 'paragraph' | 'action';
  /** тэг текста */
  tag?: 'p' | 'span' | 'label';
  /** цвет текста */
  color?: ColorNames;
  /** размер текста */
  size?: PropsSizeType<TextSizesType>;
  /** контент */
  text: string;
  /** текст в одну строку */
  ellipsis?: boolean;
  /** отображать подсказку при ellipsis = true */
  useTooltip?: boolean;
  /** отступ сверху */
  offsetTop?: SpacingSizesType | null;
  /** отступ слева */
  offsetLeft?: SpacingSizesType | null;
  /** отступ справа */
  offsetRight?: SpacingSizesType | null;
  /** отступ снизу */
  offsetBottom?: SpacingSizesType | null;
}

const props = withDefaults(defineProps<UiTextPropsImpl>(), {
  tag: 'span',
  size: 'md',
  type: 'paragraph',
  offsetTop: null,
  offsetLeft: null,
  offsetRight: null,
  offsetBottom: null,
});

const classes = computed(() => {
  return [
    'ui-text',
    props.type === 'action' ? 'ui-action' : 'ui-paragraph',
    {
      'ui-text--ellipsis': props.ellipsis,
    },
  ];
});
const { offsetStyles } = useSpacing(props.offsetLeft, props.offsetTop, props.offsetRight, props.offsetBottom);
</script>
<style>
.ui-text {
  position: relative;
  display: inline-block;
  max-width: 100%;
  vertical-align: middle;
}

.ui-text .ui-tooltip {
  max-width: 100%;
}

.ui-text--ellipsis .ui-text__content {
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;
}
</style>
