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
  };
}
