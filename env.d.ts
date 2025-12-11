/// <reference types="vite/client" />

interface ImportMetaEnv {
  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }

  // Analytics globals (declared to satisfy TS)
  // eslint-disable-next-line no-var
  var gtag: (...args: any[]) => void;
  // eslint-disable-next-line no-var
  var fbq: (...args: any[]) => void;
}

export { }
