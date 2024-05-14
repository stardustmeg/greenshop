module.exports = {
  pattern: /^(feat|fix|hotfix|chore|refactor|revert|docs|style|test|)\(RSS-ECOMM-\d{1}_\d{2}\)\/[a-z]+[a-zA-Z0-9]*$/,
  errorMsg: 'Please use correct branch name',
};

// Branch Name Examples:

// "feat(RSS-ECOMM-1_01)/addNewProduct" // where 1 is the sprint number and 01 is the issue number
// "fix(RSS-ECOMM-2_15)/addCorrectProduct" // where 2 is the sprint number and 15 is the issue number
