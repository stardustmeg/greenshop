/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable func-names */
module.exports = function (plop) {
  plop.setGenerator('dynamicStructure', {
    actions(data) {
      const upperCaseComponentName =
        String(data?.componentName)[0].toUpperCase() + String(data?.componentName).slice(1);
      const lowerCaseComponentName =
        String(data?.componentName)[0].toLowerCase() + String(data?.componentName).slice(1);
      const modelClassName = `${upperCaseComponentName}Model`;
      const viewClassName = `${upperCaseComponentName}View`;
      const stylesName = `${lowerCaseComponentName}View.module.scss`;
      return [
        {
          data: {
            modelClassName,
            viewClassName,
          },
          path: `src/${data?.folderName}/${upperCaseComponentName}/model/${upperCaseComponentName}Model.ts`,
          templateFile: 'src/templates/NewComponent/model/TemplateModel.ts',
          type: 'add',
        },
        {
          data: {
            stylesName,
            viewClassName,
          },
          path: `src/${data?.folderName}/${upperCaseComponentName}/view/${upperCaseComponentName}View.ts`,
          templateFile: 'src/templates/NewComponent/view/TemplateView.ts',
          type: 'add',
        },
        {
          path: `src/${data?.folderName}/${upperCaseComponentName}/view/${lowerCaseComponentName}View.module.scss`,
          templateFile: 'src/templates/NewComponent/view/templateView.module.scss',
          type: 'add',
        },
      ];
    },
    description: 'Generator for new component',
    prompts: [
      {
        choices: [
          {
            name: 'app',
            value: 'app',
          },
          {
            name: 'entities',
            value: 'entities',
          },
          {
            name: 'features',
            value: 'features',
          },
          {
            name: 'pages',
            value: 'pages',
          },
          {
            name: 'shared',
            value: 'shared',
          },
          {
            name: 'widgets',
            value: 'widgets',
          },
        ],
        message: 'Choose the folder where you want to create new component:',
        name: 'folderName',
        type: 'rawlist',
      },
      {
        message: 'Enter the new component name:',
        name: 'componentName',
        type: 'input',
      },
    ],
  });
};
