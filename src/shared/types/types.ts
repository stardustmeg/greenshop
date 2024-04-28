type ActionsType =
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

type ButtonActionType = { key: ActionsType; value: () => void };
export default ButtonActionType;
