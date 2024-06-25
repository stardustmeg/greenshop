const SERVER_MESSAGE_ANIMATE_PARAMS = [
  { transform: 'translateX(-120%)' },
  { transform: 'translateX(10%)' },
  { transform: 'translateX(10%)' },
  { opacity: 1, transform: 'translateX(10%)' },
  { opacity: 0, transform: 'translate(10%, -100%)' },
];

const SERVER_MESSAGE_ANIMATE_DETAILS = {
  duration: 5500,
  easing: 'cubic-bezier(0, 0.2, 0.58, 0.7)',
  params: SERVER_MESSAGE_ANIMATE_PARAMS,
};

const SERVER_MESSAGE_PROGRESS_BAR_ANIMATE_PARAMS_START = [{ transform: 'scaleX(0%)' }, { transform: 'scaleX(100%)' }];
const SERVER_MESSAGE_PROGRESS_BAR_ANIMATE_PARAMS_END = [{ transform: 'scaleX(100%)' }, { transform: 'scaleX(0%)' }];

export const SERVER_MESSAGE_PROGRESS_BAR_ANIMATE_DETAILS_START = {
  delay: 750,
  duration: 2900,
  easing: 'cubic-bezier(0, 0.2, 0.58, 0.7)',
  params: SERVER_MESSAGE_PROGRESS_BAR_ANIMATE_PARAMS_START,
};

export const SERVER_MESSAGE_PROGRESS_BAR_ANIMATE_DETAILS_END = {
  delay: 3800,
  duration: 1500,
  easing: 'cubic-bezier(0, 0.2, 0.58, 0.7)',
  params: SERVER_MESSAGE_PROGRESS_BAR_ANIMATE_PARAMS_END,
};

export default SERVER_MESSAGE_ANIMATE_DETAILS;
