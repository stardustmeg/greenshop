import ErrorMessageView from '../view/ErrorMessageView.ts';

class ErrorMessageModel {
  private view: ErrorMessageView = new ErrorMessageView();

  public showErrorMessage(message: string): boolean {
    return this.view.setErrorMessage(message);
  }
}

const errorMessageModel = new ErrorMessageModel();

export default errorMessageModel;
