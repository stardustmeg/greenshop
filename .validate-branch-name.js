module.exports = branchNameConfig;
const branchNameConfig = {
  errorMsg: 'Please use correct branch name',
  pattern: /^(feat|fix|hotfix|chore|refactor|revert|docs|style|test|)\(RSS-ECOMM-\d{1}_\d{2}\)\/[a-z]+[a-zA-Z0-9]*$/,
};

// Branch Name Examples:

// feat(RSS-ECOMM-1_01)/add-new-product // where 1 is sprint number and 01 is issue number
// fix(RSS-ECOMM-2_15)/add-correct-product // where 2 is sprint number and 15 is issue number

module.exports = branchNameConfig;
