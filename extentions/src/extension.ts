import * as vscode from "vscode";
import { GUIWebviewViewProvider } from "./GUIWebviewViewProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "bui-plugin" is now active!');

  const provider = new GUIWebviewViewProvider(context.extensionUri, context);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      GUIWebviewViewProvider.viewType,
      provider
    )
  );
}

export function deactivate() {}
