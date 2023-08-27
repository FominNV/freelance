import ClickOutside from 'vue-click-outside';
import { VueMaskDirective } from 'v-mask';
/** Версия для VUE 3 (yarn add vue-input-autowidth@next) https://github.com/syropian/vue-input-autowidth/tree/v2 */
import Autowidth from 'vue-input-autowidth';

delete Autowidth.install;

export {
  ClickOutside,
  Autowidth,
  VueMaskDirective as mask,
};

export * from './ui-focus';
export * from './ui-popover-trigger';
export * from './ui-color';
export * from './ui-typo';
