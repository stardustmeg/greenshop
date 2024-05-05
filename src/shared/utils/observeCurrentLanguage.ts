import getStore from '../Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '../Store/observer.ts';

function observeCurrentLanguage(el: HTMLElement, map: Record<string, Record<string, string>>, text: string): boolean {
  const element = el;
  observeStore(selectCurrentLanguage, () => {
    element.innerText = map[getStore().getState().currentLanguage][text];
  });
  return true;
}

export default observeCurrentLanguage;
