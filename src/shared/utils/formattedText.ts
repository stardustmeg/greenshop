const formattedText = (text: string): string =>
  text
    .trim()
    .split(' ')
    .map((word) => (word[0] ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ''))
    .join(' ');

export default formattedText;
