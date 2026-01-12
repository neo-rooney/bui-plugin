import * as vscode from "vscode";

class BuiPluginViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "bui-plugin-view";
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _extensionContext: vscode.ExtensionContext
  ) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    const inDevelopmentMode =
      this._extensionContext.extensionMode === vscode.ExtensionMode.Development;
    console.log(
      "===============inDevelopmentMode===============",
      inDevelopmentMode
    );

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        this._extensionUri,
        vscode.Uri.joinPath(this._extensionUri, "gui"),
      ],
      portMapping: inDevelopmentMode
        ? [
            {
              webviewPort: 5173,
              extensionHostPort: 5173,
            },
          ]
        : undefined,
    };
    webviewView.webview.html = this._getHtmlForWebview(
      webviewView.webview,
      inDevelopmentMode
    );
  }

  private _getHtmlForWebview(
    webview: vscode.Webview,
    inDevelopmentMode: boolean
  ) {
    let scriptUri: string;
    let styleMainUri: string;

    if (inDevelopmentMode) {
      // 개발 모드: Vite 개발 서버 사용
      scriptUri = "http://localhost:5173/src/main.tsx";
      styleMainUri = "http://localhost:5173/src/index.css";
    } else {
      // 프로덕션 모드: 빌드된 파일 사용
      scriptUri = webview
        .asWebviewUri(
          vscode.Uri.joinPath(this._extensionUri, "gui", "assets", "index.js")
        )
        .toString();
      styleMainUri = webview
        .asWebviewUri(
          vscode.Uri.joinPath(this._extensionUri, "gui", "assets", "index.css")
        )
        .toString();
    }

    return `<!DOCTYPE html>
    <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script>const vscode = acquireVsCodeApi();</script>
        <link href="${styleMainUri}" rel="stylesheet">
        <title>BUI Plugin</title>
      </head>
      <body>
        <div id="root"></div>
        
        ${
          inDevelopmentMode
            ? `<script type="module">
          import RefreshRuntime from "http://localhost:5173/@react-refresh"
          RefreshRuntime.injectIntoGlobalHook(window)
          window.$RefreshReg$ = () => {}
          window.$RefreshSig$ = () => (type) => type
          window.__vite_plugin_react_preamble_installed__ = true
          </script>`
            : ""
        }
        
        <script type="module" src="${scriptUri}"></script>
      </body>
    </html>`;
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "bui-plugin" is now active!');

  const provider = new BuiPluginViewProvider(context.extensionUri, context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      BuiPluginViewProvider.viewType,
      provider
    )
  );

  const disposable = vscode.commands.registerCommand(
    "bui-plugin.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World from bui-plugin!");
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
