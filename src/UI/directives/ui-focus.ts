let timeout: ReturnType<typeof setTimeout>;

function handler(el: HTMLElement, binding: any) {
  if (binding.value) {
    clearTimeout(timeout);
    if (binding.arg) {
      timeout = setTimeout(() => {
        el.focus();
      }, 50);
    } else {
      el.focus();
    }
  }
}

export const uiFocus = {
  bind: handler,
  update: handler,
};
