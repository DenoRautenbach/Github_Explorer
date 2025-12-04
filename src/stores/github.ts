import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { GitHubRepo, Commit, CommitDetail, GitHubUser } from '../types';

export const useGithubStore = defineStore('github', () => {
    const repos = ref<GitHubRepo[]>([]);
    const commits = ref<Commit[]>([]);
    const favorites = ref<Commit[]>([]);
    const selectedRepo = ref<string>('');
    const loading = ref<boolean>(false);
    const error = ref<string | null>(null);
    const currentCommit = ref<CommitDetail | null>(null);
    const page = ref<number>(1);
    const hasMore = ref<boolean>(true);
    const searchResults = ref<GitHubUser[]>([]);
    const publicUsers = ref<GitHubUser[]>([]);

    // GitHub API authentication
    const getAuthHeaders = () => {
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        const headers: HeadersInit = {
            'Accept': 'application/vnd.github.v3+json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    };

    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem('github-favorites');
    if (storedFavorites) {
        try {
            favorites.value = JSON.parse(storedFavorites);
        } catch (e) {
            console.error('Failed to parse favorites', e);
        }
    }

    const fetchRepos = async (username: string) => {
        loading.value = true;
        error.value = null;
        repos.value = [];
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                if (response.status === 404) throw new Error(`User '${username}' not found`);
                if (response.status === 403) throw new Error('GitHub API rate limit exceeded. Please try again later.');
                throw new Error('Failed to fetch repositories');
            }
            repos.value = await response.json();
        } catch (e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    const fetchCommits = async (username: string, repo: string, pageNum: number = 1) => {
        loading.value = true;
        error.value = null;
        if (pageNum === 1) {
            commits.value = [];
            page.value = 1;
            hasMore.value = true;
        }
        selectedRepo.value = repo;

        try {
            const response = await fetch(`https://api.github.com/repos/${username}/${repo}/commits?page=${pageNum}&per_page=10`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                if (response.status === 404) throw new Error(`Repository '${repo}' not found`);
                if (response.status === 403) throw new Error('GitHub API rate limit exceeded. Please try again later.');
                throw new Error('Failed to fetch commits');
            }
            const newCommits = await response.json();

            if (newCommits.length < 10) {
                hasMore.value = false;
            }

            if (pageNum === 1) {
                commits.value = newCommits;
            } else {
                commits.value.push(...newCommits);
            }
        } catch (e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    const loadMoreCommits = async (username: string, repo?: string) => {
        if (!hasMore.value || loading.value) return;
        page.value++;
        const repoName = repo || selectedRepo.value;
        await fetchCommits(username, repoName, page.value);
    };

    const fetchCommitDetail = async (username: string, repo: string, sha: string) => {
        loading.value = true;
        error.value = null;
        currentCommit.value = null;
        try {
            const response = await fetch(`https://api.github.com/repos/${username}/${repo}/commits/${sha}`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                if (response.status === 404) throw new Error('Commit not found');
                if (response.status === 403) throw new Error('GitHub API rate limit exceeded. Please try again later.');
                throw new Error('Failed to fetch commit details');
            }
            currentCommit.value = await response.json();
        } catch (e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    const searchUsers = async (query: string) => {
        loading.value = true;
        error.value = null;
        searchResults.value = [];
        try {
            const response = await fetch(`https://api.github.com/search/users?q=${query}`, {
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                if (response.status === 403) throw new Error('GitHub API rate limit exceeded. Please try again later.');
                throw new Error('Failed to search users');
            }
            const data = await response.json();
            searchResults.value = data.items;
        } catch (e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    const fetchPublicUsers = async () => {
        loading.value = true;
        error.value = null;
        publicUsers.value = [];
        try {
            const response = await fetch('https://api.github.com/users', {
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                if (response.status === 403) throw new Error('GitHub API rate limit exceeded. Please try again later.');
                throw new Error('Failed to fetch public users');
            }
            publicUsers.value = await response.json();
        } catch (e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    };

    const resetCommits = () => {
        commits.value = [];
        selectedRepo.value = '';
        page.value = 1;
        hasMore.value = true;
        error.value = null;
    };

    const toggleFavorite = (commit: Commit) => {
        const index = favorites.value.findIndex(c => c.sha === commit.sha);
        if (index === -1) {
            favorites.value.push(commit);
        } else {
            favorites.value.splice(index, 1);
        }
        localStorage.setItem('github-favorites', JSON.stringify(favorites.value));
    };

    const isFavorite = (sha: string) => {
        return favorites.value.some(c => c.sha === sha);
    };

    return {
        repos,
        commits,
        favorites,
        selectedRepo,
        loading,
        error,
        currentCommit,
        page,
        hasMore,
        fetchRepos,
        fetchCommits,
        loadMoreCommits,
        fetchCommitDetail,
        toggleFavorite,
        isFavorite,
        resetCommits,
        searchUsers,
        fetchPublicUsers,
        searchResults,
        publicUsers
    };
});
