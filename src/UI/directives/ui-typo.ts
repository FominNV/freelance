interface UiTypoOptions {
  /** тип текста */
  type: 'title' | 'subtitle' | 'paragraph' | 'action',
  /** размер текста */
  size: 'xs' | 'sm' | 'md' | 'lg',
}

interface DirectiveBindindOptions {
  value: UiTypoOptions;
}

function handler(el: HTMLElement, binding: DirectiveBindindOptions) {
  const payload = binding.value || {
    type: 'paragraph',
    size: 'md',
  };

  el.classList.remove(`ui-${payload.type}--xs`);
  el.classList.remove(`ui-${payload.type}--sm`);
  el.classList.remove(`ui-${payload.type}--md`);
  el.classList.remove(`ui-${payload.type}--lg`);
  el.classList.add(`ui-${payload.type}--${payload.size}`);
}

/**
 * Директива для смены типа/размера текста
 * @example v-ui-typo="{ type: 'title', size: 'sm' }"
 */
export const UiTypo = {
  bind: handler,
  update: handler,
};
