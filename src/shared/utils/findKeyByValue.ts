/* eslint-disable @typescript-eslint/no-unused-vars */
function findKeyByValue<T>(obj: { [key: string]: T }, value: T): null | string {
  const foundEntry = Object.entries(obj).find(([_key, val]) => val === value);
  return foundEntry ? foundEntry[0] : null;
}

export default findKeyByValue;
