<template>
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-col">
        <h3>Aurel Accesorios</h3>
        <p>Accesorios de calidad fina hecha con amor. Piezas únicas para cada ocasión.</p>
      </div>

      <div class="footer-col">
        <h3>Navegación</h3>
        <router-link to="/">Inicio</router-link>
        <router-link to="/catalogo">Catálogo</router-link>
        <router-link to="/carrito">Carrito</router-link>
        <router-link to="/nosotros">Nosotros</router-link>
        <router-link to="/contacto">Contacto</router-link>
      </div>

      <div class="footer-col">
        <h3>Contacto</h3>
        <p>WhatsApp: {{ whatsappNumber }}</p>
        <p>Email: aurel.accesorios@gmail.com</p>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Aurel Accesorios. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '+59169577432'
</script>

<style scoped>
.footer {
  background: var(--primary-olive);
  color: rgba(255,255,255,0.9);
  margin-top: auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  padding: 48px 20px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-col h3 {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.footer-col a {
  color: rgba(255,255,255,0.75);
  transition: color 0.3s;
}

.footer-col a:hover {
  color: white;
}

.footer-col p {
  font-size: 0.9rem;
  line-height: 1.5;
}

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.15);
  padding: 16px 20px;
  text-align: center;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 32px 20px;
  }
}
</style>
