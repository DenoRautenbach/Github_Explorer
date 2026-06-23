<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useGithubStore } from '../stores/github';
import { storeToRefs } from 'pinia';
import CommitDetail from '../components/CommitDetail.vue';
import BaseButton from '../components/BaseButton.vue';

const props = defineProps<{
  username: string
}>();

const store = useGithubStore();
const { repos, commits, favorites, loading, error, selectedRepo, currentCommit, hasMore } = storeToRefs(store);
const { fetchRepos, fetchCommits, toggleFavorite, isFavorite, fetchCommitDetail, loadMoreCommits, resetCommits } = store;

const sortOrder = ref<'newest' | 'oldest'>('newest');
const showModal = ref(false);

onMounted(() => {
  resetCommits();
  if (props.username) {
    fetchRepos(props.username);
  }
});

// Watch for prop changes to refetch if username changes
watch(() => props.username, (newUsername) => {
  if (newUsername) {
    resetCommits(); // Clear previous user's commits
    fetchRepos(newUsername);
  }
});

const sortedCommits = computed(() => {
  const sorted = [...commits.value];
  sorted.sort((a, b) => {
    const dateA = new Date(a.commit.author.date).getTime();
    const dateB = new Date(b.commit.author.date).getTime();
    return sortOrder.value === 'newest' ? dateB - dateA : dateA - dateB;
  });
  return sorted;
});

const handleRepoClick = (repoName: string) => {
  fetchCommits(props.username, repoName);
};

const openCommit = async (sha: string) => {
  await fetchCommitDetail(props.username, selectedRepo.value, sha);
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const loadMore = () => {
  loadMoreCommits(props.username);
};
</script>

<template>
  <div class="repo-view">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h3>Repositories</h3>
        <p class="user-label">User: {{ props.username }}</p>
        <BaseButton variant="secondary" @click="$router.push('/')" class="back-btn">Back</BaseButton>
      </div>
      
      <div v-if="loading && !repos.length" class="loading-state">
        <div class="spinner"></div>
        <span>Loading Repos...</span>
      </div>
      <div v-else-if="repos.length === 0 && !loading" class="empty-state">No repositories found.</div>
      
      <ul v-else class="repo-list">
        <li 
          v-for="repo in repos" 
          :key="repo.id" 
          @click="handleRepoClick(repo.name)" 
          :class="{ active: repo.name === selectedRepo }"
          class="repo-item"
        >
          <div class="repo-name">{{ repo.name }}</div>
          <div class="repo-desc" v-if="repo.description">{{ repo.description }}</div>
        </li>
      </ul>
    </aside>

    <main class="main-content">
      <div v-if="error" class="error-banner">
        <div class="error-message">{{ error }}</div>
        <div v-if="error.includes('rate limit')" class="error-hint">
          💡 Tip: GitHub allows 60 requests per hour for unauthenticated users. 
          <a href="https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting" target="_blank" rel="noopener">Learn more</a>
        </div>
      </div>
      
      <section class="favorites-section" v-if="favorites.length">
        <div class="section-header">
          <h3>Favorites</h3>
        </div>
        <ul class="favorites-list">
          <li v-for="fav in favorites" :key="fav.sha" class="favorite-item" @click="openCommit(fav.sha)">
             <span class="fav-msg">{{ fav.commit.message }}</span>
             <button @click.stop="toggleFavorite(fav)" class="unfav-btn" title="Remove from favorites">
               <span class="icon">×</span>
             </button>
          </li>
        </ul>
      </section>

      <div class="commits-section">
        <div class="commits-header">
          <h2>Commits <span v-if="selectedRepo" class="repo-badge">{{ selectedRepo }}</span></h2>
          <div class="controls" v-if="selectedRepo">
            <label>Sort by:</label>
            <div class="select-wrapper">
              <select v-model="sortOrder">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="loading && commits.length === 0" class="loading-state">
          <div class="spinner"></div>
          <span>Loading Commits...</span>
        </div>
        
        <div v-else-if="commits.length" class="commits-list">
          <div v-for="commit in sortedCommits" :key="commit.sha" class="commit-item" @click="openCommit(commit.sha)">
            <div class="commit-info">
              <p class="message">{{ commit.commit.message }}</p>
              <div class="meta">
                <span class="click">Click for more details</span>
                <div class="meta-flex">
                  <span class="author">👤 {{ commit.commit.author.name }}</span>
                  <span class="date">📅 {{ new Date(commit.commit.author.date).toLocaleDateString() }}</span>
                </div>
              </div>
            </div>
            <button @click.stop="toggleFavorite(commit)" class="fav-btn" :class="{ active: isFavorite(commit.sha) }">
              {{ isFavorite(commit.sha) ? '★' : '☆' }}
            </button>
          </div>
          
          <div class="load-more-container" v-if="hasMore">
            <BaseButton variant="primary" @click="loadMore" :disabled="loading">
              {{ loading ? 'Loading...' : 'Load More Commits' }}
            </BaseButton>
          </div>
        </div>
        <div v-else-if="selectedRepo && !loading" class="empty-state">No commits found.</div>
        <div v-else-if="!selectedRepo" class="empty-state select-prompt">
          <div class="prompt-icon">👈</div>
          <p>Select a repository from the sidebar to view its commits.</p>
        </div>
      </div>
    </main>
    
    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
          <div class="modal-content" @click.stop>
              <div class="modal-header">
                  <h3>Commit Details</h3>
                  <button @click="closeModal" class="close-btn">×</button>
              </div>
              <div v-if="loading && !currentCommit" class="loading-state">
                <div class="spinner"></div>
                <span>Loading Details...</span>
              </div>
              <CommitDetail v-else-if="currentCommit" :commit="currentCommit" />
          </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.repo-view { 
  display: flex; 
  height: 100vh; 
  overflow: hidden; 
  background: var(--color-bg-main);
  font-family: var(--font-body);
  color: var(--color-text-body);
}

.sidebar { 
  width: 350px; 
  border-right: 1px solid var(--color-border-dark); 
  display: flex; 
  flex-direction: column; 
  background: var(--color-bg-secondary); 
  box-shadow: 4px 0 24px rgba(0,0,0,0.2);
  z-index: 10;
}

.sidebar-header { 
  padding: 1.5rem; 
  border-bottom: 1px solid var(--color-border-dark); 
  background: var(--color-bg-light);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-text-heading);
}

.user-label {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.repo-list { 
  list-style: none; 
  padding: 0; 
  margin: 0; 
  overflow-y: auto; 
  flex: 1; 
}

.repo-item { 
  padding: 1rem 1.5rem; 
  cursor: pointer; 
  border-bottom: 1px solid var(--color-border-dark); 
  transition: var(--transition-base);
  color: var(--color-text-body);
}

.repo-item:hover { 
  background-color: var(--color-bg-light); 
  padding-left: 1.75rem;
  color: var(--color-text-light);
}

.repo-item.active { 
  background: var(--color-bg-light); 
  color: var(--color-text-heading); 
  border-left: 4px solid var(--color-secondary);
}

.repo-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.repo-desc {
  font-size: 0.85rem;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.main-content { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  overflow: hidden; 
  background: var(--color-bg-main);
}

.error-banner { 
  background: rgba(220, 53, 69, 0.1); 
  color: #ff6b6b; 
  padding: 1rem 1.5rem; 
  border-bottom: 1px solid rgba(220, 53, 69, 0.2); 
  animation: slideDown 0.3s ease;
}

.error-message {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.error-hint {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-top: 0.5rem;
}

.error-hint a {
  color: #ff6b6b;
  text-decoration: underline;
  font-weight: 600;
}

.error-hint a:hover {
  color: #ff8787;
}

.favorites-section { 
  padding: 1rem 1.5rem; 
  background: rgba(219, 97, 162, 0.08); 
  border-bottom: 1px solid var(--color-border-dark); 
  max-height: 150px; 
  overflow-y: auto;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.favorites-section h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: var(--color-accent);
}

.favorites-list { 
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none; 
  padding: 0; 
  margin: 0; 
}

.favorite-item { 
  display: flex; 
  align-items: center; 
  padding: 0.25rem 0.75rem; 
  background: var(--color-bg-light);
  border-radius: 20px;
  border: 1px solid var(--color-border-light);
  cursor: pointer; 
  font-size: 0.85rem;
  transition: var(--transition-base);
  color: var(--color-text-light);
}

.favorite-item:hover { 
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  border-color: var(--color-primary);
}

.fav-msg {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 0.5rem;
}

.unfav-btn { 
  background: none; 
  border: none; 
  cursor: pointer; 
  color: #ff6b6b; 
  font-weight: bold; 
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.unfav-btn:hover {
  background: rgba(255, 107, 107, 0.1);
}

.commits-section { 
  flex: 1; 
  display: flex; 
  flex-direction: column; 
  overflow: hidden; 
}

.commits-header { 
  padding: 1.5rem; 
  border-bottom: 1px solid var(--color-border-dark); 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  background: var(--color-bg-secondary); 
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.commits-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-text-heading);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.repo-badge {
  background: var(--color-bg-light);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 1rem;
  color: var(--color-text-light);
  font-weight: normal;
  border: 1px solid var(--color-border-light);
}

.select-wrapper {
  position: relative;
}

.select-wrapper select {
  padding: 0.5rem 2rem 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--color-border-light);
  appearance: none;
  background: var(--color-bg-light) url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 0.7rem center;
  background-size: 0.65em auto;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.commits-list { 
  overflow-y: auto; 
  flex: 1; 
  padding: 1.5rem; 
}

.commit-item { 
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-dark); 
  border-radius: 8px; 
  padding: 1.25rem; 
  margin-bottom: 1rem; 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  cursor: pointer; 
  transition: var(--transition-base);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.commit-item:hover { 
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  border-color: var(--color-primary);
}

.message { 
  font-weight: 600; 
  margin: 0 0 0.75rem 0; 
  color: var(--color-text-heading); 
  font-size: 1.1rem;
}

.meta { 
  font-size: 0.9rem; 
  color: var(--color-text-muted); 
  margin: 0; 
  display: flex;
  gap: 1rem;
  align-items: center;
}

.meta-flex {
  display: flex;
  gap: 1rem;
  margin-left: auto;
}

.fav-btn { 
  background: none; 
  border: 1px solid var(--color-border-light); 
  border-radius: 6px; 
  cursor: pointer; 
  padding: 0.5rem; 
  font-size: 1.2rem; 
  line-height: 1; 
  transition: var(--transition-base);
  color: var(--color-text-muted);
}

.fav-btn:hover {
  background: var(--color-bg-light);
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.fav-btn.active { 
  color: var(--color-accent); 
  border-color: var(--color-accent); 
  background: rgba(219, 97, 162, 0.1); 
}

.modal-overlay { 
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%; 
  background: rgba(0,0,0,0.8); 
  backdrop-filter: blur(4px);
  display: flex; 
  justify-content: center; 
  align-items: center; 
  z-index: 1000; 
}

.modal-content { 
  background: var(--color-bg-secondary); 
  border-radius: 12px; 
  width: 90%; 
  max-width: 800px; 
  max-height: 90vh; 
  display: flex; 
  flex-direction: column; 
  box-shadow: 0 20px 60px rgba(0,0,0,0.4); 
  animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid var(--color-border-light);
}

.modal-header { 
  padding: 1.5rem; 
  border-bottom: 1px solid var(--color-border-dark); 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-text-heading);
}

.close-btn { 
  background: none; 
  border: none; 
  font-size: 1.5rem; 
  cursor: pointer; 
  color: var(--color-text-muted);
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--color-text-light);
}

.loading-state, .empty-state { 
  padding: 3rem; 
  text-align: center; 
  color: var(--color-text-muted); 
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--color-border-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.select-prompt {
  justify-content: center;
  height: 100%;
}

.prompt-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: bounce 2s infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }
@keyframes modalPop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateX(0); } 40% { transform: translateX(-10px); } 60% { transform: translateX(-5px); } }

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.load-more-container {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}
</style>
