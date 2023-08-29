import Vue from 'vue';
import { Quill } from 'vue2-editor';
import RrIcon from '../ui-icon/ui-icon.vue';
import { EditorIconsMap } from './const';

export const updateToolbarIcons = () => {
  const createIcon = (name: IconsNamesType) => {
    const IconComponent = Vue.extend(new RrIcon());
    const icon = new IconComponent({
      propsData: {
        name,
      },
    });
    icon.$mount();
    return icon.$el.outerHTML;
  };

  const icons = Quill.import('ui/icons');

  Object.keys(EditorIconsMap).forEach((key: string) => {
    if (typeof EditorIconsMap[key] === 'object') {
      Object.keys(EditorIconsMap[key]).forEach((subkey: string) => {
        icons[key][subkey] = createIcon((EditorIconsMap[key] as Record<string, IconsNamesType>)[subkey]);
      });
    } else {
      icons[key] = createIcon(EditorIconsMap[key] as IconsNamesType);
    }
  });
};
