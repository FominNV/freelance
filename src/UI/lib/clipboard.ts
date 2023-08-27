export const setClipboardText = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    throw new Error('navigator.clipboard is undefined');
  }
};
