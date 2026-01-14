interface Window {
  vscMediaUrl?: string;
  vscode?: {
    postMessage: (message: VscodeMessage) => void;
    getState: () => unknown;
    setState: (state: unknown) => void;
  };
}

interface VscodeMessage {
  command: string;
  value?: unknown;
  [key: string]: unknown;
}
