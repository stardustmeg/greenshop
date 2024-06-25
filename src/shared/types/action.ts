type ActionType =
  | 'animationend'
  | 'animationiteration'
  | 'animationstart'
  | 'blur'
  | 'change'
  | 'click'
  | 'contextmenu'
  | 'focus'
  | 'hover'
  | 'input'
  | 'keydown'
  | 'keyup'
  | 'load'
  | 'resize'
  | 'scroll'
  | 'submit'
  | 'touchcancel'
  | 'touchend'
  | 'touchmove'
  | 'touchstart'
  | 'transitioncancel'
  | 'transitionend'
  | 'transitionrun'
  | 'transitionstart';

export type ButtonActionType = { key: ActionType; value: () => void };
export type ListenerCallback<T> = (params: T) => void;
