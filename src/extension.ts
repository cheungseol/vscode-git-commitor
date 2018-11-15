'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { QUESTIONS, COMMIT_TYPES } from './constants';
import { askOneOf, execCommit } from './util';

let channel: vscode.OutputChannel;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-git-commitor" is now active!');

    channel = vscode.window.createOutputChannel('commitizen');
    channel.appendLine('"vscode-git-commitor" is now active');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const gitCommitor = vscode.commands.registerCommand('vscode-git-commitor.commit', async() => {
        const commitor = new CommitorController();
        await commitor.getType();
        if (vscode.workspace.workspaceFolders) {
            await execCommit(vscode.workspace.workspaceFolders[0].uri.fsPath, commitor.message.trim(), channel);
        }
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    context.subscriptions.push(gitCommitor);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class CommitorController {

    private type: string|undefined;
    // private scope: string|undefined;     
    // private subject: string;             
    // private body: string|undefined;

    private next = true; // 控制问题

    // 暴露获取 commit 信息的接口
    public get message(): string {
        // tslint:disable-next-line prefer-template
        return this.type + '';
    }

    
    dispose() {
        // this._disposable.dispose();
    }

    async getType(): Promise<void> {  
        const typeOptions = COMMIT_TYPES.map(type => {
            return {
                label: type.value,
                description: type.name
            };
        });
        this.next = await askOneOf(QUESTIONS['type'], typeOptions, pick => {
            this.type = pick.label;
        });
        console.log(this.next, this.type);
    }
}