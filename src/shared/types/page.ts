export interface Page {
  getHTML(): HTMLDivElement;
}

export interface PageParams {
  catalog?: {
    id: string;
    searchParams: string;
  };
  product?: {
    id: string;
    searchParams: string;
  };
}

export type PagesType = Map<string, () => Promise<Page>>;
