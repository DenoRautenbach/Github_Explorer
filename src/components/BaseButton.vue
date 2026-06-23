<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>()

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button 
    :class="['base-button', `base-button--${variant || 'primary'}`]"
    :type="type || 'button'"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  /* Base button styling using GitHub variables */
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-button);
  border: 1px solid transparent;
  cursor: pointer;
  transition: var(--transition-base);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  white-space: nowrap;
  position: relative;
  line-height: 1.25rem;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Primary Button - GitHub Green */
.base-button--primary {
  background-color: var(--color-primary);
  color: #ffffff;
  border: 1px solid rgba(240, 246, 252, 0.1);
  box-shadow: 0 1px 0 rgba(27, 31, 35, 0.1);
}

.base-button--primary:hover:not(:disabled) {
  background-color: #2c974b;
}

.base-button--primary:active:not(:disabled) {
  background-color: #298e46;
}

/* Secondary Button - GitHub Dark Gray */
.base-button--secondary {
  background-color: var(--color-bg-light);
  color: var(--color-text-body);
  border: 1px solid var(--color-border-light);
  box-shadow: 0 1px 0 rgba(27, 31, 35, 0.04);
}

.base-button--secondary:hover:not(:disabled) {
  background-color: #30363d;
  border-color: #8b949e;
  color: var(--color-text-heading);
}

.base-button--secondary:active:not(:disabled) {
  background-color: #282e38;
}
</style>
