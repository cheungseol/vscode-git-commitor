'use strict';
import * as vscode from 'vscode';
import { QUESTIONS, COMMIT_TYPES } from './constants';
import { selectPalette, inputPalette, execCommit } from './util';
import * as wrap from 'wrap-ansi';
var request = require('request');


let channel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {

    console.info('your extension "vscode-git-commitor" is now active!');

    channel = vscode.window.createOutputChannel('commitizen');
    channel.appendLine('"vscode-git-commitor" is now active~~~~');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const gitCommitor = vscode.commands.registerCommand('vscode-git-commitor.commit', async() => {
        const commitor = new CommitorController();
        await commitor.queryType();
        await commitor.queryScope();
        await commitor.queryTitle();
        await commitor.queryDescription();
        await commitor.queryRefer();
        if (vscode.workspace.workspaceFolders) {
            await execCommit(vscode.workspace.workspaceFolders[0].uri.fsPath, commitor.formattedCommit.trim(), channel);
            // await commitor.codeReviewInfo();
        }
    });

    context.subscriptions.push(gitCommitor);
}

// this method is called when your extension is deactivated
export function deactivate() {}

class CommitorController {

    private type: string|undefined;
    private scope: string|undefined;     
    private title: string|undefined;
    private description: string|undefined;
    private refer: string|undefined;

    // 暴露获取 commit 信息的接口
    public get formattedCommit(): string {
        // tslint:disable-next-line
        return  [ 
            '[' + this.type + '] ',
            (typeof this.scope === 'string' && this.scope ? `(${this.scope})` : ''),
            this.title + '\n\n',
            this.description + '\n\n'
        ].join('');
    }

    public async codeReviewInfo(): Promise<void> {
        const TEXT = "测试测试测试";
        const TITLE = `${this.refer}邀请你本次coomit改动做code review。详情查看地址：`;
    
        const LARK_MSG_URL = "https://oapi.zjurl.cn/open-apis/api/v2/message/private_chat";
        const ROBOT_TOKEN = "b-a40d31fc-45cc-4f3c-ac35-d4df8feaa4d5";
        const USER_EMAIL = this.refer + "@bytedance.com";
    
        // lark 通知 cr 同事
        request.post({
            headers: {'content-type' : 'application/json'},
            url: LARK_MSG_URL,
            json: true,
            body: {
                token: ROBOT_TOKEN,
                email: USER_EMAIL,
                msg_type: 'post',
                content: {
                    title: TITLE,
                    text: TEXT
                }
            }
          }, function(error: any, response: any, body: any){
                console.log('error:', error);
                console.log('resp:', response);
          });
    }

    
    dispose() {
        // this._disposable.dispose();
    }

    async queryType(): Promise<void> {  
        const typeOptions = COMMIT_TYPES.map(type => {
            return {
                label: type.value,
                description: type.name
            };
        });
        await selectPalette(QUESTIONS['type'], typeOptions, pick => {
            this.type = pick.label;
        });
    }

    async queryScope(): Promise<void> {
        await inputPalette(QUESTIONS['scope'], (input: string) => this.scope = input);
    }

    async queryTitle(): Promise<void> {
        await inputPalette(QUESTIONS['title'], input => this.title = input);
    }

    async queryDescription(): Promise<void> {
        await inputPalette(QUESTIONS['description'], input => this.description = wrap(input.split('|').join('\n'), 72, {hard: true}));
    }

    async queryRefer(): Promise<void> {
        await inputPalette(QUESTIONS['refer'], (input: string) => this.refer = input);
    }
}