const getDaysInMonth = (date: Date): number => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

const calcUserBirthDayRange = (birthDay: string): { end: string; start: string } => {
  const birthDate = new Date(birthDay);

  const start = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate() - 3);
  const end = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate() + 4);

  if (start.getDate() < 1) {
    start.setMonth(start.getMonth() - 1);
  }

  if (start.getMonth() < 0) {
    start.setFullYear(start.getFullYear() - 1);
    start.setMonth(12);
  }

  if (end.getDate() > getDaysInMonth(end)) {
    end.setMonth(end.getMonth() + 1);
  }

  if (end.getMonth() > 11) {
    end.setFullYear(end.getFullYear() + 1);
    end.setMonth(1);
  }

  const endDate = end.toISOString().split('T')[0];
  const startDate = start.toISOString().split('T')[0];

  return { end: endDate, start: startDate };
};

export default calcUserBirthDayRange;
