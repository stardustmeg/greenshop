const SERVER_MESSAGE_ANIMATE_PARAMS = [
  { transform: 'translateX(110%)' },
  { transform: 'translateX(-10%)' },
  { transform: 'translateX(-10%)' },
  { opacity: 1, transform: 'translateX(-10%)' },
  { opacity: 0, transform: 'translate(-10%, -110%)' },
];

const SERVER_MESSAGE_ANIMATE_DETAILS = {
  duration: 5500,
  easing: 'cubic-bezier(0, 0.2, 0.58, 0.7)',
  params: SERVER_MESSAGE_ANIMATE_PARAMS,
};

export const PAGE_TIMEOUT_DURATION = 200;

export default SERVER_MESSAGE_ANIMATE_DETAILS;
