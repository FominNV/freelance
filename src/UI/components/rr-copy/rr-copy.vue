<template>
  <button
    class="ui-copy"
    type="button"
    @click.stop="copyHandler"
  >
    <ui-icon :name="icon" />
  </button>
</template>

<script setup lang="ts">
import { CopyConfig } from '../../@types/copy-config';
import { IconsConfig } from '../../@types/icons-config';
import { useConfigParam } from '../../lib/useConfigParam';

export interface RrCopyPropsImpl {
  /** текст который будет скопирован в буфер обмена */
  text: string;
  /** иконка для замены стандартной */
  icon?: IconsNamesType;
}

const props = withDefaults(defineProps<RrCopyPropsImpl>(), {
  get icon() {
    return (useConfigParam('icons') as IconsConfig).systemIcons.actions.copy;
  },
});

const emit = defineEmits<{
  /** событие при успешном копировании текста в буфер ообмена */
  (e: 'copied'): void;
}>();

const copyHandler = () => {
  try {
    const { adapter: ClipboardAdapter } = useConfigParam('copy') as CopyConfig;
    ClipboardAdapter.write(props.text);
    emit('copied');
  } catch (err) {
    console.error(err);
  }
};

</script>
<style>
.ui-copy {
  --copy-hover-color: var(--color-primary-500);
  --copy-shadow-color: var(--color-neutral-900-alpha-2);
  --copy-transition: color .3s ease;

  position: relative;
  background-color: transparent;
  border: none;
  outline: none;
  transition: var(--copy-transition);
  cursor: pointer;
}

.ui-copy:hover {
  color: var(--copy-hover-color);
}

.ui-copy:active:before {
  content: '';
  width: 10px;
  height: 10px;
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  animation: accent-shadow-out .2s ease-in;
}

@keyframes accent-shadow-out {
  from {
    box-shadow: 0 0 0 var(--copy-shadow-color);
  }

  to {
    box-shadow: 0 0 50px var(--copy-shadow-color);
  }
}
</style>
