/// <reference types="vite/client" />

declare global {
  interface Window {
    elevenLabsConvaiWidget?: any;
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    'elevenlabs-convai': {
      'agent-id': string;
      'data-state'?: string;
      style?: React.CSSProperties;
    };
  }
}
