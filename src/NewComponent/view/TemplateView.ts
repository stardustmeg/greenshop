// import styles from './templateView.module.scss';

class NameView {
  private view: void;

  constructor() {
    this.view = this.createHTML();
  }

  private createHTML(): void {}

  public getHTML(): void {
    return this.view;
  }
}

export default NameView;
