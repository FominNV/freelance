import { Route } from 'vue-router';

export interface BreadcrumbsItemImpl {
  /** иконка */
  icon?: IconsNamesType;
  /** текст */
  text?: string;
  /** параметры роута */
  to?: Route;
  /** адрес ссылки */
  href?: string;
  /**
   * определяет, где показать содержимое по ссылке
   * @param _blank загружает документ в новом окне
   * @param _self загружает документ в текущем фрейме
   * @param _parent загружает документ в родительском фрейме
   * @param _top В HTML5 загружает в окне высшего уровня. Если родителя нет, опция ведёт себя как _self
   */
  target?: '_blank' | '_self' | '_parent' | '_top';
}
