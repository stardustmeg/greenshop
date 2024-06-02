import ScrollToTopView from '../view/ScrollToTopView.ts';

class ScrollToTopModel {
  private view: ScrollToTopView;

  constructor() {
    this.view = new ScrollToTopView();
    this.init();
  }

  private init(): void {
    const buttonElement = this.view.getHTML();
    buttonElement.addEventListener('click', this.scrollToTopHandler.bind(this));
    window.addEventListener('scroll', () => this.view.toggleVisibility());
    this.view.toggleVisibility();
  }

  private scrollToTopHandler(): void {
    window.scrollTo({ behavior: 'smooth', top: 0 });
  }

  public getHTML(): ScrollToTopView {
    return this.view;
  }
}

export default ScrollToTopModel;
