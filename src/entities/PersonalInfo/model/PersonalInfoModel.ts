import type { PersonalInfo } from '@/shared/types/user.ts';

import formattedText from '@/shared/utils/formattedText.ts';

import PersonalInfoView from '../view/PersonalInfoView.ts';

class PersonalInfoModel {
  private view = new PersonalInfoView();

  public getFormPersonalInfo(): PersonalInfo {
    const userData: PersonalInfo = {
      birthDate: this.view.getDateOfBirthField().getView().getValue(),
      firstName: formattedText(this.view.getFirstNameField().getView().getValue()),
      lastName: formattedText(this.view.getLastNameField().getView().getValue()),
    };
    return userData;
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public getView(): PersonalInfoView {
    return this.view;
  }
}

export default PersonalInfoModel;
