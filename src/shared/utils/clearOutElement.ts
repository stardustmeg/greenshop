const clearOutElement = (...args: HTMLElement[]): void => {
  args.forEach((element) => {
    if (element instanceof HTMLElement) {
      const currentElement = element;
      currentElement.innerHTML = '';
    }
  });
};

export default clearOutElement;
