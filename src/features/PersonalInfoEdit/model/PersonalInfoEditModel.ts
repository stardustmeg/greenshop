import PersonalInfoEditView from '../view/PersonalInfoEditView.ts';

class PersonalInfoEditModel {
  private view = new PersonalInfoEditView();

  constructor() {
    this.init();
  }

  private init(): void {}

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default PersonalInfoEditModel;
