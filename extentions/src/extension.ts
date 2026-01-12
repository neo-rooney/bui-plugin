import * as vscode from "vscode";

class BuiPluginViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "bui-plugin-view";
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    return `<!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BUI Plugin</title>
        <style>
          body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            color: var(--vscode-foreground);
          }
          h1 {
            color: var(--vscode-textLink-foreground);
          }
        </style>
      </head>
      <body>
        <h1>Hello Webview!</h1>
        <p>BUI Plugin이 정상적으로 작동하고 있습니다.</p>
      </body>
      </html>`;
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "bui-plugin" is now active!');

  const provider = new BuiPluginViewProvider(context.extensionUri);

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
