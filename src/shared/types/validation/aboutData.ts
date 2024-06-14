interface AboutText {
  en: {
    text: string;
  };
  ru: {
    text: string;
  };
}

export interface AboutLabel {
  backgroundColor: AboutColor;
  color: AboutColor;
  name: string;
}

interface AboutGithub {
  link: string;
  name: string;
}

interface AboutColor {
  false: {
    color: string;
  };
  true: {
    color: string;
  };
}

export interface AboutFeedback {
  from: string;
  text: AboutText;
}

interface AboutChecklist {
  en: {
    text: string;
  }[];
  ru: {
    text: string;
  }[];
}

export interface AboutData {
  avatar: string;
  checklist: AboutChecklist;
  coverColor: AboutColor;
  feedback: AboutFeedback[];
  github: AboutGithub;
  labels: AboutLabel[];
  position: AboutText;
  shortDescription: AboutText;
  userName: AboutText;
}

const isAboutText = (data: unknown): data is AboutText =>
  typeof data === 'object' &&
  data !== null &&
  'en' in data &&
  'ru' in data &&
  'text' &&
  typeof data.en === 'object' &&
  typeof data.ru === 'object' &&
  data.en !== null &&
  data.ru !== null &&
  'text' in data.en &&
  'text' in data.ru &&
  typeof data.en.text === 'string' &&
  typeof data.ru.text === 'string';

const isAboutData = (data: unknown): data is AboutData[] => {
  if (!Array.isArray(data)) {
    return false;
  }

  return data.every(
    (item: AboutData) =>
      typeof item.avatar === 'string' &&
      typeof item.coverColor === 'object' &&
      'false' in item.coverColor &&
      'true' in item.coverColor &&
      typeof item.coverColor.false === 'object' &&
      typeof item.coverColor.true === 'object' &&
      typeof item.coverColor.false.color === 'string' &&
      typeof item.coverColor.true.color === 'string' &&
      typeof item.github === 'object' &&
      'link' in item.github &&
      'name' in item.github &&
      typeof item.github.name === 'string' &&
      typeof item.github.link === 'string' &&
      typeof item.checklist === 'object' &&
      'en' in item.checklist &&
      'ru' in item.checklist &&
      typeof item.checklist.en === 'object' &&
      typeof item.checklist.ru === 'object' &&
      Array.isArray(item.checklist.en) &&
      Array.isArray(item.checklist.ru) &&
      isAboutText(item.userName) &&
      isAboutText(item.position) &&
      isAboutText(item.shortDescription) &&
      Array.isArray(item.labels) &&
      Array.isArray(item.feedback),
  );
};

export default isAboutData;
