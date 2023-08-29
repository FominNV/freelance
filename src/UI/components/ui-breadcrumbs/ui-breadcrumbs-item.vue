<template>
  <span class="ui-breabcrumb-item">
    <ui-breadcrumbs-icon-adapter v-if="icon" class="ui-breabcrumb-item__icon" :name="icon" />
    <span v-if="text" class="ui-breabcrumb-item__text">{{ text }}</span>
  </span>
</template>

<script setup lang="ts">
import UiBreadcrumbsIconAdapter from './ui-breadcrumbs-icon-adapter.vue';

export interface UiBreadcrumbItemProps {
  /** текст элемента хлебных крошек */
  text?: string;
  /** иконка */
  icon?: IconsNamesType;
}

const props = withDefaults(defineProps<UiBreadcrumbItemProps>(), {
  //
});
</script>

<style scoped>
.ui-breabcrumb-item {
  display: flex;
  align-items: center;
}
.ui-breabcrumb-item__icon {
  width: var(--breadcrumbs-icon-size);
  height: var(--breadcrumbs-icon-size);
  display: block;
}
.ui-breabcrumb-item__icon + .ui-breabcrumb-item__text {
  margin-left: var(--breadcrumbs-icon-offset);
}
</style>
