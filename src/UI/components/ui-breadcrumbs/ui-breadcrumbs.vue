<template>
  <ul class="ui-breadcrumbs">
    <li
      v-for="(item, index) in items"
      :key="index"
      :class="['ui-breadcrumbs__item', { 'ui-breadcrumbs__item--disabled': isItemDisabled(item, index) }]"
    >
      <!--
      |  @slot Изменить отрисовку ссылки
      |  @binding {object} item текущий элемент
      | -->
      <slot
        name="item"
        :item="item"
      >
        <router-link
          class="ui-breadcrumbs__link"
          v-if="item.to"
          :to="item.to"
        >
          <ui-breadcrumbs-item
            :text="item.text"
            :icon="item.icon"
          />
        </router-link>
        <a
          v-else
          class="ui-breadcrumbs__link"
          :href="item.href"
          :target="item.target || '_blank'"
        >
          <ui-breadcrumbs-item
            :text="item.text"
            :icon="item.icon"
          />
        </a>
      </slot>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { BreadcrumbsItemImpl } from './BreadcrumbsImpl';
import RrBreadcrumbsItem from './ui-breadcrumbs-item.vue';

export interface UiBreadcrumbPropsImpl {
  /** список элементов хлебных крошек */
  items: Array<BreadcrumbsItemImpl>;
  /** отключать ли последний элемент */
  disableLast?: boolean;
}

const props = withDefaults(defineProps<UiBreadcrumbPropsImpl>(), {
  disableLast: true,
});

const isItemDisabled = (item: any, index: number) => {
  return item.disabled || (props.disableLast && index === props.items.length - 1);
};

</script>
<style>
.ui-breadcrumbs {
  --breadcrumbs-disabled-text-color: var(--color-text-primary);
  --breadcrumbs-divider-color: var(--color-text-light);
  --breadcrumbs-active-item-text-color: var(--color-primary-500);
  --breadcrumbs-active-item-text-color-hover: var(--color-primary-400);
  --breadcrumbs-active-item-text-color-active: var(--color-primary-600);
  --breadcrumbs-text-font-size: var(--paragraph-sm-font-size);
  --breadcrumbs-text-line-height: var(--paragraph-sm-line-height);
  --breadcrumbs-text-font-weight: var(--paragraph-sm-font-weight);
  --breadcrumbs-text-letter-spacing: var(--paragraph-sm-letter-spacing);
  --breadcrumbs-icon-size: 16px;
  --breadcrumbs-icon-offset: var(--spacing-0-5);
  --breadcrumbs-separator-offset: var(--spacing-0-5);

  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: var(--breadcrumbs-text-font-size);
  line-height: var(--breadcrumbs-text-line-height);
  font-weight: var(--breadcrumbs-text-font-weight);
  letter-spacing: var(--breadcrumbs-text-letter-spacing);
}

.ui-breadcrumbs svg {
  display: block;
}

.ui-breadcrumbs__item {
  display: flex;
  align-items: center;

}

.ui-breadcrumbs__item--disabled {
  pointer-events: none;
}

.ui-breadcrumbs__item .ui-breadcrumbs__link {
  text-decoration: none;
  color: (--breadcrumbs-active-item-text-color);
}

.ui-breadcrumbs__item .ui-breadcrumbs__link:is(:hover, :focus) {
  color: var(--breadcrumbs-active-item-text-color-hover);
}

.ui-breadcrumbs__item .ui-breadcrumbs__link:is(:active) {
  color: var(--breadcrumbs-active-item-text-color-active);
}

.ui-breadcrumbs__item--disabled .ui-breadcrumbs__link {
  pointer-events: none;
  color: var(--breadcrumbs-disabled-text-color);
}

.ui-breadcrumbs__item:not(.ui-breadcrumbs__item:last-child):after {
  content: "/";
  color: var(--breadcrumbs-divider-color);
  margin: 0 var(--breadcrumbs-separator-offset) 0;
}
</style>
