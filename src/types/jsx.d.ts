declare namespace JSX {
  interface IntrinsicElements {
    'adk-client': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      'api-url'?: string;
      'app-name'?: string;
      'user-id'?: string;
      'session-id'?: string;
      'mode'?: 'fullscreen' | 'widget';
      'response-mode'?: 'standard' | 'stream';
      'title'?: string;
      'emoji'?: string;
      'show-settings'?: string;
      'floating-button-icon'?: string;
      'floating-button-color'?: string;
    };
  }
}
