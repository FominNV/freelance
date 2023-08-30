<template>
  <li>
    <div
      :class="classes"
      :style="paddingLeft"
      @click="selectHandler"
      @focus="emit('focus', { event: $event, node })"
      @blur="emit('blur', { event: $event, node })"
      @mouseover="emit('mouseover', { event: $event, node })"
      @mouseleave="emit('mouseleave', { event: $event, node })"
      v-if="showNode"
      ref="treeviewNode"
    >
      <div class="ui-treeview-node__left-block">
        <ui-checkbox
          v-if="showCheckboxes"
          class="ui-treeview-node__checkbox"
          :modelValue="isChecked"
          @update:modelValue="isChecked = $event"
          :indeterminate="indeterminate"
          @click.stop
        />

        <span
          class="ui-treeview-node__toggle"
          @click.stop="toggle"
          v-if="node.nodes?.length || (node.fetch && !isOpen)"
        >
          <ui-icon :name="isOpen ? expandedIcon : expandIcon" />
        </span>

        <span
          class="ui-treeview-node__loader"
          v-if="isOpen && node.fetch"
        >
          <ui-spinner size="xs" />
        </span>

        <span
          class="ui-treeview-node__icon"
          :style="iconColorStyle"
        >
          <ui-icon
            v-if="showGroupIcon"
            :name="groupIconName"
          />
          <ui-icon
            v-if="showNodeIcon"
            :name="node.icon || nodeIcon"
          />
        </span>
        <!-- @slot Слот для вывода кастомного имени всех узлов -->
        <slot
          name="nodeName"
          :node="node"
          :level="level"
        >
          {{ node.name }}
        </slot>
      </div>
      <div class="ui-treeview-node__right-block">

        <div class="ui-treeview-node__actions">
          <!-- @slot Слот для назначения кастомных действий определенному узлу/узлам -->
          <slot
            v-if="node.actionsSlotName"
            :name="node.actionsSlotName"
            :node="node"
            :level="level"
          />
          <!-- @slot Слот для действий групп-->
          <slot
            v-else-if="node.nodes"
            name="groupActions"
            :node="node"
            :level="level"
          />
          <!-- @slot Слот для действий узлов-->
          <slot
            v-else
            name="nodeActions"
            :node="node"
            :level="level"
          />
        </div>

        <div
          class="ui-treeview-node__handle"
          v-if="showHandle"
        >
          <ui-icon :name="handleIcon" />
        </div>
      </div>
    </div>
    <template v-if="node.nodes">
      <draggable
        :list="node.nodes"
        :group="{ name: 'g1', put: dragWithinGroup ? false : undefined }"
        class="ui-treeview-group"
        tag="ul"
        v-show="isOpen"
        :disabled="!showNode || !draggable"
        :handle="handleSelector"
        draggable="li:not(:has(>.ui-treeview-node--drag-disabled))"
        @start="emit('drag:start', $event)"
        @end="emit('drag:end', $event)"
      >
        <ui-treeview-node
          v-for="el in node.nodes"
          v-on="$attrs"
          v-bind="$props"
          :node="el"
          :key="el.key"
          :level="level + 1"
        >
          <template
            v-for="(_, slotName) in $attrs"
            #[slotName]="// @ts-ignore
              { node, level }"
          >
            <slot
              :name="slotName"
              :node="node || el"
              :level="level"
            />
          </template>
        </ui-treeview-node>
      </draggable>
    </template>
  </li>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import draggable from 'vuedraggable';
import { ClassPropsType } from '../../@types/props';
import { TreeViewNode } from './model';
import { UiCheckbox } from '../ui-checkbox';

export interface UiTreeViewNodePropsImpl {
  /** Класс TreeViewNode с данными узла */
  node: TreeViewNode;
  /** Размер */
  size?: 'sm' | 'lg',
  /** Выбранный элемент  */
  selected: TreeViewNode | null;
  /** Уровень вложенности (для определения отступа) */
  level?: number;
  /** Показать чекбоксы */
  showCheckboxes: boolean;
  /** Перетаскивание в пределах группы */
  dragWithinGroup: boolean;
  /** Показать иконку для группы */
  showGroupIcon: boolean;
  /** Показать иконку для узла */
  showNodeIcon: boolean;
  /** Скрыть группы (показать только элементы плоским списком) */
  hideGroups: boolean;
  /** Разрешить перетаскивание */
  draggable: boolean;
  /** Перетаскивание только за ручку */
  dragByHandle: boolean;
  /** Разрешить выбор узлов */
  selectable: boolean;
  /** Показывать ховер узла */
  hoverable: boolean;
  /** При активации чекбокса родительского узла активировать чекбоксы дочерних */
  checkChildrens: boolean;
  /** Иконка группы */
  groupIcon: IconsNamesType;
  /** Иконка открытой группы */
  openedGroupIcon: IconsNamesType;
  /** Иконка узла */
  nodeIcon: IconsNamesType;
  /** Иконка открытия группы */
  expandIcon: IconsNamesType;
  /** Иконка открытой группы */
  expandedIcon: IconsNamesType;
  /** Иконка ручки */
  handleIcon: IconsNamesType;
  /** Свой цвет для иконок группы */
  groupIconColor?: string;
  /** Свой цвет для иконок группы */
  nodeIconColor?: string;
  /** Режим pointer курсора */
  pointer?: 'none' | 'groups' | 'nodes' | 'all';
}

const props = withDefaults(defineProps<UiTreeViewNodePropsImpl>(), {
  level: 0,
  size: 'lg',
  pointer: 'all',
});

const emit = defineEmits<{
  /** Клик по узлу */
  (e: 'click:node', node: TreeViewNode): void;
  /** Обновление выбранного узла */
  (e: 'update:selected', node: TreeViewNode): void;
  /** Обновление узла после изменения состояния чекбокса */
  (e: 'update:checked', nodeId: string, value: any, recursion?: boolean): void;
  /** Обновление узла после изменения неопределенного состояния чекбокса */
  (e: 'update:indeterminate', nodeId: string, indeterminate: boolean): void;
  /** Обновление узла после открытия или закрытия */
  (e: 'update:opened', nodeId: string, value: boolean): void;
  /** Ивент для динамической подгрузки данных узла */
  (e: 'node:fetch', node: TreeViewNode): void;
  /** Ивент начала драга элемента */
  (e: 'drag:start', event: CustomEvent): void;
  /** Ивент конца драга элемента */
  (e: 'drag:end', event: CustomEvent): void;
  /** Проброс ивента mouseover */
  (e: 'mouseover', { event, node }: { event: MouseEvent, node: TreeViewNode }): void;
  /** Проброс ивента mouseleave */
  (e: 'mouseleave', { event, node }: { event: MouseEvent, node: TreeViewNode }): void;
  /** Проброс ивента focus */
  (e: 'focus', { event, node }: { event: FocusEvent, node: TreeViewNode }): void;
  /** Проброс ивента blur */
  (e: 'blur', { event, node }: { event: FocusEvent, node: TreeViewNode }): void;
}>();

const isOpen = ref<boolean>(props.node.opened);

function toggle() {
  isOpen.value = !isOpen.value;
  emit('update:opened', props.node.id, isOpen.value);
  if (props.node.fetch) {
    emit('node:fetch', props.node);
  }
}

// счетчик дочерних элементов с активными чекбоксами
const checkedChildNodesCount = computed<number>(() => {
  if (!props.node?.nodes?.length) {
    return 0;
  }
  return props.node.nodes.filter((node: any) => node.checked).length;
});

// computed неопределенного состояния чекбокса
const indeterminate = computed<boolean>({
  get() {
    if (!props.node?.nodes?.length || !props.checkChildrens) {
      return false;
    }

    const hasIndeterminateChild = props.node.nodes.some((node: any) => node.indeterminate);
    if (hasIndeterminateChild) {
      return true;
    }

    return checkedChildNodesCount.value > 0 && checkedChildNodesCount.value < props.node?.nodes?.length;
  },

  set(newValue: boolean) {
    if (props.node?.indeterminate !== newValue) {
      emit('update:indeterminate', props.node.id, newValue);
    }
  },
});

// computed состояния чекбокса
// TODO: заменить тип any на boolean после того, как будет решена проблема с тем, что ts путает типы ивентов
const isChecked = computed<any>({
  get() {
    if (!props.node?.nodes?.length || !props.checkChildrens) {
      return props.node.checked;
    }

    return checkedChildNodesCount.value === props.node?.nodes?.length;
  },
  set(newValue: any) {
    if (props.node.checked !== newValue) {
      emit('update:checked', props.node.id, newValue, props.checkChildrens);
    }
  },
});

// Наблюдатель для внесения изменений в состояние чекбоксов при изменении indeterminate состояния чекбокса
if (props.showCheckboxes && props.checkChildrens && !props.hideGroups) {
  watch([indeterminate, isChecked], ([newIndeterminateValue]) => {
    if (!props.node?.nodes?.length) {
      return;
    }

    indeterminate.value = newIndeterminateValue;

    if (newIndeterminateValue && props.node.checked) {
      emit('update:checked', props.node.id, false);
    }

    if (!newIndeterminateValue && props.node.checked !== isChecked.value) {
      emit('update:checked', props.node.id, isChecked.value);
    }

  }, { immediate: true });
}

function selectHandler() {
  emit('click:node', props.node);
  if (props.selectable) {
    emit('update:selected', props.node);
  } else {
    toggle();
  }
}

const showNode = computed<boolean>(() => (props.hideGroups ? !props.node.nodes : true));
const paddingLeft = computed<string | undefined>(() => {
  if (props.hideGroups || !props.level) {
    return undefined;
  }
  return `padding-left:calc(${props.level} * var(--treeview-child-left-padding) + var(--treeview-node-left-padding))`;
});

const handleSelector = computed<string | undefined>(() => (props.dragByHandle ? '.ui-treeview-node__handle' : undefined));
const showHandle = computed<boolean>(() => (props.level > 0 && props.draggable && !props.hideGroups && props.node.draggable));

const groupIconName = computed<IconsNamesType>(() => {
  if (props.node.icon) {
    props.node.icon;
  }
  return (isOpen.value && props.node.nodes?.length) ? props.openedGroupIcon : props.groupIcon;
});

const showGroupIcon = computed<boolean>(() => (props.showGroupIcon && (!!props.node.nodes || !!props.node.fetch)));
const showNodeIcon = computed<boolean>(() => (props.showNodeIcon && !props.node.nodes && !props.node.fetch));

const iconColorStyle = computed<string | undefined>(() => {
  if (props.node.iconColor) {
    return `color: var(--text - color - ${props.node.iconColor})`;
  }

  if (props.groupIconColor && (props.node.nodes || props.node.fetch)) {
    return `color: var(--text - color - ${props.groupIconColor})`;
  }

  if (props.nodeIconColor) {
    return `color: var(--text - color - ${props.nodeIconColor})`;
  }

  return undefined;
});

const classes = computed<ClassPropsType>(() => {
  return [
    'ui-treeview-node',
    `ui-treeview-node--${props.size}`,
    {
      'ui-treeview-node--pointer': props.pointer === 'all'
        || (props.pointer === 'groups' && (props.node?.nodes?.length || props.node.fetch))
        || (props.pointer === 'nodes' && !props.node?.nodes?.length && !props.node.fetch),
      'ui-treeview-node--hoverable': props.hoverable,
      'ui-treeview-node--selected': props.node.id === props.selected?.id,
      'ui-treeview-node--drag-disabled': !props.node?.draggable,
    },
  ];
});

</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<style>
.ui-treeview-node {
  --treeview-node-color: var(--color-text-primary);
  --treeview-node-selected-color: var(--color-primary-500);
  --treeview-node-background-color: var(--color-neutral-0);
  --treeview-node-hover-background-color: var(--color-neutral-200);
  --treeview-node-border-color: var(--color-neutral-200);

  --treeview-left-block-gap: var(--spacing-1);
  --treeview-right-block-gap: var(--spacing-2);
  --treeview-node-border-top: 1px solid var(--treeview-node-border-color);

  /** size sm */
  --treeview-node-sm-spacing-x: var(--spacing-1);
  --treeview-node-sm-spacing-y: var(--spacing-2);
  --treeview-node-sm-font-size: var(--subtitle-xs-font-size);
  --treeview-node-sm-font-weight: var(--subtitle-xs-font-weight);
  --treeview-node-sm-line-height: var(--subtitle-xs-line-height);
  --treeview-node-sm-letter-spacing: var(--subtitle-xs-letter-spacing);

  /** size lg */
  --treeview-node-lg-spacing-x: var(--spacing-2);
  --treeview-node-lg-spacing-y: var(--spacing-2);
  --treeview-node-lg-font-size: var(--subtitle-sm-font-size);
  --treeview-node-lg-font-weight: var(--subtitle-sm-font-weight);
  --treeview-node-lg-line-height: var(--subtitle-sm-line-height);
  --treeview-node-lg-letter-spacing: var(--subtitle-sm-letter-spacing);

  /** Переменная для расчета отступа слева в секции script (переопределяется стилями размеров) */
  --treeview-node-left-padding: var(--spacing-2);

  --treeview-node-loader-width: 20px;

  border-top: var(--treeview-node-border-top);
  background-color: var(--treeview-node-background-color);
  color: var(--treeview-node-color);

  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  border-top: transparent;
  transition: background-color .2s ease;
}

.ui-treeview-node--pointer {
  cursor: pointer;
}

/** size sm */

.ui-treeview-node--sm {
  --treeview-node-left-padding: var(--treeview-node-sm-spacing-y);

  padding: var(--treeview-node-sm-spacing-x) var(--treeview-node-sm-spacing-y);
  font-family: var(--treeview-node-sm-font-family);
  font-size: var(--treeview-node-sm-font-size);
  font-weight: var(--treeview-node-sm-font-weight);
  line-height: var(--treeview-node-sm-line-height);
  letter-spacing: var(--treeview-node-sm-letter-spacing);
}

/** size lg */

.ui-treeview-node--lg {
  --treeview-node-left-padding: var(--treeview-node-lg-spacing-y);

  padding: var(--treeview-node-lg-spacing-x) var(--treeview-node-lg-spacing-y);
  font-family: var(--treeview-node-lg-font-family);
  font-size: var(--treeview-node-lg-font-size);
  font-weight: var(--treeview-node-lg-font-weight);
  line-height: var(--treeview-node-lg-line-height);
  letter-spacing: var(--treeview-node-lg-letter-spacing);
}

.ui-treeview-group .ui-treeview-node {
  border-top: var(--treeview-node-border-top);
}

.ui-treeview-node--selected {
  color: var(--treeview-node-selected-color);
}

.ui-treeview-node--selected .ui-treeview-node__icon {
  color: var(--treeview-node-selected-color) !important;
}

.ui-treeview-node--selected .ui-treeview-node__toggle {
  color: var(--treeview-node-color);
}

.ui-treeview-node__actions {
  visibility: hidden;
}

.ui-treeview-node--selected .ui-treeview-node__actions,
.ui-treeview-node--hoverable:hover .ui-treeview-node__actions {
  visibility: visible;
}

.ui-treeview-node--hoverable:hover {
  background-color: var(--treeview-node-hover-background-color);
}

.ui-treeview-node__toggle {
  cursor: pointer;
}

.ui-treeview-node__left-block,
.ui-treeview-node__right-block {
  display: flex;
  align-items: center;
}

.ui-treeview-node__left-block {
  gap: var(--treeview-left-block-gap);
}

.ui-treeview-node__right-block {
  gap: var(--treeview-right-block-gap);
}

.ui-treeview-node__loader {
  width: var(--treeview-node-loader-width);
}
</style>
