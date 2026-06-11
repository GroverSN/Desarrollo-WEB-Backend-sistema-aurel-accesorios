<template>
  <div>
    <section class="hero-about">
      <div class="hero-overlay" />
      <div class="container hero-content">
        <span class="hero-badge">Nuestra Historia</span>
        <h1>Vendiendo accesorios con<br>pasión y dedicación</h1>
        <p class="hero-sub">
          Cada pieza cuenta una historia. Desde la selección de materiales hasta el último detalle,
          ponemos amor en todo lo que hacemos.
        </p>
      </div>
    </section>

    <section class="container section">
      <div class="story-card">
        <div class="story-icon">
          <Heart :size="28" />
        </div>
        <div class="story-text">
          <h2>Nuestra Historia</h2>
          <p>
            Aurel Accesorios nace del amor por la bisutería y los detalles que hacen
            especial a cada persona. Somos <strong>Grover y Luz</strong>, una pareja que decidió
            convertir su pasión en un emprendimiento. Cada pieza es cuidadosamente  y 
            seleccionados para ofrecerte accesorios únicos que reflejen y resalten
            tu estilo personal.
          </p>
        </div>
      </div>
    </section>

    <section class="container section">
      <div class="mv-grid">
        <div class="mv-card">
          <div class="mv-icon">
            <Target :size="24" />
          </div>
          <h3>Misión</h3>
          <p>
            Ofrecer accesorios de bisutería de alta calidad que combinen diseño, durabilidad y
            precio accesible, permitiendo a cada persona encontrar esa pieza especial que
            complete su look.
          </p>
        </div>
        <div class="mv-card">
          <div class="mv-icon">
            <Eye :size="24" />
          </div>
          <h3>Visión</h3>
          <p>
            Ser la marca de bisutería de referencia en la región, reconocida por
            nuestra calidad, diseño y compromiso con la satisfacción de nuestros
            clientes.
          </p>
        </div>
      </div>
    </section>

    <section class="values-section">
      <div class="container">
        <h2 class="section-title" style="text-align:center;color:white;margin-bottom:48px">
          ¿Por qué elegirnos?
        </h2>
        <div class="values-grid">
          <div v-for="v in valores" :key="v.titulo" class="value-card">
            <div class="value-icon">
              <component :is="v.icon" :size="28" />
            </div>
            <h4>{{ v.titulo }}</h4>
            <p>{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container cta-section">
      <div class="cta-card">
        <h2>¿Listo para encontrar tu accesorio perfecto?</h2>
        <p>Explorá nuestro catálogo y descubrí piezas únicas diseñadas para vos.</p>
        <router-link to="/catalogo" class="btn btn-primary cta-btn">
          Ver Catálogo
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Heart, Target, Eye, Gem, ShieldCheck, Sparkles, MessageCircle } from 'lucide-vue-next'

const valores = [
  {
    icon: Gem,
    titulo: 'Calidad Variada',
    desc: 'Cada pieza es seleccionada con dedicación y atención al detalle, garantizando un acabado único.',
  },
  {
    icon: ShieldCheck,
    titulo: 'Materiales Premium',
    desc: 'Trabajamos con productos seleccionados para asegurar durabilidad impecable.',
  },
  {
    icon: Sparkles,
    titulo: 'Diseños Exclusivos',
    desc: 'Encontrarás piezas que no verás en ningún otro lado. Originalidad en cada accesorio.',
  },
  {
    icon: MessageCircle,
    titulo: 'Atención Personalizada',
    desc: 'Te asesoramos para encontrar el accesorio perfecto para cada ocasión.',
  },
]
</script>

<style scoped>
.hero-about {
  position: relative;
  background: linear-gradient(135deg, #2d4210 0%, #5a7a1e 40%, #7e9d3a 100%);
  padding: 80px 20px;
  text-align: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 60%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-block;
  background: rgba(255,255,255,0.15);
  color: white;
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.hero-content h1 {
  font-size: 2.6rem;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}

.hero-sub {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.85);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.section {
  padding: 44px 20px;
}

.story-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 24px;
  background: var(--surface);
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  max-width: 900px;
  margin: 0 auto;
}

.story-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--primary-olive), #5a7a1e);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.story-text h2 {
  color: var(--primary-olive);
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.story-text p {
  color: #555;
  line-height: 1.8;
  font-size: 1.05rem;
}

.story-text strong {
  color: var(--text-main);
}

.mv-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.mv-card {
  background: var(--surface);
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  text-align: center;
  transition: transform 0.3s;
}

.mv-card:hover {
  transform: translateY(-4px);
}

.mv-icon {
  width: 48px;
  height: 48px;
  background: var(--bg-cream);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-olive);
  margin: 0 auto 16px;
}

.mv-card h3 {
  color: var(--primary-olive);
  font-size: 1.2rem;
  margin-bottom: 12px;
}

.mv-card p {
  color: #555;
  line-height: 1.7;
  font-size: 0.95rem;
}

.values-section {
  background: linear-gradient(135deg, #2d4210 0%, #445a14 100%);
  padding: 64px 20px;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.value-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 16px;
  padding: 28px 20px;
  text-align: center;
  transition: transform 0.3s, background 0.3s;
}

.value-card:hover {
  transform: translateY(-6px);
  background: rgba(255,255,255,0.15);
}

.value-icon {
  width: 52px;
  height: 52px;
  background: rgba(255,255,255,0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 16px;
}

.value-card h4 {
  color: white;
  font-size: 1rem;
  margin-bottom: 8px;
}

.value-card p {
  color: rgba(255,255,255,0.75);
  font-size: 0.88rem;
  line-height: 1.6;
}

.cta-section {
  padding: 64px 20px 80px;
}

.cta-card {
  background: linear-gradient(135deg, var(--bg-cream), #f0ecc0);
  border: 2px solid var(--soft-moss);
  border-radius: 20px;
  padding: 48px 32px;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.cta-card h2 {
  color: var(--primary-olive);
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.cta-card p {
  color: #666;
  margin-bottom: 24px;
  font-size: 1.05rem;
}

.cta-btn {
  font-size: 1.05rem;
  padding: 14px 32px;
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 1.8rem;
  }

  .story-card {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 28px 20px;
  }

  .story-icon {
    margin: 0 auto;
  }

  .mv-grid {
    grid-template-columns: 1fr;
  }

  .values-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .values-grid {
    grid-template-columns: 1fr;
  }
}
</style>
