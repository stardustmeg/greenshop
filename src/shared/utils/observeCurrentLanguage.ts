import getStore from '../Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '../Store/observer.ts';

const observeCurrentLanguage = (
  el: HTMLElement | Node,
  map: Record<string, Record<string, string>>,
  text: string,
): boolean => {
  const element = el;
  const textNode = [...element.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);

  if (textNode) {
    observeStore(selectCurrentLanguage, () => {
      textNode.textContent = map[getStore().getState().currentLanguage][text];
    });
  }
  return true;
};

export default observeCurrentLanguage;
