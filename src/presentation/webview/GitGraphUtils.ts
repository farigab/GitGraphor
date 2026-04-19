import type { BranchSummary, RepoRemote } from '../../core/models';

export function resolvePreferredRemoteForPullRequest(sourceBranch: string, branches: BranchSummary[], remotes: RepoRemote[]): RepoRemote | undefined {
  if (remotes.length === 0) {
    return undefined;
  }

  const source = branches.find((branch) => !branch.remote && branch.shortName === sourceBranch);
  const upstreamRemoteName = source?.upstream?.split('/')[0];
  if (upstreamRemoteName) {
    const upstreamRemote = remotes.find((remote) => remote.name === upstreamRemoteName);
    if (upstreamRemote) {
      return upstreamRemote;
    }
  }

  const origin = remotes.find((remote) => remote.name === 'origin');
  return origin ?? remotes[0];
}

export function buildPrUrl(remoteUrl: string, source: string, target: string, title: string, description: string): string | null {
  const normalized = remoteUrl
    .replace(/^git@github\.com:/, 'https://github.com/')
    .replace(/^git@gitlab\.com:/, 'https://gitlab.com/')
    .replace(/^git@bitbucket\.org:/, 'https://bitbucket.org/')
    .replace(/\.git$/, '');

  const enc = encodeURIComponent;
  const encodedTitle = title ? `&title=${enc(title)}` : '';
  const encodedDescription = description ? `&body=${enc(description)}` : '';

  if (/github\.com/.test(normalized)) {
    const base = `${normalized}/compare/${enc(target)}...${enc(source)}`;
    const params = `?quick_pull=1${encodedTitle}${encodedDescription}`;
    return base + params;
  }

  if (/gitlab\.com/.test(normalized)) {
    return `${normalized}/-/merge_requests/new?merge_request[source_branch]=${enc(source)}&merge_request[target_branch]=${enc(target)}${title ? `&merge_request[title]=${enc(title)}` : ''}${description ? `&merge_request[description]=${enc(description)}` : ''}`;
  }

  if (/bitbucket\.org/.test(normalized)) {
    return `${normalized}/pull-requests/new?source=${enc(source)}&dest=${enc(target)}${title ? `&title=${enc(title)}` : ''}${description ? `&description=${enc(description)}` : ''}`;
  }

  return null;
}
