export interface LinkAttributes {
  attrs?: Record<string, string>;
  classes?: string[];
  text?: string;
}

export interface BreadCrumbLink {
  link: string;
  name: string;
}
