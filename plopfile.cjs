/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable func-names */
module.exports = function (plop) {
  plop.setGenerator('dynamicStructure', {
    actions(data) {
      const { folderName } = data;
      const upperCaseComponentName = String(folderName)[0].toUpperCase() + String(folderName).slice(1);
      const lowerCaseComponentName = String(folderName)[0].toLowerCase() + String(folderName).slice(1);
      return [
        {
          path: `${upperCaseComponentName}/model/${upperCaseComponentName}Model.ts`,
          templateFile: 'src/templates/NewComponent/model/TemplateModel.ts',
          type: 'add',
        },
        {
          path: `${upperCaseComponentName}/view/${upperCaseComponentName}View.ts`,
          templateFile: 'src/templates/NewComponent/view/TemplateView.ts',
          type: 'add',
        },
        {
          path: `${upperCaseComponentName}/view/${lowerCaseComponentName}View.module.scss`,
          templateFile: 'src/templates/NewComponent/view/templateView.module.scss',
          type: 'add',
        },
      ];
    },
    description: 'Генератор для динамической структуры',
    prompts: [
      {
        message: 'Введите имя нового компонента:',
        name: 'folderName',
        type: 'input',
      },
    ],
  });
};
