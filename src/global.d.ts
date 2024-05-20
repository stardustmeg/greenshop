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

declare module '*.png' {
  const content: string;
  export default content;
}

interface ImportMeta {
  env: {
    [key: string]: boolean | string | undefined;
    DEV: boolean;
    MODE: 'development' | 'production';
    PROD: boolean;
    VITE_APP_CTP_API_URL: string;
    VITE_APP_CTP_AUTH_UR: string;
    VITE_APP_CTP_CLIENT_ID: string;
    VITE_APP_CTP_CLIENT_SECRET: string;
    VITE_APP_CTP_PROJECT_KEY: string;
    VITE_APP_CTP_REGION: string;
    VITE_APP_CTP_SCOPES: string;
    VITE_APP_DEFAULT_SEGMENT: string;
    VITE_APP_NEXT_SEGMENT: number;
    VITE_APP_PATH_SEGMENTS_TO_KEEP: number;
    VITE_APP_PROJECT_TITLE: string;
    VITE_APP_SEARCH_SEGMENT: string;
  };
}
