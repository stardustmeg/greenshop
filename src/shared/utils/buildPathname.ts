// eslint-disable-next-line import/prefer-default-export
export const buildPathName = (
  endpoint: null | string,
  id: null | string,
  queryParams: { [key: string]: (null | string)[] } | null,
): string => {
  if (!queryParams) {
    return `${endpoint ? `${endpoint}` : ''}${id ? `${id} ` : ''}`;
  }

  const queryString = Object.entries(queryParams)
    .filter(([, values]) => values.some(Boolean))
    .map(([key, values]) => `${key}=${values.filter(Boolean).join('_')}`)
    .join('&');

  return `${endpoint ? `${endpoint}` : ''}${id ? `/${id}` : ''}${queryString ? `${`?${queryString}`}` : ''}`;
};
