import { RrVuiLibUseOptions } from './index';

export function install(Vue: any, args: RrVuiLibUseOptions = {}) {
  if ((install as any).installed) return;
  (install as any).installed = true;

  // if (OurVue !== Vue) {
  //   throw new Error(`Multiple instances of Vue detected
  //   See https://github.com/vuetifyjs/vuetify/issues/4068
  //   If you're seeing "$attrs is readonly", it's caused by this`);
  // }

  const components = args.components || {};
  const directives = args.directives || {};
  Vue.prototype.$rrVui = args.config;

  registerComponents(components);
  registerDirectives(directives);

  function registerComponents(registerData: any) {
    if (registerData) {
      Object.keys(registerData).forEach((key: string) => {
        const data = registerData[key];
        const dataType = typeof data.render === 'function' || typeof data === 'function' ? 'component' : 'directives';

        if (dataType === 'component') {
          Vue.component(key, data);
          return;
        }
      });
      return true;
    }
    return false;
  }


  function registerDirectives(directives: any) {
    if (directives) {
      Object.keys(directives).forEach((key: string) => {
        const directive = directives[key];
        Vue.directive(key, directive);
      });
      return true;
    }
    return false;
  }

}
