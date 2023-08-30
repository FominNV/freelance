function handler(el: HTMLElement) {
  el.setAttribute('data-ui-popover-trigger', '');
}

export const UiPopoverTrigger = {
  bind: handler,
  update: handler,
};
