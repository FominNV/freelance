import { UiClipboardAdapterImpl } from '../components/ui-copy/interfaces';

export interface CopyConfig {
  /** адаптер для взаимодействия с буфером обмена */
  adapter: UiClipboardAdapterImpl;
}
