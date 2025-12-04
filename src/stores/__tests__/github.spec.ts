import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGithubStore } from '../github'

describe('Github Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        localStorage.clear()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('toggles favorite correctly', () => {
        const store = useGithubStore()
        const commit = {
            sha: '123',
            commit: {
                message: 'test commit',
                author: {
                    name: 'test',
                    date: '2023-01-01'
                }
            }
        }

        store.toggleFavorite(commit)
        expect(store.favorites).toHaveLength(1)
        expect(store.favorites[0]?.sha).toBe('123')
        expect(store.isFavorite('123')).toBe(true)

        store.toggleFavorite(commit)
        expect(store.favorites).toHaveLength(0)
        expect(store.isFavorite('123')).toBe(false)
    })

    it('persists favorites to localStorage', () => {
        const store = useGithubStore()
        const commit = {
            sha: '456',
            commit: {
                message: 'persist commit',
                author: {
                    name: 'test',
                    date: '2023-01-01'
                }
            }
        }

        store.toggleFavorite(commit)

        const stored = localStorage.getItem('github-favorites')
        expect(stored).toBeTruthy()
        expect(JSON.parse(stored!)).toHaveLength(1)
        expect(JSON.parse(stored!)[0]?.sha).toBe('456')
    })

    it('fetches commits and loads more correctly', async () => {
        const store = useGithubStore()

        // Mock fetch
        globalThis.fetch = vi.fn().mockImplementation((urlStr: string) => {
            const url = new URL(urlStr)
            const page = url.searchParams.get('page') || '1'

            if (page === '1') {
                const commits = Array.from({ length: 10 }, (_, i) => ({
                    sha: `page1-commit-${i}`,
                    commit: {
                        message: `Commit ${i} from page 1`,
                        author: { name: 'Test User', date: '2023-01-01' }
                    }
                }))
                console.log(`Returning ${commits.length} commits for page 1`)
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(commits)
                } as Response)
            }

            if (page === '2') {
                const commits = Array.from({ length: 5 }, (_, i) => ({
                    sha: `page2-commit-${i}`,
                    commit: {
                        message: `Commit ${i} from page 2`,
                        author: { name: 'Test User', date: '2023-01-01' }
                    }
                }))
                console.log(`Returning ${commits.length} commits for page 2`)
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(commits)
                } as Response)
            }

            return Promise.resolve({
                ok: false,
                status: 404
            } as Response)
        })

        // Fetch first page
        await store.fetchCommits('user', 'repo')
        console.log(`After first fetch: commits.length = ${store.commits.length}, page = ${store.page}, hasMore = ${store.hasMore}`)
        expect(store.commits).toHaveLength(10)
        expect(store.page).toBe(1)
        expect(store.hasMore).toBe(true)

        // Load more
        await store.loadMoreCommits('user', 'repo')
        console.log(`After loadMore: commits.length = ${store.commits.length}, page = ${store.page}, hasMore = ${store.hasMore}`)
        expect(store.commits).toHaveLength(15)
        expect(store.page).toBe(2)
        expect(store.hasMore).toBe(false)
    })
})