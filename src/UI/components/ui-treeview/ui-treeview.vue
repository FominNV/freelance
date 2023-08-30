<template>
  <ul
    :class="classes"
    v-click-outside="clickOutsideHandler"
  >
    <ui-treeview-node
      v-for="el in model"
      :size="size"
      :node="el"
      :key="el.key"
      :selected="selected"
      :openAll="openAll"
      :checkAll="checkAll"
      :showCheckboxes="showCheckboxes"
      :dragWithinGroup="dragWithinGroup"
      :showGroupIcon="showGroupIcon"
      :showNodeIcon="showNodeIcon"
      :hideGroups="hideGroups"
      :draggable="draggable"
      :dragByHandle="dragByHandle"
      :selectable="selectable"
      :hoverable="hoverable"
      :checkChildrens="checkChildrens"
      :groupIcon="groupIcon"
      :openedGroupIcon="openedGroupIcon"
      :nodeIcon="nodeIcon"
      :expandIcon="expandIcon"
      :expandedIcon="expandedIcon"
      :handleIcon="handleIcon"
      :nodeIconColor="nodeIconColor"
      :groupIconColor="groupIconColor"
      :pointer="pointer"
      @update:selected="handleSelect"
      @update:checked="changeChecked"
      @update:opened="changeOpen"
      @update:indeterminate="changeIndeterminate"
      @node:fetch="emit('node:fetch', $event)"
      @drag:start="emit('drag:start', $event)"
      @drag:end="emit('drag:end', $event)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
      @mouseover="emit('mouseover', $event)"
      @mouseleave="emit('mouseleave', $event)"
      @click:node="emit('click:node', $event)"
    >
      <template
        v-for="(_, slotName) in $attrs"
        #[slotName]="// @ts-ignore
          { node, level }"
      >
        <slot
          :name="slotName"
          :node="node"
          :level="level"
        />
      </template>
    </ui-treeview-node>
  </ul>
</template>

<script setup lang="ts">
// TODO: расширить набор utils, реализовать обход снизу-вверх
import { computed, ref } from 'vue';
import rrTreeviewNode from './ui-treeview-node.vue';
import { recursionDown } from './utils';
import { TreeViewNode } from './model';
import { useConfigParam } from '../../lib/useConfigParam';
import { IconsConfig } from '../../@types/icons-config';
import { ColorNames } from '../../directives';
import { ClassPropsType } from '../../@types/props';

export interface UiTreeviewPropsImpl {
  /** Модель treeview */
  modelValue: TreeViewNode[];
  /** Размер */
  size?: 'sm' | 'lg',
  /** Открыть все группы */
  openAll?: boolean;
  /** Выбрать все элементы */
  checkAll?: boolean;
  /** Показать чекбоксы */
  showCheckboxes?: boolean;
  /** Разрешить перетаскивание */
  draggable?: boolean;
  /** Перетаскивание в пределах группы */
  dragWithinGroup?: boolean;
  /** Перетаскивание только за ручку */
  dragByHandle?: boolean;
  /** Показать иконку для группы */
  showGroupIcon?: boolean;
  /** Показать иконку для узла */
  showNodeIcon?: boolean;
  /** Скрыть группы (показать только элементы плоским списком) */
  hideGroups?: boolean;
  /** Разрешить выбор узлов */
  selectable?: boolean;
  /** Отменять выбор узла при клике вне treeview */
  unselectOutside?: boolean;
  /** Показывать ховер узла */
  hoverable?: boolean;
  /** При активации чекбокса родительского узла активировать чекбоксы дочерних */
  checkChildrens?: boolean;
  /** Иконка группы */
  groupIcon?: IconsNamesType;
  /** Свой цвет для иконок группы */
  groupIconColor?: ColorNames;
  /** Иконка открытой группы */
  openedGroupIcon?: IconsNamesType;
  /** Иконка узла */
  nodeIcon?: IconsNamesType;
  /** Свой цвет для иконок группы */
  nodeIconColor?: ColorNames;
  /** Иконка открытия группы */
  expandIcon?: IconsNamesType;
  /** Иконка открытой группы */
  expandedIcon?: IconsNamesType;
  /** Иконка ручки */
  handleIcon?: IconsNamesType;
  /** Выбранный узел */
  selected?: TreeViewNode;
  /** Тема тривью */
  theme?: 'default' | 'list-view';
  /** Режим pointer курсора */
  pointer?: 'none' | 'groups' | 'nodes' | 'all';
}

const props = withDefaults(defineProps<UiTreeviewPropsImpl>(), {
  size: 'lg',
  theme: 'default',
  pointer: 'all',
  openAll: false,
  checkAll: false,
  showCheckboxes: false,
  draggable: false,
  dragWithinGroup: true,
  dragByHandle: false,
  showGroupIcon: true,
  showNodeIcon: true,
  hideGroups: false,
  selectable: false,
  unselectOutside: true,
  hoverable: true,
  checkChildrens: true,
});

// Системные иконки по умолчанию
const iconsConfig = useConfigParam('icons') as IconsConfig;
const groupIcon = computed<IconsNamesType>(() => props.groupIcon || iconsConfig.systemIcons.controls.folder);
const openedGroupIcon = computed<IconsNamesType>(() => props.openedGroupIcon || iconsConfig.systemIcons.controls.folderOpen);
const nodeIcon = computed<IconsNamesType>(() => props.nodeIcon || iconsConfig.systemIcons.controls.file);
const expandIcon = computed<IconsNamesType>(() => props.expandIcon || iconsConfig.systemIcons.arrows.chevronRight);
const expandedIcon = computed<IconsNamesType>(() => props.expandedIcon || iconsConfig.systemIcons.arrows.chevronDown);
const handleIcon = computed<IconsNamesType>(() => props.handleIcon || iconsConfig.systemIcons.controls.gripIcon);

const emit = defineEmits<{
  /** Обновление модели treeview */
  (e: 'update:modelValue', node: TreeViewNode[]): void;
  /** Обновление выбранного узла (возвращает узел) */
  (e: 'update:selected', node: TreeViewNode | null): void;
  /** Обновление узла после изменения состояния чекбокса (возвращает узел) */
  (e: 'update:checked', node: TreeViewNode): void;
  /** Обновление узла после изменения неопределенного состояния чекбокса (возвращает узел) */
  (e: 'update:indeterminate', node: TreeViewNode): void;
  /** Обновление узла после открытия или закрытия (возвращает узел) */
  (e: 'update:opened', node: TreeViewNode): void;
  /** Клик по узлу */
  (e: 'click:node', node: TreeViewNode): void;
  /** Ивент для динамической подгрузки данных узла (возвращает узел) */
  (e: 'node:fetch', node: TreeViewNode): void;
  /** Ивент начала драга элемента (возвращает ивент vue-draggable) */
  (e: 'drag:start', event: CustomEvent): void;
  /** Ивент конца драга элемента (возвращает ивент vue-draggable) */
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

const model = computed<TreeViewNode[]>(() => (structuredClone(props.modelValue)));

const selected = ref<TreeViewNode | null>(null);

if (props.selected) {
  selected.value = structuredClone(props.selected);
}

function handleSelect(node: TreeViewNode | null) {
  if (props.selectable) {
    selected.value = node;
    emit('update:selected', node);
  }
}

function clickOutsideHandler() {
  if (!props.unselectOutside) {
    return;
  }
  selected.value = null;
  emit('update:selected', null);
}

function changeChecked(nodeId: string, value: boolean, recursion: boolean = false) {
  recursionDown(model.value, (node: TreeViewNode) => {
    if (node.id === nodeId) {
      node.checked = value;
      emit('update:checked', node);

      if (node.nodes?.length && recursion) {
        recursionDown(node.nodes, (node: TreeViewNode) => {
          node.checked = value;
          emit('update:checked', node);
        });
      }
    }
  });
  emit('update:modelValue', model.value);
}

function changeIndeterminate(nodeId: string, value: boolean) {
  recursionDown(model.value, (node: TreeViewNode) => {
    if (node.id === nodeId) {
      node.indeterminate = value;
      emit('update:indeterminate', node);
    }
  });
  emit('update:modelValue', model.value);
}

function changeOpen(nodeId: string, value: boolean) {
  recursionDown(model.value, (node: TreeViewNode) => {
    if (node.id === nodeId) {
      node.opened = value;
      emit('update:opened', node);
    }
  });
  emit('update:modelValue', model.value);
}

if (props.checkAll) {
  changeChecked(model.value[0].id, true, true);
}

if (props.openAll || props.hideGroups) {
  recursionDown(model.value, (node: TreeViewNode) => {
    node.opened = true;
    if (node.fetch) {
      emit('node:fetch', node);
    }
  });
  emit('update:modelValue', model.value);
}

const classes = computed<ClassPropsType>(() => [
  'ui-treeview',
  `ui-treeview--${props.theme}`,
]);

</script>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<style>
.ui-treeview {
  --treeview-background-color: var(--color-neutral-0);
  /** Переменная для прибавления к отступу слева у дочерних узлов */
  --treeview-child-left-padding: var(--spacing-3);

  --treeview-default-border-color: var(--color-neutral-200);
  --treeview-default-border: 1px solid var(--treeview-default-border-color);
  --treeview-default-border-radius: var(--radius-lg);

  --treeview-list-view-border: none;
  --treeview-list-view-border-radius: 0;

  position: relative;
  overflow: hidden;
  background-color: var(--treeview-background-color);
  border-radius: var(--treeview-border-radius);
}

.ui-treeview--default {
  border: var(--treeview-default-border);
  border-radius: var(--treeview-default-border-radius);
}

.ui-treeview--list-view {
  border: var(--treeview-list-view-border);
  border-radius: var(--treeview-list-view-border-radius);
}
</style>
