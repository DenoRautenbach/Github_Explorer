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
  /* Base button styling using TravelIT Global variables */
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 1rem;
  padding: 0.875rem 2rem;
  border-radius: var(--border-radius-button);
  border: 2px solid transparent;
  cursor: pointer;
  transition: var(--transition-base);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Primary Button - Orange Gradient */
.base-button--primary {
  background: var(--color-primary-gradient);
  color: var(--color-text-light);
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(240, 90, 40, 0.3);
}

.base-button--primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(240, 90, 40, 0.4);
  filter: brightness(1.05);
}

.base-button--primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(240, 90, 40, 0.3);
}

/* Secondary Button - Outlined */
.base-button--secondary {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
  box-shadow: none;
}

.base-button--secondary:hover:not(:disabled) {
  background: var(--color-primary-gradient);
  color: var(--color-text-light);
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(240, 90, 40, 0.2);
}

.base-button--secondary:active:not(:disabled) {
  transform: translateY(0);
}

/* Ripple effect on click */
.base-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.base-button:active::before {
  width: 300px;
  height: 300px;
}
</style>
