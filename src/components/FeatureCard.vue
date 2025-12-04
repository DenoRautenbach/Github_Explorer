<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon?: string
}>()
</script>

<template>
  <div class="feature-card">
    <!-- Icon slot or default -->
    <div class="feature-card__icon">
      <slot name="icon">
        <div class="feature-card__icon-placeholder">
          {{ icon || '🚀' }}
        </div>
      </slot>
    </div>

    <!-- Card content -->
    <div class="feature-card__content">
      <h3 class="feature-card__title">{{ title }}</h3>
      <p class="feature-card__description">{{ description }}</p>
    </div>

    <!-- Optional footer slot -->
    <div v-if="$slots.footer" class="feature-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.feature-card {
  /* Card styling using TravelIT Global variables */
  background: var(--color-bg-main);
  border-radius: var(--border-radius-card);
  box-shadow: var(--box-shadow-soft);
  padding: 2rem;
  transition: var(--transition-base);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 15px 40px rgba(0, 0, 0, 0.08);
}

/* Icon section */
.feature-card__icon {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-card__icon-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: var(--color-text-light);
  box-shadow: 0 4px 15px rgba(240, 90, 40, 0.3);
}

/* Content section */
.feature-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.feature-card__title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-heading);
  margin-bottom: 1rem;
  line-height: 1.3;
}

.feature-card__description {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-text-body);
  line-height: 1.6;
  margin-bottom: 0;
}

/* Footer section */
.feature-card__footer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border-light);
  width: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .feature-card {
    padding: 1.5rem;
  }

  .feature-card__icon-placeholder {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }

  .feature-card__title {
    font-size: 1.25rem;
  }

  .feature-card__description {
    font-size: 0.9rem;
  }
}
</style>
