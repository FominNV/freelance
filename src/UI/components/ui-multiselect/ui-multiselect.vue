<template>
  <div :class="classes">
    <multiselect
      v-bind="$props"
      v-model="model"
      :options="options"
      :placeholder="placeholder"
      v-on="$listeners"
      @open="handleOpen"
      @close="handleClose"
      @search-change="handleSearch"
      ref="vueMultiselect"
    >
      <template
        #option="{ option }"
        v-if="multiple && showCheckboxes"
      >
        <ui-checkbox
          :modelValue="isOptionSelected(option)"
          :value="option"
          size="sm"
          @click.prevent
        >
          <!-- @slot слот для настройки текста опции -->
          <slot
            name="optionLabel"
            :option="option"
          >
            {{ label ? option[label] : option }}
          </slot>
        </ui-checkbox>
      </template>
      <template #noResult>
        <!--@slot Слот для сообщения, когда ничего не найдено-->
        <slot name="noResult">
          {{ showSearchText ? rrMultiselectLabels.searchLabel : rrMultiselectLabels.noResultLabel }}
        </slot>
      </template>

      <template #noOptions>
        <!--@slot Слот для сообщения, когда список пуст-->
        <slot name="noOptions">
          {{ rrMultiselectLabels.noOptionsLabel }}
        </slot>
      </template>
      <template #maxElements>
        <!--@slot Слот для сообщения, когда список пуст-->
        <slot
          name="maxElements"
          v-if="max"
        >
          {{ rrMultiselectLabels.maxElements(max) }}
        </slot>
      </template>

      <template
        v-for="(_, slotName) in $scopedSlots"
        #[slotName]="scope"
      >
        <slot
          :name="slotName"
          v-bind="scope"
        />
      </template>
      <template #caret>
        <div
          class="ui-multiselect__icon"
          v-if="icon"
        >
          <ui-icon :name="icon" />
        </div>
        <transition name="fade">
          <div
            class="ui-multiselect__dropdown-icon"
            v-if="!loading && !hideDropdownIcon"
          >
            <ui-icon :name="dropdownIcon" />
          </div>
        </transition>
      </template>
      <template #tag="ctx">
        <!-- @slot слот для настройки тэга -->
        <slot
          name="tag"
          :ctx="ctx"
        >
          <ui-chip
            class="multiselect__tag"
            v-if="label"
            :value="ctx.option[label]"
            :size="size === 'lg' ? 'md' : 'sm'"
            :allowCreate="false"
            :allowEdit="false"
            :allowRemove="allowEmpty ? true : modelValue.length > 1"
            @remove="ctx.remove(ctx.option)"
            inputMaxWidth="100%"
            :disabled="disabled"
          />
        </slot>
      </template>
    </multiselect>
  </div>
</template>

<script setup lang="ts">
// FIXME: иконки некорректно отображаются со слотом clear

// TODO: Придумать как обойти стандартное поведение компонента.
// При активном hideSelected и всех выбранных опциях под селектом отображается пустой дропдаун

import { debounce } from 'lodash';
import { computed, onBeforeMount, ref } from 'vue';
import Multiselect from 'vue-multiselect';
import { IconsConfig } from '../../@types/icons-config';
import { ClassPropsType } from '../../@types/props';
import { useConfigParam } from '../../lib/useConfigParam';
import { UiIcon } from '../ui-icon';
import { MultiselectSizesType, rrMultiselectLabels } from './const';

export interface UiMultiselectPropsImpl {
  /** модель мультиселекта */
  modelValue: any;
  /** элементы(опции) мультиселекта */
  options: unknown[];
  /** Используется для идентификации компонента в ивентах */
  id?: number | string;
  /** Вкл/выкл. множественный выбор */
  multiple?: boolean;
  /** Плэйсхолдер */
  placeholder?: string;
  /** Используется для сравнения объектов. Только если options состоит из объектов */
  trackBy?: string;
  /** Отображаемый в дропдауне label из объекта для выбора из пропса option */
  label?: string;
  /** Размер инпута */
  size?: MultiselectSizesType,
  /** Добавить/убрать инпут для поиска */
  searchable?: boolean;
  /** Очистить инпут для поиска после ивента select.
   * Использовать только в режиме multiple (выбора элемента).
   * */
  clearOnSelect?: boolean;
  /** Скрывать в списке уже выбранные элементы */
  hideSelected?: boolean;
  /** Разрешить убрать все  выбранные элементы.s
   * В противном случае хотя-бы один элемент должен быть выбран
   * */
  allowEmpty?: boolean;
  /** Сбрасывать значения value, search, selected после изменения value */
  resetAfter?: boolean;
  /** Закрывать дропдаун после выбора элемента */
  closeOnSelect?: boolean;
  /** Показать чекбоксы */
  showCheckboxes?: boolean;
  /** Сортировка списка элементов */
  sort?: 'selectedUp';
  /** Режим tagging (пользователь сам может добавлять значения(тэги) ).
   * Подробнее https://vue-multiselect.js.org/#sub-tagging
  */
  taggable?: boolean;
  /** Плэйсхолдер для инпута добавления новых значений(тэгов) */
  tagPlaceholder?: string;
  /** Расположение инпута для создания новых значений.
   * Над или под списком результатов поиска
   * */
  tagPosition?: 'top' | 'bottom';
  /** Максимально допустимое кол-во выбранных элементов */
  max?: number;
  /** Максимальное кол-во элементов отображаемых в дропдауне */
  optionsLimit?: number;
  /** Имя свойства объекта содержащего элементы группы */
  groupValues?: string;
  /** Имя свойства объекта содержащего название группы */
  groupLabel?: string;
  /** Разрешать выбирать все элементы группы по клику на главный элемент группы */
  groupSelect?: boolean;
  /** Массив алиасов клавиш для блокировки при выборе */
  blockKeys?: string[],
  /** Определяет, следует ли внутренне фильтровать результаты на основе поискового запроса.
   * Полезно для асинхронной фильтрации, когда мы ищем более сложные данные.
   * */
  internalSearch?: boolean;
  /** Если true, будет сохраняться поисковый запрос при открытии/закрытии компонента */
  preserveSearch?: boolean;
  /** Выбирает первый элемент в списке, если изначально ничего не выбрано */
  preselectFirst?: boolean;
  /** Отключение автофокуса на инпуте поиска при открытии дропдауна */
  preventAutofocus?: boolean;
  /** Аттрибут имени, соответствует имени для label */
  name?: string;
  /** Иконка, отображаемая слева от инпута */
  icon?: IconsNamesType;
  /** Иконка при закрытом дропдауне */
  expandIcon?: IconsNamesType;
  /** Иконка при раскрытом дропдауне */
  expandedIcon?: IconsNamesType;
  /** Показать стиль ошибки */
  showError?: boolean;
  /** Показывать строки-подсказки рядом с элементами */
  showLabels?: boolean;
  /** Строка, показывающаяся при наведении на элемент */
  selectLabel?: string;
  /** Строка, показывающаяся при наведении на главный элемент группы элементов */
  selectGroupLabel?: string;
  /** Строка, показывающаяся рядом с выбранным элементом */
  selectedLabel?: string;
  /** Строка, показывающаяся при наведении на выбранный элемент */
  deselectLabel?: string;
  /** Строка, показывающаяся при наведении на выбранный главный элемент группы элементов */
  deselectGroupLabel?: string;
  /** Лимит отображения выбранных элементов,
   * остальные элементы скрываются с текстом из пропса labelText
   * */
  limit?: number;
  /** Функция, которая возвращает текст, отображаемый при превышении лимита из пропса limit */
  limitText?: (count: number) => string;
  /** Показать/скрыть спиннер загрузки */
  loading?: boolean;
  /** Вкл/выкл мультиселект */
  disabled?: boolean;
  /** CSS значение максимальной высоты дропдауна */
  maxHeight?: number;
  /** фиксированная позиция дропдауна при открытии (вместо автоматической). */
  openDirection?: '' | 'above' | 'top' | 'below' | 'bottom',
  /** Показать слот showNoOptions, если список пуст */
  showNoOptions?: boolean;
  /** Показать слот noResults, если список результатов пуст */
  showNoResults?: boolean;
  /** Определяет tabindex компонента */
  tabindex?: number;
  /** Включить\выключить ховер при наведении на элемент */
  showPointer?: boolean;
  /** Высота элемента выбора */
  optionHeight?: number;
  /** Время для ограничения срабатывания ивента search-change */
  debounceTiming?: number;
  /** Скрыть иконку дропдауна */
  hideDropdownIcon?: boolean;
  /** Горизонтальный скролл элементов */
  noWrap?: boolean;
  /** Предварительный выбор элемента по свойству из пропса track-by */
  preselect?: boolean;
}

const props = withDefaults(defineProps<UiMultiselectPropsImpl>(), {
  multiple: false,
  size: 'lg',
  searchable: true,
  clearOnSelect: true,
  hideSelected: false,
  allowEmpty: true,
  resetAfter: false,
  closeOnSelect: true,
  showCheckboxes: true,
  taggable: false,
  tagPosition: 'top',
  optionsLimit: 1000,
  groupSelect: false,
  blockKeys: () => [],
  internalSearch: true,
  preserveSearch: false,
  preselectFirst: false,
  preventAutofocus: false,
  name: '',
  selectLabel: rrMultiselectLabels.selectLabel,
  selectGroupLabel: rrMultiselectLabels.selectGroupLabel,
  selectedLabel: rrMultiselectLabels.selectedLabel,
  deselectLabel: rrMultiselectLabels.deselectLabel,
  deselectGroupLabel: rrMultiselectLabels.deselectGroupLabel,
  showLabels: false,
  limit: 99999,
  limitText: rrMultiselectLabels.limitText,
  loading: false,
  disabled: false,
  maxHeight: 300,
  openDirection: '',
  showNoOptions: true,
  showNoResults: true,
  tabindex: 0,
  showPointer: true,
  optionHeight: 40,
  showError: false,
  debounceTiming: 400,
  hideDropdownIcon: false,
  noWrap: false,
  preselect: false,
});

const emit = defineEmits<{
  /** Обновление модели инпута */
  (e: 'update:modelValue', value: typeof props.modelValue): void;
  /** Срабатывает при изменении value во внешнем компоненте */
  (e: 'input', value: typeof props.modelValue, id: typeof props.id): void;
  /** Выборе элемента */
  (e: 'select', value: typeof props.modelValue, id: typeof props.id): void;
  /** Отмена выбора элемента */
  (e: 'remove', value: typeof props.modelValue, id: typeof props.id): void;
  /** Изменение поискового запроса */
  (e: 'searchChange', value: string, id: typeof props.id): void;
  /** Срабатывает при попытке пользователя создать tag (добавить свой элемент) */
  (e: 'tag', value: string, id: typeof props.id): void;
  /** Открытие дропдауна */
  (e: 'open', id: typeof props.id): void;
  /** Закрытие дропдауна */
  (e: 'close', value: typeof props.modelValue, id: typeof props.id): void;
}>();

const model = computed<typeof props.modelValue>({
  get() {
    return props.modelValue;
  },
  set(newValue) {
    emit('update:modelValue', newValue);
  },
});

function selectedUpSort(a: any, b: any): number {
  if (!Array.isArray(model.value)) {
    return 0;
  }

  if (model.value.includes(a) && !model.value.includes(b)) {
    return -1;
  }

  return 1;
}

const options = computed<typeof props.options>(() => {
  if (props.multiple && props.sort === 'selectedUp') {
    return [...props.options].sort((a, b) => selectedUpSort(a, b));
  }

  return props.options;
});

const isOpen = ref<boolean>(false);
const vueMultiselect = ref<any>(null);
const showSearchText = ref<boolean>(false);

function isOptionSelected(option: any): boolean {
  if (!Array.isArray(props.modelValue)) {
    return false;
  }

  if (!props.trackBy) {
    return props.modelValue.includes(option);
  }

  return !!props.modelValue.find((item: any) => item[props.trackBy as any] === option[props.trackBy as any]);
}

function handleOpen(id: typeof props.id) {
  isOpen.value = true;
  emit('open', id);
}

function handleClose(value: typeof props.modelValue, id: typeof props.id) {
  isOpen.value = false;
  emit('close', value, id);
}

const searchTrigger = debounce((value: string, id: typeof props.id) => {
  emit('searchChange', value, id);
  showSearchText.value = false;
}, props.debounceTiming);

function handleSearch(value: string, id: typeof props.id) {
  showSearchText.value = true;
  searchTrigger(value, id);
}

const iconsConfig = useConfigParam('icons') as IconsConfig;
const expandIcon = computed<IconsNamesType>(() => props.expandIcon || iconsConfig.systemIcons.arrows.chevronDown);
const expandedIcon = computed<IconsNamesType>(() => props.expandedIcon || iconsConfig.systemIcons.arrows.chevronUp);
const dropdownIcon = computed<IconsNamesType>(() => (isOpen.value ? expandedIcon.value : expandIcon.value));

const placeholder = computed<string>(() => {
  if (props.placeholder) {
    return props.placeholder;
  }
  return props.multiple ? rrMultiselectLabels.placeholderMultiple : rrMultiselectLabels.placeholder;
});

function matchOptionByTrackBy(value: any, option: any): boolean {
  if (props.trackBy) {
    return value?.[props.trackBy] === option?.[props.trackBy];
  }
  return false;
}

onBeforeMount(() => {
  if (!props.options || !props.preselect || !props.modelValue || !props.trackBy) {
    return;
  }
  let match;

  if (Array.isArray(props.modelValue) && props.modelValue?.length && props.multiple) {
    match = props.options.filter((option: any) => props.modelValue.forEach((val: any) => matchOptionByTrackBy(val, option)));
  } else {
    match = props.options.find((option: any) => matchOptionByTrackBy(props.modelValue, option));
  }

  if (match) {
    model.value = match;
  }
});

const classes = computed<ClassPropsType>(() => [
  'ui-multiselect',
  `ui-multiselect--${props.size}`,
  {
    'ui-multiselect--multiple': props.multiple,
    'ui-multiselect--error': props.showError,
    'ui-multiselect--nowrap': props.noWrap,
    'ui-multiselect--show-labels': props.showLabels,
  },
]);

</script>

<style>
.ui-multiselect {
  --multiselect-color: var(--input-text-text-color);

  --multiselect-input-background-color: var(--input-text-background);
  --multiselect-input-min-height: var(--control-height-sm);
  --multiselect-input-width: 100%;
  --multiselect-input-outline: none;
  --multiselect-single-padding: var(--spacing-0-5);

  /** multiselect placeholder variables */

  --multiselect-placeholder-color: var(--input-text-placeholder-color);

  /** multiselect tags variables */

  --multiselect-tags-border-radius: var(--input-text-border-radius);
  --multiselect-tags-border-color: var(--input-text-border-color);
  --multiselect-tags-border: var(--input-text-border);
  --multiselect-tags-background-color: var(--input-text-background);
  --multiselect-tags-active-border-color: var(--input-text-border-color-focus);
  --multiselect-tags-hover-border-color: var(--input-text-border-color-hover);
  --multiselect-tags-gap: var(--spacing-1);
  --multiselect-tags-font-size: var(--paragraph-sm-font-size);
  --multiselect-tags-font-weight: var(--paragraph-sm-font-weight);
  --multiselect-tags-line-height: var(--paragraph-sm-line-height);
  --multiselect-tags-letter-spacing: var(--paragraph-sm-font-weight);

  /** multiselect loading spinner variables */

  --multiselect-loading-spinner-color: var(--text-color-accent);
  --multiselect-loading-spinner-size: 16px;
  --multiselect-loading-spinner-border-width: 2px;

  /** multiselect icon variables */

  --multiselect-icon-color: var(--text-color-primary);
  --multiselect-icon-left: 12px;
  --multiselect-icon-tags-padding-left: 40px;
  --multiselect-toggle-icon-right: 12px;

  /** multiselect tag variables */

  --multiselect-tag-margin: var(--spacing-1);

  /** multiselect strong variables */

  --multiselect-strong-line-height: 20px;

  /** multiselect option variables */

  --multiselect-option-padding: 12px;
  --multiselect-option-after-padding-right: var(--multiselect-option-padding);
  --multiselect-option-after-padding-left: 20px;
  --multiselect-option-after-height: 100%;

  --multiselect-option-font-size: var(--paragraph-sm-font-size);
  --multiselect-option-font-weight: var(--paragraph-sm-font-weight);
  --multiselect-option-line-height: var(--paragraph-sm-line-height);
  --multiselect-option-letter-spacing: var(--paragraph-sm-font-weight);

  /** multiselect option selected variables */

  --multiselect-option-selected-background-color: var(--color-primary-50);
  --multiselect-option-selected-color: var(--color-primary-500);
  --multiselect-option-selected-after-color: var(--color-text-primary);

  /** multiselect option selected highlight (hover) variables */

  --multiselect-option-selected-highlight-background-color: var(--color-primary-50);
  --multiselect-option-selected-highlight-color: var(--color-text-primary);
  --multiselect-option-selected-highlight-after-color: var(--color-text-primary);

  /** multiselect option highlight (hover) variables */

  --multiselect-option-highlight-outline: none;
  --multiselect-option-highlight-color: var(--color-text-primary);
  --multiselect-option-highlight-after-color: var(--color-text-primary);
  --multiselect-option-highlight-background-color: var(--color-primary-50);

  /** multiselect option highlight (hover) marker variables */

  --multiselect-option-highlight-marker-position: absolute;
  --multiselect-option-highlight-marker-background-color: var(--color-primary-100);
  --multiselect-option-highlight-marker-width: 4px;
  --multiselect-option-highlight-marker-height: 100%;
  --multiselect-option-highlight-marker-left: 0;
  --multiselect-option-highlight-marker-top: 0;

  /** multiselect content-wrapper (dropdown) variables */

  --multiselect-content-wrapper-background: var(--color-neutral-0);
  --multiselect-content-wrapper-width: 100%;
  --multiselect-content-wrapper-max-height: 240px;
  --multiselect-content-wrapper-border-radius: 4px;
  --multiselect-content-wrapper-border-color: var(--color-neutral-200);
  --multiselect-content-wrapper-border: 1px solid var(--multiselect-content-wrapper-border-color);
  --multiselect-content-wrapper-z-index: 50;
  --multiselect-content-wrapper-top: calc(100% + 4px);

  /** multiselect active variables */

  --multiselect-active-z-index: 50;

  /** multiselect disabled variables */

  --multiselect-disabled-background-color: var(--color-neutral-100);
  --multiselect-disabled-color: var(--color-text-placeholder);

  /** multiselect option disabled variables */

  --multiselect-option-disabled-background-color: var(--color-neutral-100);
  --multiselect-option-disabled-color: var(--color-text-placeholder);

  /** multiselect option disabled highlight (hover) variables */

  --multiselect-option-disabled-highlight-background-color: var(--color-neutral-100);

  /** multiselect option group variables */

  --multiselect-option-group-background-color: var(--color-neutral-300);
  --multiselect-option-group-color: var(--color-text-secondary);
  --multiselect-option-group-font-weight: 500;
  --multiselect-option-group-child-padding-right: 30px;

  /** multiselect option group selected variables */

  --multiselect-option-group-selected-color: var(--color-text-inversion);
  --multiselect-option-group-selected-backgrounds-color: var(--color-primary-300);

  /** multiselect option group highlight (hover) variables */

  --multiselect-option-group-option-highlight-background-color: var(--color-neutral-400);
  --multiselect-option-group-option-highlight-color: var(--color-text-secondary);
  --multiselect-option-group-option-highlight-after-background-color: var(--color-neutral-400);

  /** multiselect option group selected highlight (hover) variables */

  --multiselect-option-group-selected-highlight-color: var(--color-text-inversion);
  --multiselect-option-group-selected-highlight-background-color: var(--color-primary-500);
  --multiselect-option-group-selected-highlight-after-background-color: var(--color-primary-500);
  --multiselect-option-group-selected-highlight-after-color: var(--color-text-inversion);

  /** multiselect scrollbar variables */

  --multiselect-content-scrollbar-padding: var(--scrollbar-sm-padding);
  --multiselect-content-scrollbar-width: var(--scrollbar-sm-size);
  --multiselect-content-scrollbar-radius: var(--radius-xxl);
  --multiselect-content-scrollbar-track-background-color: var(--scrollbar-track-bg-color);
  --multiselect-content-scrollbar-thumb-background-color: var(--scrollbar-thumb-bg-color);
  --multiselect-content-scrollbar-thumb-hover-background-color: var(--scrollbar-thumb-hover-bg-color);

  /** multiselect error variables */

  --multiselect-error-border-color: var(--color-error-500);
  --multiselect-error-icon-color: var(--color-error-500);

  /** multiselect size sm variables */

  --multiselect-sm-tags-padding: calc(var(--spacing-0-5) - 1px) var(--spacing-4) calc(var(--spacing-0-5) - 1px) calc(var(--spacing-0-5) - 1px);
  --multiselect-sm-tags-min-height: var(--control-height-sm);
  /* --multiselect-sm-input-padding-top: 2px; */

  --multiselect-sm-placeholder-padding-top: 2px;
  --multiselect-sm-placeholder-margin-bottom: 0;

  --multiselect-sm-icon-top: var(--spacing-0-5);

  --multiselect-sm-strong-margin-bottom: 2px;

  --multiselect-sm-spinner-size: calc(var(--multiselect-sm-tags-min-height) - 2px);

  /** multiselect size lg variables */

  --multiselect-lg-tags-padding: calc(var(--spacing-1) - 1px) var(--spacing-4) calc(var(--spacing-1) - 1px) calc(var(--spacing-1) - 1px);
  --multiselect-lg-tags-min-height: var(--control-height-lg);

  /* --multiselect-lg-input-padding-top: var(--spacing-0-5); */

  --multiselect-lg-placeholder-padding-top: var(--spacing-0-5);
  --multiselect-lg-placeholder-margin-bottom: 0;

  --multiselect-lg-icon-top: 10px;

  --multiselect-lg-strong-margin-bottom: 8px;

  --multiselect-lg-spinner-size: calc(var(--multiselect-lg-tags-min-height) - 2px);

  width: 100%;
  position: relative;
  color: var(--multiselect-color);
  white-space: normal;
}

.ui-multiselect__icon,
.ui-multiselect__dropdown-icon {
  z-index: calc(var(--multiselect-active-z-index) - 1);
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.ui-multiselect__icon {
  left: var(--multiselect-icon-left);
  color: var(--multiselect-icon-color);
}

.ui-multiselect__dropdown-icon {
  right: var(--multiselect-toggle-icon-right);
}

.ui-multiselect:has(.ui-multiselect__icon) .multiselect__tags {
  padding-left: var(--multiselect-icon-tags-padding-left);
}

.ui-multiselect--error .multiselect__tags {
  border-color: var(--multiselect-error-border-color);
}

.ui-multiselect--error .ui-multiselect__icon {
  color: var(--multiselect-error-icon-color);
}

fieldset[disabled] .multiselect {
  pointer-events: none;
}

.multiselect {
  position: relative;
  box-sizing: content-box;
  display: block;
  width: 100%;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  display: block;
}

.multiselect__spinner {
  position: absolute;
  right: 1px;
  top: 1px;
  display: block;
}

.multiselect__spinner:after,
.multiselect__spinner:before {
  position: absolute;
  content: "";
  top: 50%;
  left: 50%;
  margin: -8px 0 0 -8px;
  width: var(--multiselect-loading-spinner-size);
  height: var(--multiselect-loading-spinner-size);
  border-radius: 100%;
  border: var(--multiselect-loading-spinner-border-width) solid transparent;
  border-top-color: var(--multiselect-loading-spinner-color);
  box-shadow: 0 0 0 1px transparent;
}

.multiselect__spinner:before {
  -webkit-animation: spinning 2.4s cubic-bezier(.41, .26, .2, .62);
  animation: spinning 2.4s cubic-bezier(.41, .26, .2, .62);
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}

.multiselect__spinner:after {
  -webkit-animation: spinning 2.4s cubic-bezier(.51, .09, .21, .8);
  animation: spinning 2.4s cubic-bezier(.51, .09, .21, .8);
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}

.multiselect__loading-enter-active,
.multiselect__loading-leave-active {
  -webkit-transition: opacity .2s ease-in-out;
  transition: opacity .2s ease-in-out;
  opacity: 1
}

.multiselect__loading-enter,
.multiselect__loading-leave-active {
  opacity: 0;
}

.multiselect,
.multiselect__input,
.multiselect__single {
  font-family: inherit;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
}

.multiselect:focus {
  outline: none;
}

.multiselect--disabled {
  pointer-events: none;
}

.ui-multiselect:has(.multiselect--disabled) .ui-multiselect__icon,
.ui-multiselect:has(.multiselect--disabled) .ui-multiselect__dropdown-icon,
.multiselect--disabled .multiselect__placeholder,
.multiselect--disabled {
  color: var(--multiselect-disabled-color);
}

.multiselect--disabled .multiselect__tags {
  background: var(--multiselect-disabled-background-color);
  color: var(--multiselect-disabled-color);
}

.multiselect--active {
  z-index: var(--multiselect-active-z-index);
}

.multiselect--active .multiselect__tags {
  border-color: var(--multiselect-tags-active-border-color);
}

.multiselect:hover .multiselect__tags {
  border-color: var(--multiselect-tags-hover-border-color);
}

.multiselect__input,
.multiselect__single {
  position: relative;
  display: inline-block;
  align-items: center;
  border: none;
  width: var(--multiselect-input-width);
  font-size: var(--multiselect-tags-font-size);
  font-weight: var(--multiselect-tags-font-weight);
  line-height: var(--multiselect-tags-line-height);
  letter-spacing: var(--multiselect-tags-letter-spacing);
  outline: none;
  vertical-align: middle;
}

.multiselect__single {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.multiselect__input::placeholder {
  color: var(--multiselect-placeholder-color);
}

.multiselect__input:focus,
.multiselect__single:focus {
  border-color: var(--multiselect-input-border-focus-color);
  outline: none;
}

.multiselect__tags-wrap {
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  max-width: 100%;
  gap: var(--multiselect-tags-gap);
}

.multiselect__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--multiselect-tags-gap);
  border-radius: var(--multiselect-tags-border-radius);
  border: var(--multiselect-tags-border);
  background: var(--multiselect-tags-background-color);
  font-size: var(--multiselect-tags-font-size);
  font-weight: var(--multiselect-tags-font-weight);
  line-height: var(--multiselect-tags-line-height);
  letter-spacing: var(--multiselect-tags-letter-spacing);
  transition: border .2s ease;
}

.multiselect__tags input {
  padding-left: var(--multiselect-single-padding);
}

.multiselect__tag {
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
}

.multiselect__tag input {
  text-overflow: ellipsis;
}

.multiselect__select {
  display: none;
}

.multiselect__placeholder {
  color: var(--multiselect-placeholder-color);
  display: inline-block;
}

.multiselect--active .multiselect__placeholder {
  display: none
}

.multiselect__content-wrapper {
  position: absolute;
  display: block;
  top: var(--multiselect-content-wrapper-top);
  background: var(--multiselect-content-wrapper-background);
  width: var(--multiselect-content-wrapper-width);
  max-height: var(--multiselect-content-wrapper-max-height);
  overflow: auto;
  border: var(--multiselect-content-wrapper-border);
  border-radius: var(--multiselect-content-wrapper-border-radius);
  z-index: var(--multiselect-content-wrapper-z-index);
  -webkit-overflow-scrolling: touch;
}

.multiselect__content {
  list-style: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  min-width: 100%;
  vertical-align: top;
}

.multiselect--above .multiselect__content-wrapper {
  top: unset;
  bottom: var(--multiselect-content-wrapper-top);
}

.multiselect__element {
  display: block
}

.multiselect__option {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: var(--multiselect-option-padding);
  position: relative;
  cursor: pointer;
  font-size: var(--multiselect-option-font-size);
  font-weight: var(--multiselect-option-font-weight);
  line-height: var(--multiselect-option-line-height);
  letter-spacing: var(--multiselect-option-letter-spacing);
}

.multiselect__option:after {
  top: 0;
  right: 0;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  height: var(--multiselect-option-after-height);
  padding-right: var(--multiselect-option-after-padding-right);
  padding-left: var(--multiselect-option-after-padding-left);
  font-size: var(--multiselect-option-font-size);
  font-weight: var(--multiselect-option-font-weight);
  line-height: var(--multiselect-option-line-height);
  letter-spacing: var(--multiselect-option-letter-spacing);
}

.multiselect__option--highlight {
  background: var(--multiselect-option-highlight-background-color);
  outline: var(--multiselect-option-highlight-outline);
  color: var(--multiselect-option-highlight-color);
}

.multiselect__option--highlight::before {
  content: '';
  display: block;
  position: var(--multiselect-option-highlight-marker-position);
  width: var(--multiselect-option-highlight-marker-width);
  height: var(--multiselect-option-highlight-marker-height);
  left: var(--multiselect-option-highlight-marker-left);
  top: var(--multiselect-option-highlight-marker-top);
  background-color: var(--multiselect-option-highlight-marker-background-color);
}

.ui-multiselect--show-labels .multiselect__option--highlight:after {
  content: attr(data-select);
  background: var(--multiselect-option-highlight-background-color);
  color: var(--multiselect-option-highlight-after-color);
}

.multiselect__option--selected {
  background: var(--multiselect-option-selected-background-color);
  color: var(--multiselect-option-selected-color);
}

.ui-multiselect--multiple .multiselect__option--selected {
  color: var(--multiselect-color);
}

.ui-multiselect--show-labels .multiselect__option--selected:after {
  content: attr(data-selected);
  color: var(--multiselect-option-selected-after-color);
  background: inherit
}

.multiselect__option--group-selected::before,
.multiselect__option--selected:before {
  content: none;
}

.multiselect__option--selected.multiselect__option--highlight {
  background: var(--multiselect-option-selected-highlight-background-color);
  color: var(--multiselect-option-selected-highlight-color);
}

.ui-multiselect--show-labels .multiselect__option--selected.multiselect__option--highlight:after {
  background: var(--multiselect-option-selected-highlight-background-color);
  content: attr(data-deselect);
  color: var(--multiselect-option-selected-highlight-after-color);
}

.multiselect--disabled .multiselect__current,
.multiselect--disabled .multiselect__select {
  background: var(--multiselect-option-disabled-background-color);
  color: var(--multiselect-option-disabled-color)
}

.multiselect__option--disabled {
  background: var(--multiselect-option-disabled-background-color);
  color: var(--multiselect-option-disabled-color);
  cursor: text;
  pointer-events: none
}

.multiselect__option--group {
  background: var(--multiselect-option-group-background-color);
  color: var(--multiselect-option-group-color);
  font-weight: var(--multiselect-option-group-font-weight);
}

.multiselect:has(.multiselect__option--group) li[role="option"] .multiselect__option {
  padding-left: var(--multiselect-option-group-child-padding-right);
}

.multiselect__option--group.multiselect__option--highlight {
  background: var(--multiselect-option-group-option-highlight-background-color);
  color: var(--multiselect-option-group-option-highlight-color);
}

.multiselect__option--group.multiselect__option--highlight:after {
  background: var(--multiselect-option-group-option-highlight-after-background-color);
  color: var(--multiselect-option-group-option-highlight-color);
}

.multiselect__option--disabled.multiselect__option--highlight {
  background: var(--multiselect-option-disabled-highlight-background-color);
}

.multiselect__option--group-selected {
  background: var(--multiselect-option-group-selected-backgrounds-color);
  color: var(--multiselect-option-group-selected-color);
}

.multiselect__option--group-selected.multiselect__option--highlight {
  background: var(--multiselect-option-group-selected-highlight-background-color);
  color: var(--multiselect-option-group-selected-highlight-color);
}

.multiselect__option--group-selected.multiselect__option--highlight:after {
  background: var(--multiselect-option-group-selected-highlight-after-background-color);
  content: attr(data-deselect);
  color: var(--multiselect-option-group-selected-highlight-after-color);
}

.multiselect-enter-active,
.multiselect-leave-active {
  -webkit-transition: all .15s ease;
  transition: all .15s ease;
}

.multiselect-enter,
.multiselect-leave-active {
  opacity: 0;
}

.multiselect__strong {
  line-height: var(--multiselect-strong-line-height);
  display: inline-block;
  vertical-align: top;
}

@-webkit-keyframes spinning {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }

  to {
    -webkit-transform: rotate(2turn);
    transform: rotate(2turn);
  }
}

@keyframes spinning {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }

  to {
    -webkit-transform: rotate(2turn);
    transform: rotate(2turn);
  }
}

/** Scrollbar styles */
.multiselect__content-wrapper {
  scrollbar-face-color: var(--multiselect-content-scrollbar-thumb-background-color);
  scrollbar-track-color: var(--multiselect-content-scrollbar-track-background-color);
  scrollbar-color: var(--multiselect-content-scrollbar-thumb-background-color) var(--multiselect-content-scrollbar-track-background-color);
  scrollbar-width: thin;
}

.multiselect__content-wrapper::-webkit-scrollbar {
  width: calc(var(--multiselect-content-scrollbar-width) + (var(--multiselect-content-scrollbar-padding) * 2));
}

.multiselect__content-wrapper::-webkit-scrollbar:horizontal {
  height: calc(var(--multiselect-content-scrollbar-padding) * 2 + var(--multiselect-content-scrollbar-width));
  width: auto;
}

.multiselect__content-wrapper::-webkit-scrollbar-corner {
  display: none;
}

.multiselect__content-wrapper::-webkit-scrollbar-track {
  background-color: var(--multiselect-content-scrollbar-track-background-color);
  border-radius: var(--multiselect-content-scrollbar-radius);
  border: var(--multiselect-content-scrollbar-padding) solid transparent;
  background-clip: padding-box;
}

.multiselect__content-wrapper::-webkit-scrollbar-thumb {
  background-color: var(--multiselect-content-scrollbar-thumb-background-color);
  transition: background 0.2s;
  border-radius: var(--multiselect-content-scrollbar-radius);
  background-clip: padding-box;
  border: var(--multiselect-content-scrollbar-padding) solid transparent;
}

.multiselect__content-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: var(--multiselect-content-scrollbar-thumb-hover-background-color);
}

/** size sm */

.ui-multiselect--sm .multiselect__tags {
  padding: var(--multiselect-sm-tags-padding);
  min-height: var(--multiselect-sm-tags-min-height);
}

.ui-multiselect--sm .multiselect__single,
.ui-multiselect--sm .multiselect__placeholder {
  padding-left: var(--multiselect-single-padding);
  padding-top: var(--multiselect-sm-placeholder-padding-top);
  margin-bottom: var(--multiselect-sm-placeholder-margin-bottom);
}

.ui-multiselect--sm .ui-multiselect__icon,
.ui-multiselect--sm .ui-multiselect__dropdown-icon {
  top: var(--multiselect-sm-icon-top);
}

.ui-multiselect--sm .multiselect__spinner {
  width: var(--multiselect-sm-spinner-size);
  height: var(--multiselect-sm-spinner-size);
}

/** size lg */

.ui-multiselect--lg .multiselect__tags {
  padding: var(--multiselect-lg-tags-padding);
  min-height: var(--multiselect-lg-tags-min-height);
}

.ui-multiselect--lg .multiselect__single,
.ui-multiselect--lg .multiselect__placeholder {
  padding-left: var(--multiselect-single-padding);
  padding-top: var(--multiselect-lg-placeholder-padding-top);
  margin-bottom: var(--multiselect-lg-placeholder-margin-bottom);
}

.ui-multiselect--lg .ui-multiselect__icon,
.ui-multiselect--lg .ui-multiselect__dropdown-icon {
  top: var(--multiselect-lg-icon-top);
}

.ui-multiselect--lg .multiselect__spinner {
  width: var(--multiselect-lg-spinner-size);
  height: var(--multiselect-lg-spinner-size);
}

.ui-multiselect--nowrap .multiselect__option {
  white-space: nowrap;
}
</style>
