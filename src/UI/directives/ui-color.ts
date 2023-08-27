export type ColorNames = 'text-primary' | 'text-light' | 'text-placeholder' | 'text-secondary' | 'text-color-inversion'
  | 'neutral-0' | 'neutral-100' | 'neutral-200' | 'neutral-300' | 'neutral-400' | 'neutral-900' | 'neutral-900-alpha-1'
  | 'neutral-900-alpha-2' | 'primary-50' | 'primary-100' | 'primary-300' | 'primary-400' | 'primary-500' | 'primary-600'
  | 'error-100' | 'error-300' | 'error-500' | 'error-600' | 'success-100' | 'success-300' | 'success-500' | 'success-600'
  | 'warning-100' | 'warning-300' | 'warning-500' | 'warning-600' | 'purple-100' | 'purple-300' | 'purple-500' | 'purple-600'
  | 'cyan-100' | 'cyan-300' | 'cyan-500' | 'cyan-600' | 'orange-100' | 'orange-300' | 'orange-500' | 'orange-600';

function handler(el: HTMLElement, binding: any) {
  if (binding.value && binding.arg) {
    const payload = binding.value;

    if (binding.arg === 'text') {
      el.setAttribute('style', `color: var(--color-${payload}) !important;${el.getAttribute('style')?.replace(/color: var\([a-z0-9\\-]+\) !important;/gm, '') || ''}`);
    } else if (binding.arg === 'bg') {
      el.setAttribute(
        'style',
        `background-color: var(--color-${payload}) !important;${el.getAttribute('style')?.replace(/background-color: var\([a-z0-9\\-]+\) !important;/gm, '') || ''}`,
      );
    }
  }
}

/**
 * Директива для смены цвета текста и фона конпонента
 * @example  v-ui-color:text="'primary-400'" v-ui-color:bg="'neutral-300'"
 */
export const RrColor = {
  bind: handler,
  update: handler,
};
