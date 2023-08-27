<template>
  <div
    class="ui-avatar"
    v-on="$attrs"
    role="img"
    aria-label="Изображение пользователя"
  >
    <avatar-placeholder v-if="!image" />
    <img
      class="ui-avatar__image"
      :src="image"
      alt="Изображение пользователя"
      loading="lazy"
      v-else
    >
  </div>
</template>

<script setup lang="ts">
import AvatarPlaceholder from './ui-avatar-placeholder.vue';

export interface UiAvatarPropsImpl {
  /** изображение аватара (пробрасывается в src тэга ```<img />```) */
  image?: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<UiAvatarPropsImpl>(), {
  //
});

</script>
<style>
.ui-avatar {
  --avatar-size: 48px;
  --avatar-radius: var(--radius-sm);

  width: var(--avatar-size);
  height: var(--avatar-size);
  background: var(--color-primary-100);
  border-radius: var(--avatar-radius);
  color: var(--color-primary-500);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.ui-avatar__image {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: var(--avatar-radius);
}
</style>
