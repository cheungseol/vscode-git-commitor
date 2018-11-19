
import * as vscode from 'vscode';
import * as execa from 'execa';

// 多选
export async function selectPalette(
	question: string, picks: vscode.QuickPickItem[],
	callback: (pick: vscode.QuickPickItem) => void
): Promise<boolean> {
    const pickOptions: vscode.QuickPickOptions = {
		placeHolder: question,
		ignoreFocusOut: true,
		matchOnDescription: true,
		matchOnDetail: true
    };
    const pick = await vscode.window.showQuickPick(picks, pickOptions);
    if (pick === undefined) {
      	return false;
    }
    callback(pick);
    return true;
}

// 输入框
export async function inputPalette(question: string, save: (input: string) => void,
	validate?: (input: string) => string): Promise<boolean> {
	const options: vscode.InputBoxOptions = {
		placeHolder: question,
		ignoreFocusOut: true
	};
	if (validate) {
		options.validateInput = validate;
	}
	const input = await vscode.window.showInputBox(options);
	if (input === undefined) {
		return false;
	}
	save(input);
	return true;
}


// git 工作区改动文件添加到暂存区域
async function conditionallyStageFiles(cwd: string, channel: vscode.OutputChannel): Promise<void> {
  if (!(await hasStagedFiles(cwd))) {
    channel.appendLine('Staging all files (enableSmartCommit enabled with nothing staged)');
    await vscode.commands.executeCommand('git.stageAll');
  }
}

// 检查 git 暂存区是否有文件
async function hasStagedFiles(cwd: string): Promise<boolean> {
  const result = await execa('git', ['diff', '--name-only', '--cached'], {cwd});
  return hasOutput(result);
}

function hasOutput(result?: {stdout?: string}): boolean {
  return Boolean(result && result.stdout);
}


// 执行 git commit 指令
export async function execCommit(cwd: string, message: string, channel: vscode.OutputChannel): Promise<void> {
    channel.appendLine(`About to commit '${message}'`);

    function hasOutput(result?: {stdout?: string}): boolean {
      return Boolean(result && result.stdout);  
    }
    try {
		await conditionallyStageFiles(cwd, channel);
		const result = await execa('git', ['commit', '-m', message], {cwd});
		await vscode.commands.executeCommand('git.refresh');
		// if (getConfiguration().autoSync) {
		//   await vscode.commands.executeCommand('git.sync');
		// }
		if (hasOutput(result)) {
			result.stdout.split('\n').forEach(line => channel.appendLine(line));
			channel.show();
		}
		// Display a message box to the user
		vscode.window.showInformationMessage('You have just commit a change!');
    } catch (e) {
		vscode.window.showErrorMessage(e.message);
		channel.appendLine(e.message);
      	channel.appendLine(e.stack);
    }
}