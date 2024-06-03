const formattedText = (text: string): string =>
  text
    .trim()
    .split(' ')
    .map((word) => (word[0] ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ''))
    .join(' ');

export const formattedTextForMainAndCatalog = (text: string): string => {
  const exceptionMap: { [key: string]: string } = {
    catalo: 'catalog',
    mai: 'main',
  };

  return text
    .trim()
    .split(' ')
    .map((word) => {
      const lowerCaseWord = word.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(exceptionMap, lowerCaseWord)) {
        return exceptionMap[lowerCaseWord];
      }
      return word[0] ? word[0].toUpperCase() + word.slice(1).toLowerCase() : '';
    })
    .join(' ');
};

export default formattedText;
