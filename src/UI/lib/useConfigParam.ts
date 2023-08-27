import { getCurrentInstance } from 'vue';
import Config, { UiVuiLibConfig } from '../config';

export const useConfigParam = (name: keyof UiVuiLibConfig) => {
  return getCurrentInstance()?.proxy?.$uiVui[name] || Config[name];
};
