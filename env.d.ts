/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options?: any) => string;
      remove: (id: string) => void;
      reset: (id?: string) => void;
      execute: (id: string, options?: any) => void;
    };
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

