const ABOUT_URL = 'https://raw.githubusercontent.com/stardustmeg/greenshop-db/main/about/about.json';

const getAboutData = async (): Promise<unknown> => {
  const response = await fetch(ABOUT_URL);
  const data: unknown = await response.json();
  return data;
};

export default getAboutData;
