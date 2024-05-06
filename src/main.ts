import AppModel from '@/app/App/model/AppModel.ts';
import '@/styles.scss';

const myApp = new AppModel();
document.body.append(myApp.getHTML());
