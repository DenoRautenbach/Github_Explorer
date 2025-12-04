<template>
  <div class="home">
    <div class="home-content">
      <h1 class="home-title">GitHub Explorer</h1>
      <p class="home-subtitle">Search for a GitHub user to explore their repositories.</p>
      
      <div class="search-wrapper">
        <div class="search-container">
          <input 
            v-model="username" 
            type="text" 
            placeholder="Enter GitHub username"
            @input="handleInput"
            @keyup.enter="searchUser"
            class="search-input"
          />
          <BaseButton 
            variant="primary" 
            @click="searchUser"
            :disabled="loading"
          >
            {{ loading ? 'Searching...' : 'Search' }}
          </BaseButton>
        </div>

        <!-- Search Suggestions -->
        <div v-if="showSuggestions && searchResults.length > 0" class="suggestions-dropdown">
          <div 
            v-for="user in searchResults" 
            :key="user.id" 
            class="suggestion-item"
            @click="selectUser(user.login)"
          >
            <img :src="user.avatar_url" :alt="user.login" class="user-avatar-small" />
            <span>{{ user.login }}</span>
          </div>
        </div>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Public Users List -->
      <div class="public-users-section" v-if="publicUsers.length > 0">
        <h3 class="section-title">Suggested Users</h3>
        <div class="users-grid">
          <div 
            v-for="user in publicUsers.slice(0, 8)" 
            :key="user.id" 
            class="user-card"
            @click="selectUser(user.login)"
          >
            <img :src="user.avatar_url" :alt="user.login" class="user-avatar" />
            <span class="user-login">{{ user.login }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useGithubStore } from '../stores/github'
import BaseButton from '../components/BaseButton.vue'

const router = useRouter()
const store = useGithubStore()
const { searchResults, publicUsers, loading, error } = storeToRefs(store)
const { searchUsers, fetchPublicUsers } = store

const username = ref('')
const showSuggestions = ref(false)
let debounceTimeout: number | null = null

onMounted(() => {
  fetchPublicUsers()
})

const handleInput = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  
  if (!username.value.trim()) {
    showSuggestions.value = false
    return
  }

  debounceTimeout = setTimeout(() => {
    searchUsers(username.value)
    showSuggestions.value = true
  }, 300)
}

const selectUser = (login: string) => {
  username.value = login
  showSuggestions.value = false
  searchUser()
}

const searchUser = async () => {
  if (!username.value.trim()) {
    return
  }
  
  showSuggestions.value = false
  
  try {
    router.push({ name: 'repos', params: { username: username.value } })
  } catch (err) {
    console.error(err)
  }
}

const closeSuggestions = (e: Event) => {
  const target = e.target as HTMLElement
  if (!target.closest('.search-container')) {
    showSuggestions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeSuggestions)
})
</script>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background-image: url('home.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.home::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(56, 68, 83, 0.85);
  z-index: 1;
}

.home-content {
  max-width: 800px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 2;
}

.home-title {
  font-family: var(--font-heading);
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: var(--color-primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.home-subtitle {
  font-family: var(--font-body);
  font-size: 1.25rem;
  color: var(--color-text-light);
  margin-bottom: 3rem;
  line-height: 1.6;
}

.search-wrapper {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-container {
  display: flex;
  gap: 1rem;
  background: var(--color-bg-light);
  padding: 0.75rem;
  border-radius: var(--border-radius-card);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--box-shadow-card);
  transition: var(--transition-base);
  position: relative;
  z-index: 10;
}

.search-container:focus-within {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  border-color: var(--color-primary);
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  font-family: var(--font-body);
  font-size: 1.1rem;
  border: none;
  background: var(--color-bg-secondary);
  color: var(--color-text-light);
  border-radius: calc(var(--border-radius-card) - 4px);
  outline: none;
  transition: var(--transition-base);
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-input:focus {
  box-shadow: 0 0 0 2px rgba(67, 193, 24, 0.3);
  background: var(--color-bg-main);
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius-card);
  margin-top: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  z-index: 20;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s;
  color: var(--color-text-light);
  border-bottom: 1px solid var(--color-border-dark);
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: var(--color-bg-light);
}

.user-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.error-message {
  margin-top: 1.5rem;
  color: #ff6b6b;
  font-size: 1rem;
  background: rgba(220, 53, 69, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-card);
  border: 1px solid rgba(220, 53, 69, 0.4);
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

.public-users-section {
  margin-top: 4rem;
}

.section-title {
  color: var(--color-text-heading);
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: var(--color-bg-secondary);
  padding: 1.5rem;
  border-radius: var(--border-radius-card);
  border: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: var(--transition-base);
}

.user-card:hover {
  transform: translateY(-5px);
  background: var(--color-bg-light);
  border-color: var(--color-primary);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.user-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
}

.user-login {
  color: var(--color-text-light);
  font-weight: 600;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

@media (max-width: 768px) {
  .home-title {
    font-size: 2.5rem;
  }

  .home-subtitle {
    font-size: 1.125rem;
  }

  .search-container {
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }
  
  .users-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
</style>

