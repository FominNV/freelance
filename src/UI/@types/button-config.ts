import { ButtonThemesType } from '../components/ui-button/const';
import { SpinnerTypesType } from '../components/ui-spinner/const';

export interface ButtonConfig {
  /** дефолтный тип загрузчика */
  spinnerType?: SpinnerTypesType;
  /** дефолтная тема кнопки */
  defaultTheme?: ButtonThemesType;
  /** наличие внутренних отступов по бокам */
  innerPaddings?: boolean;
}
