<script setup lang="ts">
import type { CommitDetail } from '../types';

defineProps<{
  commit: CommitDetail
}>();
</script>

<template>
  <div class="commit-detail">
    <h2>{{ commit.commit.message }}</h2>
    <div class="meta">
      <div class="meta-item">
        <span class="label">Author:</span>
        <span class="value">{{ commit.commit.author.name }}</span>
      </div>
      <div class="meta-item">
        <span class="label">Date:</span>
        <span class="value">{{ new Date(commit.commit.author.date).toLocaleString() }}</span>
      </div>
    </div>
    
    <div class="stats-card">
      <div class="stat-item">
        <span class="stat-value">{{ commit.stats.total }}</span>
        <span class="stat-label">Total Changes</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item additions">
        <span class="stat-value">+{{ commit.stats.additions }}</span>
        <span class="stat-label">Additions</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item deletions">
        <span class="stat-value">-{{ commit.stats.deletions }}</span>
        <span class="stat-label">Deletions</span>
      </div>
    </div>

    <h3>Changed Files ({{ commit.files.length }})</h3>
    <div class="files-container">
      <ul class="files-list">
        <li v-for="file in commit.files" :key="file.filename" class="file-item">
          <div class="file-info">
            <span class="status-badge" :class="file.status">{{ file.status }}</span>
            <span class="filename">{{ file.filename }}</span>
          </div>
          <div class="file-stats">
            <span class="add" v-if="file.additions > 0">+{{ file.additions }}</span>
            <span class="del" v-if="file.deletions > 0">-{{ file.deletions }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.commit-detail {
  padding: 1.5rem;
  overflow-y: auto;
  font-family: var(--font-body);
  color: var(--color-text-body);
}

h2 {
  margin-top: 0;
  color: var(--color-text-heading);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  color: var(--color-text-muted);
  background: var(--color-bg-light);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-muted);
}

.value {
  font-weight: 600;
  color: var(--color-text-light);
}

.stats-card {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1;
  color: var(--color-text-heading);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--color-border-light);
}

.additions .stat-value { color: #43c118; }
.deletions .stat-value { color: #ff6b6b; }

.files-container {
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  overflow: hidden;
}

.files-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border-dark);
  background: var(--color-bg-secondary);
  transition: background 0.2s;
}

.file-item:last-child {
  border-bottom: none;
}

.file-item:hover {
  background: var(--color-bg-light);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.filename {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.status-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.added { background: rgba(67, 193, 24, 0.2); color: #43c118; }
.status-badge.modified { background: rgba(253, 130, 0, 0.2); color: #fd8200; }
.status-badge.removed { background: rgba(255, 107, 107, 0.2); color: #ff6b6b; }
.status-badge.renamed { background: rgba(0, 173, 239, 0.2); color: #00adef; }

.file-stats {
  display: flex;
  gap: 0.75rem;
  font-family: monospace;
  font-weight: 600;
}

.add { color: #43c118; }
.del { color: #ff6b6b; }
</style>
