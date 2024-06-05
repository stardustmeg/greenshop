const COOPERATION_URL = 'https://raw.githubusercontent.com/stardustmeg/greenshop-db/main/cooperation/cooperation.json';

const getCooperationData = async (): Promise<unknown> => {
  const response = await fetch(COOPERATION_URL);
  const data: unknown = await response.json();
  return data;
};

export default getCooperationData;
