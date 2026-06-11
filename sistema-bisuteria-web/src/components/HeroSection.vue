<template>
  <section class="hero">
    <div class="container hero-content">
      <div class="hero-text">
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
        <div class="hero-actions">
          <router-link to="/catalogo" class="btn btn-primary">
            Ver Catálogo
          </router-link>
          <router-link to="/contacto" class="btn btn-outline btn-outline-white">
            Contáctanos
          </router-link>
        </div>
      </div>
      <div class="hero-image">
        <img src="/logo_aurel.png" alt="Aurel Accesorios" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #2d4210 0%, #5a7a1e 40%, #7e9d3a 100%);
  color: white;
  padding: 80px 20px;
  min-height: 400px;
  display: flex;
  align-items: center;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-text h1 {
  font-size: 2.8rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.5px;
}

.hero-text p {
  font-size: 1.15rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-outline-white {
  border: 2px solid white;
  color: white;
}

.btn-outline-white:hover {
  background: white;
  color: var(--primary-olive);
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image img {
  max-width: 280px;
  border-radius: 50%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

@media (max-width: 768px) {
  .hero {
    padding: 48px 20px;
    min-height: auto;
  }

  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 32px;
  }

  .hero-text h1 {
    font-size: 1.8rem;
  }

  .hero-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .hero-image img {
    max-width: 180px;
  }
}
</style>
