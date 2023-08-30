<template>
  <ui-popover
    @onShow="emit('onShow')"
    @onHide="emit('onHide')"
    @click.stop="emit('click', $event)"
    :placement="placement"
    :panelWidth="panelWidth"
    :offsetX="offsetX"
    :offsetY="offsetY"
    :panelMaxHeight="panelMaxHeight"
    :panelAnimateShowing="panelAnimateShowing"
    :strategy="strategy"
    :useArrow="useArrow"
    :class="classes"
    ref="popover"
  >
    <template #trigger="{ toggle }">
      <ui-button
        @click="toggle"
        :leftIcon="leftIcon"
        :rightIcon="showDropdownIcon ? dropdownIcon : rightIcon"
        :text="text"
        :theme="theme"
        :loading="loading"
        :disabled="disabled"
        :size="size"
        :shape="shape"
        :innerPaddings="innerPaddings"
        :block="block"
        :pointer="pointer"
        :badge="badge"
        :badgeOptions="badgeOptions"
        :color="color"
        :active="isActive"
      />
    </template>
    <template #content="scope">
      <div
        class="ui-button__dropdown-container"
        @click.stop="closeOnItemClick ? scope.close() : undefined"
        @select="closeOnItemClick ? scope.close() : undefined"
      >
        <slot v-bind="scope" />
      </div>
    </template>
  </ui-popover>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { ButtonConfig } from '../../@types/button-config';
import { ClassPropsType } from '../../@types/props';
import { PropsSizeType } from '../../@types/size';
import { useConfigParam } from '../../lib/useConfigParam';
import { ButtonShapesType, ButtonSizesType, ButtonThemesType } from '../ui-button/const';
import { ButtonBadgePropsImpl } from '../ui-button/ui-button-badge-adapter.vue';
import UiPopover from '../ui-popover/ui-popover.vue';

export interface UiButtonDropdownPropsImpl {
  /** закрыть дропдаун при клике на элемент в нем */
  closeOnItemClick?: boolean;
  /** показывать иконку (стрелку) дропдауна */
  showDropdownIcon?: boolean;

  /** пропсы ui-button */

  /** иконка перед текстом кнопки */
  leftIcon?: IconsNamesType;
  /** иконка после текста кнопки */
  rightIcon?: IconsNamesType;
  /** текст кнопки, отображается только при shape = 'normal' */
  text?: string;
  /** тема кнопки */
  theme?: ButtonThemesType;
  /** отображение загрузчика кнопки */
  loading?: boolean;
  /** активность кнопки */
  disabled?: boolean;
  /** размер кнопки */
  size?: PropsSizeType<ButtonSizesType>;
  /** форма кнопки (у кнопок shape = "circle | square" бейдж не отображается) */
  shape?: ButtonShapesType;
  /** наличие внутренних отступов по бокам кнопки */
  innerPaddings?: boolean;
  /** растянуть кнопку на всю ширину контентной области */
  block?: boolean;
  /** указатель "палец" при наведении на кнопку */
  pointer?: boolean;
  /** содержимое бейджа кнопки */
  badge?: string | number;
  /** параметры бейджа кнопки */
  badgeOptions?: ButtonBadgePropsImpl;
  /** кастомный цвет текста кнопки, например для кнопки theme = 'toolbar' нужно перекрасить иконку */
  color?: string;

  /** пропсы ui-popover */

  /** расположение панели */
  placement?: 'bottom' | 'bottom-start' | 'bottom-end';
  /** фиксированная ширина панели */
  panelWidth?: number;
  /** максимальная высота панели */
  panelMaxHeight?: number;
  /** добавить анимацию появляния панели */
  panelAnimateShowing?: boolean;
  /** описывает используемую стратегию позиционирования */
  strategy?: 'absolute' | 'fixed';
  /** смещение подсказки по оси X */
  offsetX?: number | string;
  /** смещение подсказки по оси Y */
  offsetY?: number | string;
  /** показывать стрелку панели */
  useArrow?: boolean;
}

const props = withDefaults(defineProps<UiButtonDropdownPropsImpl>(), {
  shape: 'normal',
  size: 'md',
  get theme() {
    return (useConfigParam('button') as ButtonConfig).defaultTheme;
  },
  get innerPaddings() {
    return (useConfigParam('button') as ButtonConfig).innerPaddings;
  },
  placement: 'bottom',
  offsetX: 0,
  offsetY: 0,
  closeOnItemClick: true,
  pointer: true,
});

const emit = defineEmits<{
  /** Событие по клику на кнопку */
  (e: 'click', event: Event): void;
  /** Событие при отображении панели */
  (e: 'onShow'): void;
  /** Событие при скрытии панели */
  (e: 'onHide'): void;
}>();

const popover = ref<typeof UiPopover | null>(null);
const dropdownIcon = computed(() => (popover.value?.visible ? 'arrows/chevron-up' : 'arrows/chevron-down'));

const classes = computed<ClassPropsType>(() => [
  'ui-button-dropdown',
]);

const isActive = computed<boolean>(() => popover.value?.visible);
</script>
