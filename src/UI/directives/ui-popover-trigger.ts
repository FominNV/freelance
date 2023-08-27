function handler(el: HTMLElement) {
  el.setAttribute('data-ui-popover-trigger', '');
}

export const RrPopoverTrigger = {
  bind: handler,
  update: handler,
};
