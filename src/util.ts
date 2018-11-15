
import * as vscode from 'vscode';
import * as execa from 'execa';

// 多选一
export async function askOneOf(question: string, picks: vscode.QuickPickItem[],
    save: (pick: vscode.QuickPickItem) => void, customLabel?: string, customQuestion?: string): Promise<boolean> {
    const pickOptions: vscode.QuickPickOptions = {
      placeHolder: question,
      ignoreFocusOut: true,
      matchOnDescription: true,
      matchOnDetail: true
    };
    const pick = await vscode.window.showQuickPick(picks, pickOptions);
    if (pick && pick.label === customLabel && !!customQuestion) {
      const next = await ask(customQuestion || '', input => {
        save({label: input, description: ''});
        return true;
      });
      return next;
    }
    if (pick === undefined) {
      return false;
    }
    save(pick);
    return true;
}

async function ask(question: string, save: (input: string) => void,
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


// 执行 git commit 指令
export async function execCommit(cwd: string, message: string, channel: vscode.OutputChannel): Promise<void> {
    channel.appendLine(`About to commit '${message}'`);

    function hasOutput(result?: {stdout?: string}): boolean {
      return Boolean(result && result.stdout);
    }

    // function shouldShowOutput(result: {code: number}): boolean {
    //   return getConfiguration().showOutputChannel === 'always'
    //     || getConfiguration().showOutputChannel === 'onError' && result.code > 0;
    // }

    try {
    //   await conditionallyStageFiles(cwd);
      const result = await execa('git', ['commit', '-m', message], {cwd});
      await vscode.commands.executeCommand('git.refresh');
      // if (getConfiguration().autoSync) {
      //   await vscode.commands.executeCommand('git.sync');
      // }
      if (hasOutput(result)) {
        result.stdout.split('\n').forEach(line => channel.appendLine(line));
        // if (shouldShowOutput(result)) {
          channel.show();
        // }
      }
    } catch (e) {
      vscode.window.showErrorMessage(e.message);
      channel.appendLine(e.message);
      channel.appendLine(e.stack);
    }
}