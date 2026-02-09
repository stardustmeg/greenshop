interface CooperationListItem {
  text: string;
}

interface CooperationItem {
  description?: string;
  items?: CooperationListItem[];
  subtitle?: string;
  title?: string;
}

export interface CooperationData {
  en: CooperationItem;
  ru: CooperationItem;
}

const isCooperationItem = (data: unknown): data is CooperationItem => {
  let result = true;
  if (data === null || typeof data !== 'object') {
    result = false;
    return result;
  }

  if ('description' in data && typeof data.description === 'string') {
    result = true;
  }

  if ('title' in data && typeof data.title === 'string') {
    result = true;
  }

  if ('subtitle' in data && typeof data.subtitle === 'string') {
    result = true;
  }

  if ('items' in data && Array.isArray(data.items)) {
    data.items.forEach((item: CooperationListItem) => {
      result = 'text' in item && typeof item.text === 'string';
    });
  }

  return result;
};

const isCooperationData = (data: unknown): data is CooperationData[] => {
  let result = true;
  if (!Array.isArray(data)) {
    return false;
  }
  data.forEach((item: CooperationData) => {
    if ('en' in item && 'ru' in item) {
      result = isCooperationItem(item.en) && isCooperationItem(item.ru);
    } else {
      result = false;
    }
  });

  return result;
};

export default isCooperationData;
