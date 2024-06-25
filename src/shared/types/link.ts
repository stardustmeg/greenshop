export interface LinkAttributes {
  attrs?: Record<string, string>;
  classes?: string[];
  text?: string;
}

export interface BreadcrumbLink {
  link: string;
  name: string;
}
