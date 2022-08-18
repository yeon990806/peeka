
declare global {
  interface Window {
    afterAction: any;
  }

  interface File {
    idx: string;
  }
}

export const ReactNativeWebView = window.ReactNativeWebView;