import * as vscode from 'vscode';

const GIT_WATCH_PATTERNS = [
  '**/.git/HEAD',
  '**/.git/index',
  '**/.git/refs/**',
  '**/.git/worktrees/**',
  '**/.git/COMMIT_EDITMSG',
  '**/.git/MERGE_HEAD',
  '**/.git/CHERRY_PICK_HEAD',
  '**/.git/REVERT_HEAD',
  '**/.git/BISECT_LOG',
  '**/.git/rebase-merge/**',
  '**/.git/rebase-apply/**',
] as const;

export function registerGitWatchers(
  onChanged: () => void,
  subscriptions: vscode.ExtensionContext['subscriptions']
): void {
  for (const pattern of GIT_WATCH_PATTERNS) {
    const watcher = vscode.workspace.createFileSystemWatcher(pattern);
    watcher.onDidChange(onChanged, undefined, subscriptions);
    watcher.onDidCreate(onChanged, undefined, subscriptions);
    watcher.onDidDelete(onChanged, undefined, subscriptions);
    subscriptions.push(watcher);
  }
}
