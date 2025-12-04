export interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
}

export interface CommitAuthor {
    name: string;
    date: string;
}

export interface CommitInfo {
    message: string;
    author: CommitAuthor;
}

export interface Commit {
    sha: string;
    commit: CommitInfo;
    html_url?: string;
}

export interface CommitFile {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
}

export interface CommitStats {
    total: number;
    additions: number;
    deletions: number;
}

export interface CommitDetail extends Commit {
    stats: CommitStats;
    files: CommitFile[];
}

export interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
}
