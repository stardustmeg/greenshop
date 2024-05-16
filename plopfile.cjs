/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable func-names */
module.exports = function (plop) {
  plop.setGenerator('dynamicStructure', {
    actions(data) {
      const currentFolderID = String(data?.folderID).toLowerCase()[0];
      const currentFolder = findCurrentFolder(currentFolderID);
      const upperCaseComponentName =
        String(data?.componentName)[0].toUpperCase() + String(data?.componentName).slice(1);
      const lowerCaseComponentName =
        String(data?.componentName)[0].toLowerCase() + String(data?.componentName).slice(1);
      return [
        {
          path: `src${currentFolder}/${upperCaseComponentName}/model/${upperCaseComponentName}Model.ts`,
          templateFile: 'src/templates/NewComponent/model/TemplateModel.ts',
          type: 'add',
        },
        {
          path: `src${currentFolder}/${upperCaseComponentName}/view/${upperCaseComponentName}View.ts`,
          templateFile: 'src/templates/NewComponent/view/TemplateView.ts',
          type: 'add',
        },
        {
          path: `src${currentFolder}/${upperCaseComponentName}/view/${lowerCaseComponentName}View.module.scss`,
          templateFile: 'src/templates/NewComponent/view/templateView.module.scss',
          type: 'add',
        },
      ];
    },
    description: 'Генератор для динамической структуры',
    prompts: [
      {
        message: `Введите первую букву или название папки, в которую хотите создать компонент: \n
        A or a or app - app \n
        E or e or entities - entities \n
        F or f or features - features \n
        P or p or pages - pages \n
        S or s or shared - shared \n
        W or w or widgets - widgets \n
        nothing - src
        `,
        name: 'folderID',
        type: 'input',
      },
      {
        message: 'Введите имя нового компонента:',
        name: 'componentName',
        type: 'input',
      },
    ],
  });
};

function findCurrentFolder(folderID) {
  let currentFolder = '';
  switch (folderID) {
    case 'a':
      currentFolder = '/app';
      return currentFolder;
    case 'e':
      currentFolder = '/entities';
      return currentFolder;
    case 'f':
      currentFolder = '/features';
      return currentFolder;
    case 'p':
      currentFolder = '/pages';
      return currentFolder;
    case 's':
      currentFolder = '/shared';
      return currentFolder;
    case 'w':
      currentFolder = '/widgets';
      return currentFolder;
    default:
      currentFolder = '';
      return currentFolder;
  }
}
