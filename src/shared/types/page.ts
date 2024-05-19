export interface Page {
  getHTML(): HTMLDivElement;
}

export interface PageParams {
  catalog?: {
    searchParams: string;
  };
  product?: {
    id: string;
    searchParams: string;
  };
}

export type PagesType = Map<string, (params: PageParams) => Promise<Page>>;
