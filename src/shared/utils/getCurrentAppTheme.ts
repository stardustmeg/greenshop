import getStore from '../Store/Store.ts';

const getCurrentAppTheme = (): 'false' | 'true' => (getStore().getState().isAppThemeLight ? 'true' : 'false');
export default getCurrentAppTheme;
