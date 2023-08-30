import { merge } from 'lodash';
import { ButtonConfig } from './@types/button-config';
import { SpinnerConfig } from './@types/spinner-config';
import { IconsConfig } from './@types/icons-config';
import { CopyConfig } from './@types/copy-config';
import { UiClipboardAdapter } from './components/ui-copy/ui-clipboard-adapter';

export interface UiVuiLibConfig {
  spinner?: SpinnerConfig;
  button?: ButtonConfig;
  icons: IconsConfig;
  copy?: CopyConfig;
}

class Config implements UiVuiLibConfig {
  readonly spinner: SpinnerConfig = {
    defaultType: 'spinner-loader',
  };
  readonly button: ButtonConfig = {
    spinnerType: 'spinner-loader',
    innerPaddings: true,
  };
  readonly icons: IconsConfig = {
    iconType: 'sprite',
    systemIcons: {
      arrows: {
        chevronDown: 'arrows/chevron-down',
        chevronLeft: 'arrows/chevron-left',
        chevronRight: 'arrows/chevron-right',
        chevronUp: 'arrows/chevron-up',
      },
      controls: {
        calendar: 'objects/calendar',
        clear: 'system/xmark-gray-circle',
        check: 'system/check',
        clock: 'objects/clock',
        eye: 'system/eye',
        eyeSlash: 'system/eye-slash',
        plus: 'system/plus',
        minusSmall: 'system/minus-small',
        minus: 'system/minus',
        file: 'files-and-folders/file',
        filePlus: 'files-and-folders/file-plus',
        folder: 'files-and-folders/folder',
        folderOpen: 'files-and-folders/folder-open',
        gripIcon: 'system/grip-dots-v',
      },
      actions: {
        close: 'system/xmark',
        link: 'arrows/arrow-action',
        copy: 'system/file-copy',
      },
      indicators: {
        success: 'system/success',
        warning: 'system/attention',
        error: 'system/error',
        info: 'system/information',
      },
      menu: {
        menuKebabH: 'system/menu-kebab-h',
        menuKebabV: 'system/menu-kebab-v',
      },
    },
  };
  
  readonly copy: CopyConfig = {
    adapter: new UiClipboardAdapter(),
  };

  constructor(options?: UiVuiLibConfig) {
    this.update(options);
  }

  public update(options?: UiVuiLibConfig) {
    if (options) {
      merge(this, options);
    }
  }

  public toJSON(): UiVuiLibConfig {
    return {
      spinner: {
        defaultType: this.spinner.defaultType,
      },
      button: {
        spinnerType: this.button.spinnerType,
      },
      icons: {
        iconType: this.icons.iconType,
        systemIcons: {
          arrows: {
            chevronDown: this.icons.systemIcons.arrows.chevronDown,
            chevronLeft: this.icons.systemIcons.arrows.chevronLeft,
            chevronRight: this.icons.systemIcons.arrows.chevronRight,
            chevronUp: this.icons.systemIcons.arrows.chevronUp,
          },
          controls: {
            calendar: this.icons.systemIcons.controls.calendar,
            check: this.icons.systemIcons.controls.check,
            clear: this.icons.systemIcons.controls.clear,
            clock: this.icons.systemIcons.controls.clock,
            eye: this.icons.systemIcons.controls.eye,
            eyeSlash: this.icons.systemIcons.controls.eyeSlash,
            minusSmall: this.icons.systemIcons.controls.minusSmall,
            minus: this.icons.systemIcons.controls.minus,
            plus: this.icons.systemIcons.controls.plus,
            file: this.icons.systemIcons.controls.file,
            filePlus: this.icons.systemIcons.controls.filePlus,
            folder: this.icons.systemIcons.controls.folder,
            folderOpen: this.icons.systemIcons.controls.folderOpen,
            gripIcon: this.icons.systemIcons.controls.gripIcon,
          },
          actions: {
            close: this.icons.systemIcons.actions.close,
            link: this.icons.systemIcons.actions.link,
            copy: this.icons.systemIcons.actions.copy,
          },
          indicators: {
            success: this.icons.systemIcons.indicators.success,
            warning: this.icons.systemIcons.indicators.warning,
            error: this.icons.systemIcons.indicators.error,
            info: this.icons.systemIcons.indicators.info,
          },
          menu: {
            menuKebabH: this.icons.systemIcons.menu.menuKebabH,
            menuKebabV: this.icons.systemIcons.menu.menuKebabV,
          },
        },
      },
    };
  }
}

export default new Config();
