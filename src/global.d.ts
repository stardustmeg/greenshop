declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

interface SvgSprite {
  [key: string]: string;
}

declare module '*.svg' {
  const content: SvgSprite;
  export default content;
}
