import * as vscode from "vscode";

const CONFIG = {
  devServer: {
    port: 5173,
    baseUrl: "http://localhost:5173",
  },
  paths: {
    gui: "gui",
    assets: "assets",
  },
  files: {
    script: "index.js",
    style: "index.css",
    scriptSource: "src/main.tsx",
    styleSource: "src/index.css",
  },
} as const;

interface ResourceUris {
  scriptUri: string;
  styleMainUri: string;
  vscMediaUrl: string;
}

export class GUIWebviewViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "bui-plugin-view";

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _extensionContext: vscode.ExtensionContext
  ) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this.configureWebviewOptions(webviewView.webview);
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case "countChanged":
            console.log(`[BUI Plugin] Count changed: ${message.value}`);

            setTimeout(() => {
              webviewView.webview.postMessage({
                command: "countResponse",
                value: message.value,
                message: `Count ${message.value} received!`,
              });
            }, 2000);
            break;
          default:
            console.log(`[BUI Plugin] Received message:`, message);
        }
      },
      undefined,
      this._extensionContext.subscriptions
    );
  }

  private get isDevelopmentMode(): boolean {
    return (
      this._extensionContext.extensionMode === vscode.ExtensionMode.Development
    );
  }

  private configureWebviewOptions(webview: vscode.Webview): void {
    webview.options = {
      enableScripts: true,
      localResourceRoots: [
        this._extensionUri,
        vscode.Uri.joinPath(this._extensionUri, CONFIG.paths.gui),
      ],
      portMapping: this.isDevelopmentMode
        ? [
            {
              webviewPort: CONFIG.devServer.port,
              extensionHostPort: CONFIG.devServer.port,
            },
          ]
        : undefined,
    };
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const resourceUris = this._getResourceUris(webview);

    return `<!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script>window.vscode = acquireVsCodeApi();</script>
        <script>window.vscMediaUrl = "${resourceUris.vscMediaUrl}"</script>
        <link href="${resourceUris.styleMainUri}" rel="stylesheet">
        <title>BUI Plugin</title>
      </head>
      <body>
        <div id="root"></div>
        ${this._getReactRefreshScript()}
        <script type="module" src="${resourceUris.scriptUri}"></script>
      </body>
    </html>`;
  }

  private _getResourceUris(webview: vscode.Webview): ResourceUris {
    if (this.isDevelopmentMode) {
      return {
        scriptUri: `${CONFIG.devServer.baseUrl}/${CONFIG.files.scriptSource}`,
        styleMainUri: `${CONFIG.devServer.baseUrl}/${CONFIG.files.styleSource}`,
        vscMediaUrl: CONFIG.devServer.baseUrl,
      };
    }

    // 프로덕션 모드: 빌드된 파일 사용
    const guiUri = vscode.Uri.joinPath(this._extensionUri, CONFIG.paths.gui);
    const assetsUri = vscode.Uri.joinPath(guiUri, CONFIG.paths.assets);

    return {
      scriptUri: webview
        .asWebviewUri(vscode.Uri.joinPath(assetsUri, CONFIG.files.script))
        .toString(),
      styleMainUri: webview
        .asWebviewUri(vscode.Uri.joinPath(assetsUri, CONFIG.files.style))
        .toString(),
      vscMediaUrl: webview.asWebviewUri(guiUri).toString(),
    };
  }

  private _getReactRefreshScript(): string {
    if (!this.isDevelopmentMode) {
      return "";
    }

    return `<script type="module">
          import RefreshRuntime from "${CONFIG.devServer.baseUrl}/@react-refresh"
          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
          </script>`;
  }
}
