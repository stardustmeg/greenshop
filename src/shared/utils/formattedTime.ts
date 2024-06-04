const formattedMinutes = (minutes: number): string => {
  const lastDigit = minutes % 10;
  let result = `${minutes} минут`;
  if (lastDigit === 1 && minutes !== 11) {
    result = `${minutes} минуту`;
  } else if (lastDigit !== 1 && (minutes < 5 || minutes > 20)) {
    result = `${minutes} минуты`;
  }

  return result;
};

export default formattedMinutes;
