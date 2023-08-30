<template>
  <date-picker
    ref="vDatePicker"
    v-model="model"
    titleFormat="DD.MM.YYYY"
    confirm-text="Сохранить"
    time-title-format="HH:mm"
    :input-class="classes"
    :type="type"
    :range="range"
    :format="format"
    :valueType="valueType"
    :placeholder="placeholder"
    :default-value="defaultValue"
    :editable="editable"
    :clearable="showClearButtons"
    :confirm="showConfirmButton"
    :disabled="disabled"
    :disabled-date="disabledDate"
    :disabled-time="disabledTime"
    :multiple="multiple"
    :append-to-body="appendToBody"
    :inline="inline"
    :default-panel="defaultPanel"
    :show-week-number="showWeekNumber"
    :hour-step="hourStep"
    :minute-step="minuteStep"
    :range-separator="rangeSeparator"
    :shortcuts="shortcuts"
    :show-hour="showHourColumn"
    :show-minute="showMinuteColumn"
    :show-time-header="showTimeTitle"
    :hour-options="hourOptions"
    :minute-options="minuteOptions"
    v-on="$attrs"
  >
    <template #icon-clear>
      <ui-icon :name="clearIcon" />
    </template>
    <template #icon-calendar>
      <ui-icon :name="inputIcon" />
    </template>
    <template
      #header
      v-if="$slots.header"
    >
      <!-- @slot слот хэдера-->
      <slot name="header" />
    </template>
    <template
      #sidebar
      v-if="$slots.sidebar"
    >
      <!-- @slot слот сайдбара-->
      <slot name="sidebar" />
    </template>
    <template
      #footer
      v-if="$slots.footer || props.showClearButtons"
    >
      <div
        class="mx-datepicker-footer-slot"
        v-if="$slots.footer"
      >
        <!-- @slot слот футера-->
        <slot name="footer" />
      </div>
      <button
        @click="clear"
        v-if="props.showClearButtons"
        type="button"
        class="mx-btn mx-datepicker-btn-clear"
      >Очистить
      </button>
    </template>
  </date-picker>
</template>

<script setup lang="ts">
// TODO: при переезде на vue 3 пересмотреть использование v-on="$listeners"
// TODO: Предусмотреть смену локализации
// TODO: Создать свою кнопку "Сохранить" и добавить ей иконку

import { computed, ref } from 'vue';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/locale/ru';
import { TimePickerOptionsImpl, DatePickerShortcutsItemImpl } from './interfaces';
import { ClassPropsType } from '../../@types/props';
import { PropsSizeType } from '../../@types/size';
import { DatepickerSizesType } from './const';
import { useConfigParam } from '../../lib/useConfigParam';
import { IconsConfig } from '../../@types/icons-config';

export interface UiDatepickerPropsImpl {
  modelValue: any;
  /** Тип  */
  type?: 'date' | 'datetime' | 'week' | 'month' | 'year' | 'time';
  /** Включить выбор диапазона  */
  range?: boolean;
  /** Формат возвращаемого значения
   * date - возвращает объект Date (по умолчанию)
   * timestamp - возвращает временную метку
   * format - возвращает строку соответствующую формату установленному по умолчанию (отображаемому в инпуте)
   * также можно задать свой формат, например 'DD/MM/YYYY'
   */
  valueType?: string;
  /** размер инпута */
  size?: PropsSizeType<DatepickerSizesType>;
  /** Предустановленная дата  */
  defaultValue?: Date;
  /** Плэйсхолдер  */
  placeholder?: string;
  /** Выключение инпута  */
  disabled?: boolean;
  /** Показывать кнопку подтверждения и закрывать попап только после нажатия на кнопку  */
  showConfirmButton?: boolean;
  /** Показывать кнопки очистки  */
  showClearButtons?: boolean;
  /** Разрешение редактирования инпута  */
  editable?: boolean;
  /** Выбор сразу нескольких дат (не работает в режиме range, с типом datetime и week)  */
  multiple?: boolean;
  /** Присоединять попап к body */
  appendToBody?: boolean;
  /** Отобразить пикер из попапа как самостоятельный элемент без инпута */
  inline?: boolean;
  /** Отобразить изначально в пикере вместо выбора дат выбор года или месяца */
  defaultPanel?: 'year' | 'month';
  /** Применить стиль ошибки */
  showError?: boolean,
  /** Показать номер недели в строке */
  showWeekNumber?: boolean;
  /** Интервал между часами для режима выбора времени (1-60) */
  hourStep?: number;
  /** Интервал между минутами для режима выбора времени (1-60) */
  minuteStep?: number;
  /** Список предустановленных часов для выбора */
  hourOptions?: number[];
  /** Список предустановленных минут для выбора */
  minuteOptions?: number[];
  /** Показывать колонку часов */
  showHourColumn?: boolean;
  /** Показывать колонку минут */
  showMinuteColumn?: boolean;
  /** Показывать заголовок при выборе времени */
  showTimeTitle?: boolean;
  /** Предустановленный список времени для выбора */
  timePickerOptions?: TimePickerOptionsImpl;
  /** массив объектов с шорткатами */
  shortcuts?: DatePickerShortcutsItemImpl[];
  /** Функция для определения выключенных для выбора дат, например
   *  (date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0));
   */
  disabledDate?: (date: Date, currentValue?: Date[]) => boolean;
  /** Функция для определения выключенных для выбора дат, например
   *  (date: Date) => date < new Date(new Date().setHours(12, 0, 0, 0));
   */
  disabledTime?: (date: Date) => boolean;
}

const props = withDefaults(defineProps<UiDatepickerPropsImpl>(), {
  type: 'date',
  range: false,
  size: 'lg',
  valueType: 'date',
  disabled: false,
  showConfirmButton: true,
  showClearButtons: true,
  showError: false,
  editable: true,
  multiple: false,
  appendToBody: true,
  inline: false,
  showWeekNumber: false,
  showHourColumn: true,
  showMinuteColumn: true,
  showTimeTitle: true,
});

const emit = defineEmits<{
  /** Обновление модели дэйтпикера */
  (e: 'update:modelValue', value: any): void;
  /** Когда изменяется значение инпута */
  (e: 'input', date: any): void;
  /** Когда изменяется значение инпута */
  (e: 'change', date: any, type: 'date' | 'hour' | 'minute' | 'second'): void;
  /** Когда открывается popup */
  (e: 'open', event: Event): void;
  /** Когда закрывается popup */
  (e: 'close'): void;
  /** Нажатие на кнопку подтвердить */
  (e: 'confirm', date: any): void;
  /** Нажатие на кнопку очистить */
  (e: 'clear'): void;
  /** При неправильном вводе в инпут */
  (e: 'input-error', inputText: string): void;
  /** Инпут фокус */
  (e: 'focus'): void;
  /** Инпут блюр */
  (e: 'blur'): void;
  /** Выбор даты в дейтпикере */
  (e: 'pick', date: Date): void;
  /** Когда изменяется календарь */
  (e: 'calendar-change',
    date: Date,
    oldDate: Date,
    type: 'year' | 'month' | 'last-year' | 'next-year' | 'last-month' | 'next-month' | 'last-decade' | 'next-decade'): void;
  /** Когда изменяется тип панели календаря */
  (e: 'panel-change', type: 'year' | 'month' | 'date', oldType: 'year' | 'month' | 'date'): void;
}>();

const iconsConfig = useConfigParam('icons') as IconsConfig;
const clearIcon: IconsNamesType = iconsConfig.systemIcons.controls.clear;
const inputIcon: IconsNamesType = props.type === 'time' ? iconsConfig.systemIcons.controls.clock : iconsConfig.systemIcons.controls.calendar;

/** props warnings */

if (props.multiple && props.range) {
  console.warn('Невозможно использование ui-datepicker одновременно в режиме multiple и range');
}

if ((props.multiple && props.type === 'datetime') || (props.multiple && props.type === 'week')) {
  console.warn('Невозможно использование ui-datepicker в режиме multiple с типом week или datetime');
}

const model = computed<any>({
  get() {
    return props.modelValue || null;
  },
  set(newValue: any) {
    emit('update:modelValue', newValue);
  },
});

const format = computed<string>(() => {
  switch (props.type) {
    case 'date': return 'DD.MM.YYYY';
    case 'datetime': return 'DD.MM.YYYY HH:mm';
    case 'week': return 'w';
    case 'month': return 'YYYY.MM';
    case 'year': return 'YYYY';
    case 'time': return 'HH:mm';
    default: return 'DD.MM.YYYY';
  }
});

const rangeSeparator = computed<string>(() => {
  if (props.multiple && !props.range) {
    return ', ';
  } else {
    return '  –  ';
  }
});

// TODO: отрефакторить placeholder
const placeholder = computed<string>(() => {
  if (props.placeholder) {
    return props.placeholder;
  }

  switch (props.type) {
    case 'date': {
      if (props.range) {
        return 'Выберите диапазон дат';
      }
      if (props.multiple) {
        return 'Выберите одну или несколько дат';
      }
      return 'Выберите дату';
    }

    case 'datetime': return props.range ? 'Выберите диапазон дат и времени' : 'Выберите дату и время';
    case 'week': return props.range ? 'Выберите диапазон недель' : 'Выберите неделю';
    case 'time': return props.range ? 'Выберите диапазон времени' : '--:--';

    case 'month': {
      if (props.range) {
        return 'Выберите диапазон месяцев';
      }
      if (props.multiple) {
        return 'Выберите один или несколько месяцев';
      }
      return 'Выберите месяц';
    }

    case 'year': {
      if (props.range) {
        return 'Выберите диапазон лет';
      }
      if (props.multiple) {
        return 'Выберите один год или несколько лет';
      }
      return 'Выберите год';
    }
    default: return '';
  }

});

const vDatePicker = ref<HTMLElement | any>(null);

function clear() {
  vDatePicker.value.clear();
}

const classes = computed<ClassPropsType>(() => [
  'mx-datepicker',
  'mx-input',
  `ui-datepicker--${props.size}`,
  {
    'ui-datepicker--error': props.showError,
  },
]);

</script>

<style>
.mx-datepicker,
.mx-datepicker-main {
  --datepicker-main-color: var(--color-primary-500);
  --datepicker-body-padding: var(--spacing-2-5) var(--spacing-3);
  --datepicker-header-padding: var(--spacing-0-5) var(--spacing-1);
  --datepicker-header-margin-bottom: var(--spacing-2-5);

  --datepicker-footer-padding: 0 var(--spacing-3) var(--spacing-2-5);
  --datepicker-footer-gap: var(--spacing-1-5);

  --datepicker-second-color: var(--color-primary-100);
  --datepicker-third-color: var(--color-neutral-200);
  --datepicker-text-color: var(--color-text-primary);
  --datepicker-inversion-text-color: var(--color-text-inversion);
  --datepicker-border-color: var(--datepicker-third-color);
  --datepicker-border: 1px solid var(--datepicker-border-color);
  --datepicker-box-shadow: var(--shadow-sm);
  --datepicker-button-hover-color: var(--color-primary-300);

  --datepicker-cell-not-in-current-month-color: var(--color-text-light);
  --datepicker-popup-background-color: var(--color-neutral-0);
  --datepicker-weekdays-color: var(--color-text-secondary);

  --datepicker-disabled-color: var(--color-text-light);
  --datepicker-disabled-background-color: var(--color-neutral-100);

  --datepicker-today-cell-border: 1px solid var(--color-neutral-300);

  /** радиус границы для элементов-контейнеров */
  --datepicker-wrapper-border-radius: var(--radius-lg);
  /** радиус границы для элементов-контейнеров слева при выборе диапазона */
  --datepicker-wrapper-range-left-border-radius: var(--datepicker-wrapper-border-radius) 0 0 var(--datepicker-wrapper-border-radius);
  /** радиус границы для элементов-контейнеров справа при выборе диапазона */
  --datepicker-wrapper-range-right-border-radius: 0 var(--datepicker-wrapper-border-radius) var(--datepicker-wrapper-border-radius) 0;
  /** радиус границы для самостоятельных элементов */
  --datepicker-content-border-radius: var(--radius-sm);
  /** радиус границы для стартового элемента при выборе диапазона */
  --datepicker-content-range-start-border-radius: var(--datepicker-content-border-radius) 0 0 var(--datepicker-content-border-radius);
  /** радиус границы для конечного элемента при выборе диапазона */
  --datepicker-content-range-end-border-radius: 0 var(--datepicker-content-border-radius) var(--datepicker-content-border-radius) 0;
  --datepicker-content-padding: var(--spacing-2) var(--spacing-3);
  --datepicker-weekdays-padding-bottom: var(--spacing-2);

  --datepicker-weekdays-font-size: var(--paragraph-xs-font-size);
  --datepicker-weekdays-font-weight: var(--paragraph-xs-font-weight);
  --datepicker-weekdays-line-height: var(--paragraph-xs-line-height);
  --datepicker-weekdays-letter-spacing: var(--paragraph-xs-letter-spacing);

  --datepicker-cell-font-size: var(--paragraph-sm-font-size);
  --datepicker-cell-font-weight: var(--paragraph-sm-font-weight);
  --datepicker-cell-line-height: var(--paragraph-sm-line-height);
  --datepicker-cell-letter-spacing: var(--paragraph-sm-letter-spacing);

  --datepicker-header-font-size: var(--subtitle-sm-font-size);
  --datepicker-header-font-weight: var(--subtitle-sm-font-weight);
  --datepicker-header-line-height: var(--subtitle-sm-line-height);
  --datepicker-header-letter-spacing: var(--subtitle-sm-letter-spacing);

  --datepicker-time-header-font-size: var(--subtitle-lg-font-size);
  --datepicker-time-header-font-weight: var(--subtitle-lg-font-weight);
  --datepicker-time-header-line-height: var(--subtitle-lg-line-height);
  --datepicker-time-header-letter-spacing: var(--subtitle-lg-letter-spacing);

  --datepicker-button-padding: var(--spacing-1) var(--spacing-2-5);

  --datepicker-button-font-size: var(--action-md-font-size);
  --datepicker-button-font-weight: var(--action-md-font-weight);
  --datepicker-button-line-height: var(--action-md-line-height);
  --datepicker-button-letter-spacing: var(--action-md-letter-spacing);

  /** размер кнопок-стрелок в хедере */
  --datepicker-arrow-button-size: 12px;
  --datepicker-arrow-button-color: var(--color-text-primary);
  --datepicker-double-arrow-button-color: var(--color-text-secondary);

  --datepicker-clear-button-background: var(--color-neutral-200);
  --datepicker-clear-button-hover-background: var(--color-neutral-100);
  --datepicker-clear-button-active-background: var(--color-neutral-300);

  /** datepicker input */
  --datepicker-input-font-size: var(--input-text-font-size);
  --datepicker-input-font-weight: var(--input-text-font-weight);
  --datepicker-input-line-height: var(--input-text-line-height);
  --datepicker-input-letter-spacing: var(--input-text-letter-spacing);

  --datepicker-input-background-color: var(--input-text-background);
  --datepicker-input-text-color: var(--input-text-text-color);
  --datepicker-input-placeholder-color: var(--input-text-placeholder-color);
  --datepicker-input-hover-border-color: var(--input-text-border-color-hover);
  --datepicker-input-focus-border-color: var(--input-text-border-color-focus);
  --datepicker-input-border: var(--input-text-border);
  --datepicker-input-border-radius: var(--input-text-border-radius);
  --datepicker-input-padding: 0 var(--spacing-4) 0 var(--spacing-1-5);

  --datepicker-input-error-border-color: var(--input-text-error-color);
  --datepicker-input-error-color: var(--input-text-error-color);

  --datepicker-input-sm-height: var(--input-text-height-sm);
  --datepicker-input-lg-height: var(--input-text-height-lg);

  --datepicker-input-disabled-background-color: var(--input-text-disabled-background-color);
  --datepicker-input-disabled-border-color: var(--input-text-disabled-border-color);
  --datepicker-input-disabled-text-color: var(--input-text-disabled-text-color);
  --datepicker-input-icon-right: var(--spacing-1-5);
}

.mx-datepicker {
  position: relative;
  display: inline-block;
  width: 100%;
  max-width: 100%;
}

/** header icons */

.mx-icon-left:before,
.mx-icon-right:before,
.mx-icon-double-left:before,
.mx-icon-double-right:before,
.mx-icon-double-left:after,
.mx-icon-double-right:after {
  content: "";
  position: relative;
  top: -1px;
  display: inline-block;
  width: var(--datepicker-arrow-button-size);
  height: var(--datepicker-arrow-button-size);
  vertical-align: middle;
  border-style: solid;
  border-color: currentColor;
  border-width: 3px 0 0 3px;
  border-radius: 1px;
  transform-origin: center;
  transform: rotate(-45deg) scale(0.7);
}

.mx-icon-double-left,
.mx-icon-double-right {
  color: var(--datepicker-double-arrow-button-color);
}

.mx-calendar-panel-month .mx-icon-double-left:hover,
.mx-calendar-panel-month .mx-icon-double-right:hover,
.mx-calendar-panel-year .mx-icon-double-left:hover,
.mx-calendar-panel-year .mx-icon-double-right:hover,
.mx-icon-double-left:hover,
.mx-icon-double-right:hover {
  color: var(--datepicker-main-color);
}

.mx-icon-double-left:before,
.mx-icon-double-right:before,
.mx-icon-double-left:after,
.mx-icon-double-right:after {
  transform: rotate(-45deg) scale(0.6);
}

.mx-icon-double-left:after {
  left: -6px;
}

.mx-icon-double-right:before {
  left: 6px;
}

.mx-icon-right:before,
.mx-icon-double-right:before,
.mx-icon-double-right:after {
  transform: rotate(135deg) scale(0.6);
}

.mx-calendar-panel-month .mx-icon-double-left,
.mx-calendar-panel-month .mx-icon-double-right,
.mx-calendar-panel-year .mx-icon-double-left,
.mx-calendar-panel-year .mx-icon-double-right {
  color: var(--datepicker-text-color);
}

.mx-calendar-panel-month .mx-icon-double-left::after,
.mx-calendar-panel-month .mx-icon-double-right::before,
.mx-calendar-panel-year .mx-icon-double-left::after,
.mx-calendar-panel-year .mx-icon-double-right::before {
  border-color: transparent;
}

.mx-calendar-panel-month .mx-icon-double-left::before,
.mx-calendar-panel-month .mx-icon-double-right::after .mx-calendar-panel-year .mx-icon-double-left::before,
.mx-calendar-panel-year .mx-icon-double-right::after {
  border-color: var(--datepicker-text-color);
}

/** buttons */

.mx-btn {
  padding: var(--datepicker-button-padding);
  margin: 0;
  cursor: pointer;
  background-color: transparent;
  outline: none;
  border: var(--datepicker-border);
  border-radius: var(--datepicker-content-border-radius);
  color: var(--datepicker-text-color);
  white-space: nowrap;
  transition: .2s ease;
}

.mx-btn:hover {
  border-color: var(--datepicker-main-color);
  color: var(--datepicker-main-color);
}

.mx-btn:disabled,
.mx-btn.disabled {
  cursor: not-allowed;
  color: var(--datepicker-disabled-color);
}

.mx-btn-text {
  border: 0;
  padding: 0 4px;
  text-align: left;
  line-height: inherit;
}

/** scrollbar */

.mx-scrollbar {
  height: 100%;
}

.mx-scrollbar:hover .mx-scrollbar-track {
  opacity: 1;
}

.mx-scrollbar-wrap {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.mx-scrollbar-wrap::-webkit-scrollbar {
  display: none;
}

.mx-scrollbar-track {
  position: absolute;
  top: 2px;
  right: 2px;
  bottom: 2px;
  width: 6px;
  z-index: 1;
  border-radius: var(--datepicker-content-border-radius);
  opacity: 0;
  transition: opacity .24s ease-out;
}

.mx-scrollbar-track .mx-scrollbar-thumb {
  position: absolute;
  width: 100%;
  height: 0;
  cursor: pointer;
  border-radius: inherit;
  background-color: rgba(144, 147, 153, .3);
  transition: background-color .3s;
}

.mx-zoom-in-down-enter-active,
.mx-zoom-in-down-leave-active {
  opacity: 1;
  transform: scale(1);
  transition: opacity .3s cubic-bezier(0.23, 1, 0.32, 1), transform .3s cubic-bezier(0.23, 1, 0.32, 1);
}

.mx-zoom-in-down-enter,
.mx-zoom-in-down-enter-from,
.mx-zoom-in-down-leave-to {
  opacity: 0;
  transform: scale(.97);
}

.mx-datepicker .mx-input-wrapper svg {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
}

.mx-datepicker-range {
  width: 100%;
}

.mx-datepicker-inline {
  width: auto;
}

.mx-input-wrapper {
  position: relative;
}

.mx-input {
  display: inline-block;
  width: 100%;
  color: var(--datepicker-input-text-color);
  background-color: var(--datepicker-input-background-color);
  border: var(--datepicker-input-border);
  border-radius: var(--datepicker-input-border-radius);
  transition: .2s ease;
  font-size: var(--datepicker-input-font-size);
  font-weight: var(--datepicker-input-font-weight);
  line-height: var(--datepicker-input-line-height);
  letter-spacing: var(--datepicker-input-letter-spacing);
  padding: var(--datepicker-input-padding);
}

.ui-datepicker--error.mx-input,
.ui-datepicker--error.mx-input:focus,
.ui-datepicker--error.mx-input:hover {
  border-color: var(--datepicker-input-error-border-color);
}

.ui-datepicker--error+.mx-icon-calendar {
  color: var(--datepicker-input-error-color);
}

.ui-datepicker--lg.mx-input {
  height: var(--datepicker-input-lg-height);
}

.ui-datepicker--sm.mx-input {
  height: var(--datepicker-input-sm-height);
}

.mx-input:hover {
  border-color: var(--datepicker-input-hover-border-color);
}

.mx-input:focus {
  border-color: var(--datepicker-input-focus-border-color);
}

.mx-input::placeholder {
  color: var(--datepicker-input-placeholder-color);
}

.mx-input:disabled,
.mx-input.disabled {
  background-color: var(--datepicker-input-disabled-background-color);
  color: var(--datepicker-input-disabled-text-color);
  cursor: not-allowed;
}

:is(.mx-input:disabled, .mx-input.disabled):not(.ui-datepicker--error) {
  border-color: var(--datepicker-input-disabled-border-color);
}

.mx-datepicker.disabled {
  color: var(--datepicker-input-disabled-text-color);
}

.mx-input:disabled::placeholder {
  color: var(--datepicker-input-disabled-text-color);
}

.mx-input:focus {
  outline: none
}

.mx-input::-ms-clear {
  display: none
}

.mx-icon-calendar,
.mx-icon-clear {
  position: absolute;
  top: 50%;
  right: var(--datepicker-input-icon-right);
  transform: translateY(-50%);
  font-size: 20px;
}

.mx-datepicker-sidebar {
  float: left;
  padding: 6px;
  overflow: auto
}

.mx-datepicker-sidebar+.mx-datepicker-content {
  border-left: var(--datepicker-border)
}

.mx-datepicker-body {
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding: var(--datepicker-body-padding);
}

.mx-btn-shortcut {
  display: block;
  padding: 0 6px;
  line-height: 24px
}

.mx-range-wrapper {
  background-color: var(--datepicker-popup-background-color);
  display: flex;
  justify-content: center;
}

.mx-datepicker-header {
  padding: 6px 8px;
  border-bottom: var(--datepicker-border);
}

.mx-datepicker-footer {
  padding: var(--datepicker-footer-padding);
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--datepicker-footer-gap);
}

.mx-datepicker-footer-slot {
  width: 100%;
  order: 0;
}

.mx-calendar {
  width: 252px;
}

.mx-calendar+.mx-calendar {
  border-left: var(--datepicker-border);
}

.mx-calendar-header,
.mx-time-header {
  height: 20px;
  text-align: center;
  overflow: hidden;
  margin-bottom: var(--datepicker-header-margin-bottom);
  display: flex;
  justify-content: space-between;
}

.mx-btn-icon-left,
.mx-btn-icon-double-left {
  order: 0;
}

.mx-btn-icon-double-right {
  order: 2;
}

.mx-btn-icon-right {
  order: 1;
}

.mx-calendar-header-label {
  font-size: var(--datepicker-header-font-size);
  font-weight: var(--datepicker-header-font-weight);
  line-height: var(--datepicker-header-line-height);
  letter-spacing: var(--datepicker-header-letter-spacing);
  color: var(--datepicker-text-color);
}

.mx-time-header-title {
  font-size: var(--datepicker-time-header-font-size);
  font-weight: var(--datepicker-time-header-font-weight);
  line-height: var(--datepicker-time-header-line-height);
  letter-spacing: var(--datepicker-time-header-letter-spacing);
  color: var(--datepicker-main-color);
}

.mx-btn-current-month {
  text-transform: capitalize;
}

.mx-calendar-decade-separator {
  margin: 0 2px
}

.mx-calendar-decade-separator:after {
  content: "-"
}

.mx-calendar-content {
  position: relative;
  height: 247px;
}

.mx-range-wrapper .mx-calendar-content {
  height: 281px;
}

.mx-range-wrapper .mx-calendar {
  width: 302px;
}

.mx-calendar-content .cell {
  color: var(--datepicker-text-color);
  line-height: 1;
  cursor: pointer;
}

.mx-calendar-content .cell.disabled {
  cursor: not-allowed;
  background-color: var(--datepicker-disabled-background-color);
  color: var(--datepicker-disabled-color);
}

.mx-calendar-content .cell.disabled:hover {
  border-radius: 0;
  background-color: var(--datepicker-disabled-background-color);
  color: var(--datepicker-disabled-color);
}

.mx-calendar-content .cell.not-current-month.disabled {
  background: var(--datepicker-disabled-background-color);
  opacity: .5;
}

.mx-calendar-week-mode .mx-calendar-content .mx-table-date .mx-date-row {
  cursor: pointer;
}

.mx-calendar-week-mode .mx-calendar-content .mx-table-date .mx-date-row:hover,
.mx-calendar-week-mode .mx-calendar-content .mx-table-date .mx-date-row:hover .cell {
  color: inherit;
  background-color: var(--datepicker-third-color);
}

.mx-calendar-week-mode .mx-calendar-content .mx-table-date .mx-date-row:hover:has(.cell.disabled) {
  cursor: not-allowed;
  background-color: transparent;
}

.mx-calendar-week-mode .mx-calendar-content .mx-table-date .mx-date-row:hover:has(.cell.disabled) .cell {
  color: var(--datepicker-disabled-color);
  background-color: var(--datepicker-disabled-background-color);
}

.mx-calendar-week-mode .mx-calendar-content .mx-table-date .mx-date-row.mx-active-week,
.mx-calendar-week-mode .mx-calendar-content .mx-table-date .mx-date-row.mx-active-week .cell,
.mx-calendar-week-mode .mx-calendar-content .mx-table-date .mx-date-row.mx-active-week:hover {
  color: var(--datepicker-inversion-text-color);
  background-color: var(--datepicker-main-color);
}

.mx-calendar-week-mode .mx-calendar-content .mx-table-date .mx-date-row .cell,
.mx-calendar-week-mode .mx-calendar-content .mx-table-date .mx-date-row.mx-active-week .cell,
.mx-calendar-week-mode .mx-calendar-content .mx-table-date .mx-date-row.mx-active-week .cell.active,
.mx-calendar-week-mode .mx-calendar-content .mx-table-date .mx-date-row .cell:hover,
.mx-calendar-week-mode .mx-calendar-content .mx-table-date .mx-date-row:hover .cell:hover {

  border-radius: 0;
  border: none;
}

.mx-table {
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  height: 100%;
  text-align: center
}

.mx-table th {
  padding: 0;
  font-weight: 500;
  vertical-align: middle
}

.mx-table td {
  padding: 0;
  vertical-align: middle;
  font-size: var(--datepicker-cell-font-size);
  font-weight: var(--datepicker-cell-font-weight);
  line-height: var(--datepicker-cell-line-height);
  letter-spacing: var(--datepicker-cell-letter-spacing);
  padding-bottom: var(--datepicker-cell-padding-bottom);
}

.mx-table-date td,
.mx-table-date th {
  height: 36px;
  font-size: 12px
}

.mx-table thead th {
  height: auto;
  color: var(--datepicker-weekdays-color);
  text-transform: capitalize;
  font-size: var(--datepicker-weekdays-font-size);
  font-weight: var(--datepicker-weekdays-font-weight);
  line-height: var(--datepicker-weekdays-line-height);
  letter-spacing: var(--datepicker-weekdays-letter-spacing);
  padding-bottom: var(--datepicker-weekdays-padding-bottom);
}

.mx-table-date .mx-week-number {
  border-right: var(--datepicker-border);
  font-size: 0.9em;
  opacity: .5
}

.mx-table-date .cell.not-current-month {
  color: var(--datepicker-cell-not-in-current-month-color);
  background: none
}

.mx-time {
  width: 203px;
  margin: 0 auto;
  background: var(--datepicker-popup-background-color);
}

.mx-time:has(+.mx-time),
.mx-time+.mx-time {
  width: 213px;
}

.mx-range-wrapper+.mx-range-wrapper .mx-time:has(+.mx-time) .mx-time-content,
.mx-range-wrapper+.mx-range-wrapper .mx-time+.mx-time .mx-time-content {
  height: 278px;
}

.mx-range-wrapper+.mx-range-wrapper .mx-time:has(+.mx-time) .mx-time-column .mx-time-list::after,
.mx-range-wrapper+.mx-range-wrapper .mx-time+.mx-time .mx-time-column .mx-time-list::after {
  height: 216px;
}

.mx-range-wrapper .mx-time:first-child {
  padding-right: 10px;
}

.mx-range-wrapper .mx-time {
  margin: 0;
}

.mx-range-wrapper .mx-time+.mx-time {
  padding-left: 10px;
}

.mx-calendar-time {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: var(--spacing-2-5);
}

.mx-time-header {
  height: auto;
  padding: 0;
  justify-content: center;
}

.mx-time-content {
  height: 212px;
  overflow: hidden;
  border-radius: var(--datepicker-wrapper-border-radius);
  border: var(--datepicker-border);
  padding: var(--spacing-2) 0;
}

.mx-time-columns {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden
}

.mx-time-column {
  flex: 1;
  position: relative;
  border-left: var(--datepicker-border);
  text-align: center;
  padding: 0;
}

.mx-time-column:first-child {
  border-left: 0;
  padding-left: var(--spacing-3);
  padding-right: var(--spacing-2-5);
}

.mx-time-column:last-child {
  padding-right: var(--spacing-3);
  padding-left: var(--spacing-2-5);
}

.mx-time-column .mx-time-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.mx-time-column .mx-time-list::after {
  content: "";
  display: block;
  height: 150px
}

.mx-time-column .mx-time-item {
  cursor: pointer;
  font-size: var(--datepicker-cell-font-size);
  font-weight: var(--datepicker-cell-font-weight);
  line-height: var(--datepicker-cell-line-height);
  letter-spacing: var(--datepicker-cell-letter-spacing);
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--datepicker-content-border-radius);
}

.mx-time-column .mx-time-item:hover {
  background-color: var(--datepicker-third-color);
}

.mx-time-column .mx-time-item.active {
  color: var(--datepicker-inversion-text-color);
  background-color: var(--datepicker-main-color);
}

.mx-time-column .mx-time-item.disabled {
  background-color: var(--datepicker-disabled-background-color);
  cursor: not-allowed;
  color: var(--datepicker-disabled-color);
}

.mx-time-column .mx-time-item.disabled:hover {
  background-color: var(--datepicker-disabled-background-color);
}

.mx-time-option {
  cursor: pointer;
  padding: 8px 10px;
  font-size: 14px;
  line-height: 20px
}

.mx-time-option:hover {
  background-color: var(--datepicker-third-color);
}

.mx-time-option.active {
  color: var(--datepicker-main-color);
  background-color: var(--datepicker-popup-background-color);
  font-weight: 600;
}

.mx-time-option.disabled {
  cursor: not-allowed;
  color: var(--datepicker-disabled-color);
  background-color: var(--datepicker-disabled-background-color);
}

.mx-datepicker-main {
  background-color: var(--datepicker-popup-background-color);
  border: var(--datepicker-border);
  border-radius: var(--datepicker-wrapper-border-radius);
  display: flex;
  font-weight: 400;
  line-height: 15px;
}

.mx-datepicker-popup {
  position: absolute;
  margin-top: 2px;
  margin-bottom: 1px;
  z-index: 2001;
  box-shadow: var(--datepicker-box-shadow);
}

.mx-calendar-content {
  border: var(--datepicker-border);
  border-radius: var(--datepicker-wrapper-border-radius);
}

.mx-datepicker-body:not(:has(.mx-range-wrapper)) .mx-calendar-panel-date .mx-calendar-content {
  border: none;
}

.cell.in-range {
  background: var(--datepicker-second-color);
  color: var(--datepicker-main-color);
}

.cell:hover {
  border-radius: var(--datepicker-content-border-radius);
  background: var(--datepicker-third-color);
  color: var(--datepicker-text-color);
}

.cell.today.active,
.cell.active {
  border: none;
  color: var(--datepicker-inversion-text-color);
  border-radius: var(--datepicker-content-border-radius);
  background: var(--datepicker-main-color);
}

.cell.today {
  border-radius: var(--datepicker-content-border-radius);
  border: var(--datepicker-today-cell-border);
  color: var(--datepicker-text-color);
}

.cell.today:hover {
  border: none;
}

.mx-range-wrapper .mx-calendar-panel-date .cell.today.in-range,
.mx-range-wrapper .mx-calendar-panel-date .cell.active:hover {
  color: var(--datepicker-inversion-text-color);
}

.mx-range-wrapper .mx-calendar-panel-date .cell.active,
.mx-range-wrapper .mx-calendar-panel-date .cell:last-child:hover,
.mx-range-wrapper .mx-calendar-panel-date .cell.active:first-child,
.mx-range-wrapper .mx-calendar-panel-date .cell:hover:has(+ .cell.hover-in-range),
.mx-range-wrapper .mx-calendar-panel-date .cell.active:first-child:has(+ .cell.active),
.mx-range-wrapper .mx-calendar-panel-date .cell.active:first-child:has(+ .cell.in-range),
.mx-range-wrapper .mx-calendar-panel-date .cell.active:first-child:has(+ .cell.hover-in-range) {
  border-radius: var(--datepicker-content-range-start-border-radius);
}

.mx-range-wrapper .mx-calendar-panel-date .cell:first-child:hover,
.mx-range-wrapper .mx-calendar-panel-date .cell.active:first-child,
.mx-range-wrapper .mx-calendar-panel-date .cell.active+.cell.active,
.mx-range-wrapper .mx-calendar-panel-date .cell.in-range+.cell.active,
.mx-range-wrapper .mx-calendar-panel-date .cell.hover-in-range+.cell:hover,
.mx-range-wrapper .mx-calendar-panel-date .cell.hover-in-range+.cell.active,
.mx-range-wrapper .mx-calendar-panel-date .cell.active+.cell:hover:not(.cell.in-range),
.mx-range-wrapper .mx-calendar-panel-date .cell:hover+.cell.active:not(:has(+.cell.in-range)):not(:has(+.cell.active)) {
  border-radius: var(--datepicker-content-range-end-border-radius);
}

.mx-range-wrapper .mx-calendar-panel-date .cell.in-range,
.mx-range-wrapper .mx-calendar-panel-date .cell.in-range:hover,
.mx-range-wrapper .mx-calendar-panel-date .cell.hover-in-range,
.mx-range-wrapper .mx-calendar-panel-date .cell.today.in-range,
.mx-range-wrapper .mx-calendar-panel-date .cell.today.hover-in-range {
  border-radius: 0;
  border: none;
  background: var(--datepicker-second-color);
  color: var(--datepicker-main-color);
}

.mx-range-wrapper .mx-calendar-panel-date .cell.not-current-month.hover-in-range,
.mx-range-wrapper .mx-calendar-panel-date .cell.not-current-month.in-range {
  color: var(--datepicker-disabled-color);
  background-color: transparent;
}

.mx-range-wrapper .mx-calendar.mx-calendar-panel-date {
  padding: 0;
}

.mx-range-wrapper .mx-calendar .mx-calendar-content {
  padding: var(--datepicker-content-padding);
}

.mx-range-wrapper .mx-calendar.mx-calendar-panel-month:first-child .mx-calendar-content,
.mx-range-wrapper .mx-calendar.mx-calendar-panel-year:first-child .mx-calendar-content,
.mx-range-wrapper .mx-calendar.mx-calendar-panel-date:first-child .mx-calendar-content {
  border-radius: var(--datepicker-wrapper-range-left-border-radius);
  border-right-color: transparent;
}

.mx-range-wrapper .mx-calendar.mx-calendar-panel-month:last-child .mx-calendar-content,
.mx-range-wrapper .mx-calendar.mx-calendar-panel-year:last-child .mx-calendar-content,
.mx-range-wrapper .mx-calendar.mx-calendar-panel-date:last-child .mx-calendar-content {
  border-radius: var(--datepicker-wrapper-range-right-border-radius);
  border-left-color: transparent;
}

.mx-range-wrapper .mx-calendar.mx-calendar-panel-date .mx-calendar-header {
  padding: 0 12px;
}

.mx-range-wrapper .mx-calendar:first-child .mx-table-date::after,
.mx-range-wrapper .mx-calendar:first-child .mx-table-month::after,
.mx-range-wrapper .mx-calendar:first-child .mx-table-year::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: -2px;
  margin: auto;
  height: 85%;
  width: 1px;
  background: var(--datepicker-border-color);
}

.mx-calendar+.mx-calendar {
  border-left: 0;
}

.mx-datepicker .mx-icon-clear {
  cursor: pointer;
}

.mx-datepicker-btn-reset {
  background: var(--datepicker-third-color);
  order: 1;
}

.mx-datepicker-btn-confirm,
.mx-datepicker-btn-clear {
  display: flex;
  align-items: center;
  border: none;
  font-size: var(--datepicker-header-font-size);
  font-weight: var(--datepicker-header-font-weight);
  line-height: var(--datepicker-header-line-height);
  letter-spacing: var(--datepicker-header-letter-spacing);
}

.mx-datepicker-btn-confirm {
  background-color: var(--datepicker-main-color);
  color: var(--datepicker-inversion-text-color);
  order: 0;
}

.mx-datepicker-btn-clear {
  background-color: var(--datepicker-clear-button-background);
  color: var(--datepicker-text-color);
  order: 2;
}

.mx-datepicker-btn-clear:hover {
  background-color: var(--datepicker-clear-button-hover-background);
  color: var(--datepicker-text-color);
}

.mx-datepicker-btn-clear:active {
  background-color: var(--datepicker-clear-button-active-background);
}

.mx-datepicker-btn-confirm:hover {
  background: var(--datepicker-button-hover-color);
  color: var(--datepicker-inversion-text-color);
}

.mx-datepicker-btn-confirm:active {
  background-color: var(--datepicker-main-color);
}

.mx-datepicker-btn-confirm:hover {
  background: var(--datepicker-button-hover-color);
  color: var(--datepicker-inversion-text-color);
}

.mx-datepicker-btn-confirm:active {
  background-color: var(--datepicker-main-color);
}

.mx-calendar.mx-calendar-panel-month .mx-calendar-content {
  border-radius: var(--datepicker-wrapper-range-left-border-radius);
}

.mx-datepicker-body:not(:has(.mx-range-wrapper)):has(.mx-calendar-panel-year)+.mx-datepicker-footer {
  width: 195px;
}

.mx-datepicker-body:not(:has(.mx-range-wrapper))+.mx-datepicker-footer .mx-datepicker-btn-clear,
.mx-datepicker-body:not(:has(.mx-range-wrapper))+.mx-datepicker-footer .mx-datepicker-btn-confirm {
  width: 100%;
  justify-content: center;
}

.mx-datepicker-body:not(:has(.mx-range-wrapper)):has(.mx-calendar-panel-year) {
  padding: var(--spacing-2-5) 10px;
}

.mx-calendar.mx-calendar-panel-year .mx-calendar-content {
  padding: 0;
  border: none;
}

.mx-calendar.mx-calendar-panel-year {
  width: 175px;
  margin: 0 auto;
}

.mx-range-wrapper .mx-calendar.mx-calendar-panel-year .mx-table-year {
  height: 214px;
}

.mx-range-wrapper .mx-calendar.mx-calendar-panel-year .mx-calendar-content {
  border: var(--input-text-border);
  padding: var(--spacing-2) var(--spacing-0-5);
  height: calc(100% - 40px);
}

.mx-range-wrapper .mx-calendar.mx-calendar-panel-year {
  width: 184px;
}

.mx-calendar.mx-calendar-panel-month .mx-calendar-content {
  padding: var(--spacing-2) 6px;
  border: none;
  height: 144px;
}

.mx-calendar.mx-calendar-panel-month {
  width: 252px;
  margin: 0 auto;
}

.mx-range-wrapper .mx-calendar.mx-calendar-panel-month .mx-table-month {
  height: 146px;
}

.mx-range-wrapper .mx-calendar.mx-calendar-panel-month .mx-calendar-content {
  height: calc(100% - 40px);
  border: var(--input-text-border);
}

.mx-range-wrapper .mx-calendar.mx-calendar-panel-month {
  width: 254px;
}

.mx-calendar.mx-calendar-panel-month .mx-calendar-header,
.mx-calendar.mx-calendar-panel-year .mx-calendar-header {
  justify-content: center;
}

.mx-calendar.mx-calendar-panel-year .mx-calendar-content {
  height: 180px;
}

.mx-calendar.mx-calendar-panel-year .mx-calendar-content .mx-table-year {
  border-collapse: separate;
  border-spacing: 20px 0;
}

.mx-range-wrapper .mx-calendar+.mx-calendar.mx-calendar-panel-month .mx-calendar-content,
.mx-range-wrapper .mx-calendar+.mx-calendar.mx-calendar-panel-year .mx-calendar-content {
  border-radius: var(--datepicker-wrapper-range-right-border-radius);
}

.mx-table-month td {
  text-transform: capitalize;
}

@media(max-width: 720px) {
  .mx-range-wrapper {
    flex-direction: column
  }

  .mx-range-wrapper .mx-calendar+.mx-calendar {
    margin-top: 20px;
  }

  .mx-range-wrapper .mx-calendar:first-child .mx-table-date::after {
    content: none;
  }

  .mx-range-wrapper .mx-calendar.mx-calendar-panel-date:first-child .mx-calendar-content,
  .mx-range-wrapper .mx-calendar.mx-calendar-panel-date:last-child .mx-calendar-content {
    border: var(--datepicker-border);
    border-radius: var(--datepicker-wrapper-border-radius);
  }

}
</style>
