import { useEffect } from "react";

export function useVscodeMessageSend() {
  const postMessage = (message: VscodeMessage): void => {
    if (window.vscode) {
      window.vscode.postMessage(message);
    }
  };

  return { postMessage };
}

export function useVscodeMessageReceive(
  command: string,
  callback: (message: VscodeMessage) => void
): void {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data as VscodeMessage;
      if (message.command === command) {
        callback(message);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [command, callback]);
}
