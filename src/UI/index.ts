// import { App } from 'vue';
import components from './components';
// import * as directives from './directives';



export default class UI {  
  static install(vue: any) {
    (Object.entries(components).forEach(([name, component]) => {
      vue.component(name, component)
    }));    
  }
}

declare module 'vue' {
  interface GlobalComponents {
    /* PLOP_COMPONENT_INJECT_IMPORT */
    UiSteps: typeof components['UiSteps'];
    UiDivider: typeof components['UiDivider'];
    UiLink: typeof components['UiLink'];
    UiText: typeof components['UiText'];
    UiSubtitle: typeof components['UiSubtitle'];
    UiTitle: typeof components['UiTitle'];
    UiIcon: typeof components['UiIcon'];
    UiDropzone: typeof components['UiDropzone'];
    UiTabs: typeof components['UiTabs'];
    UiPagination: typeof components['UiPagination'];
    UiChips: typeof components['UiChips'];
    UiPopover: typeof components['UiPopover'];
    UiList: typeof components['UiList'];
    UiTable: typeof components['UiTable'];
    UiCard: typeof components['UiCard'];
    UiBreadcrumb: typeof components['UiBreadcrumbs'];
    UiButtonGroup: typeof components['UiButtonGroup'];
    UiFormItem: typeof components['UiFormItem'];
    UiInputNumber: typeof components['UiInputNumber'];
    UiButton: typeof components['UiButton'];
    UiBadge: typeof components['UiBadge'];
    UiInfinityLoader: typeof components['UiInfinityLoader'];
    UiTooltip: typeof components['UiTooltip'];
    UiEmpty: typeof components['UiEmpty'];
    UiDatepicker: typeof components['UiDatepicker'];
    UiTextarea: typeof components['UiTextarea'];
    UiInputPassword: typeof components['UiInputPassword'];
    UiInput: typeof components['UiInput'];
    UiRadio: typeof components['UiRadio'];
    UiSwitch: typeof components['UiSwitch'];
    UiSpinner: typeof components['UiSpinner'];
    UiCol: typeof components['UiCol'];
    UiContainer: typeof components['UiContainer'];
    UiRow: typeof components['UiRow'];
    UiAvatar: typeof components['UiAvatar'];
    UiCheckbox: typeof components['UiCheckbox'];
  }
}