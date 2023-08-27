import { RrClipboardAdapterImpl } from '../components/ui-copy/interfaces';

export interface CopyConfig {
  /** адаптер для взаимодействия с буфером обмена */
  adapter: RrClipboardAdapterImpl;
}
