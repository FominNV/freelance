<template>
  <ui-popover
    @onShow="emit('onShow')"
    @onHide="emit('onHide')"
    @click.stop="emit('click')"
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
        :rightIcon="rightIcon"
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
      <div class="ui-button-confirm__container">
        <slot
          name="content"
          v-bind="scope"
        >
          <ui-space
            size="1-5"
            direction="vertical"
            stretch
            align="center"
          >
            <slot
              name="message"
              :message="message"
            >
              <ui-subtitle
                size="xs"
                :text="message"
              />
            </slot>
            <ui-space
              size="1"
              stretch
            >
              <slot name="action-buttons">
                <ui-button
                  :left-icon="rejectBtnIcon"
                  :text="rejectBtnText"
                  :theme="rejectBtnTheme"
                  size="sm"
                  @click.stop="() => { emit('click:reject'); scope.close() }"
                  block
                />
                <ui-button
                  :left-icon="acceptBtnIcon"
                  :text="acceptBtnText"
                  :theme="acceptBtnTheme"
                  size="sm"
                  @click.stop="() => { emit('click:accept'); scope.close() }"
                  block
                />
              </slot>
            </ui-space>
          </ui-space>
        </slot>
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

export interface UiButtonDropdownPropsImpl {
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

  /** Пропсы компонента */

  /** Сообщение в тултипе */
  message?: string;
  /** Текст кнопки отмены */
  rejectBtnText?: string;
  /** Текст кнопки подтверждения */
  acceptBtnText?: string;
  /** Тема кнопки отмены */
  rejectBtnTheme?: ButtonThemesType;
  /** Тема кнопки подтверждения */
  acceptBtnTheme?: ButtonThemesType;
  /** Иконка кнопки отмены */
  rejectBtnIcon?: IconsNamesType;
  /** Иконка кнопки подтверждения */
  acceptBtnIcon?: IconsNamesType;
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
  offsetY: 6,
  panelWidth: 235,
  useArrow: true,
  message: 'Подтвердите действие',
  rejectBtnText: 'Отмена',
  acceptBtnText: 'Подтвердить',
  rejectBtnTheme: 'default',
  acceptBtnTheme: 'primary',
});

const emit = defineEmits<{
  /** Событие по клику на кнопку */
  (e: 'click'): void;
  /** Событие при отображении панели */
  (e: 'onShow'): void;
  /** Событие при скрытии панели */
  (e: 'onHide'): void;
  /** Событие по клику на кнопку отмены */
  (e: 'click:reject'): void;
  /** Событие по клику на кнопку подтверждения */
  (e: 'click:accept'): void;
}>();

const popover = ref<any>(null);

const classes = computed<ClassPropsType>(() => [
  'ui-button-confirm',
  {
    'ui-button-confirm--block': props.block,
  },
]);

const isActive = computed<boolean>(() => popover.value?.visible);

defineExpose({
  popover,
  open: popover.value?.open,
  close: popover.value?.close,
  toggle: popover.value?.toggle,
});
</script>

<style>
.ui-button-confirm {
  --button-confirm-container-padding: var(--spacing-2);
}

.ui-button-confirm--block.ui-popover {
  width: 100%;
}

.ui-button-confirm__container {
  padding: var(--button-confirm-container-padding);
  text-align: left;
}
</style>
