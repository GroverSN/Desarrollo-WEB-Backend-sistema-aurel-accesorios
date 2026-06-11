<template>
  <div class="container page">
    <h1 class="page-title">Contacto</h1>
    <p class="section-subtitle" style="text-align: center;">
      Déjanos tu consulta y te responderemos a la brevedad
    </p>

    <form v-if="!enviado" class="contact-form" @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="nombre">Nombre *</label>
        <input
          id="nombre"
          v-model="form.nombre"
          type="text"
          required
          placeholder="Tu nombre"
        />
      </div>

      <div class="form-group">
        <label for="telefono">Teléfono *</label>
        <input
          id="telefono"
          v-model="form.telefono"
          type="tel"
          required
          placeholder="Ej: 12345678"
        />
      </div>

      <div class="form-group">
        <label for="productos">Productos de interés</label>
        <textarea
          id="productos"
          v-model="form.productos"
          rows="4"
          placeholder="Contanos qué productos te interesan..."
        ></textarea>
      </div>

      <div v-if="error" class="form-error">{{ error }}</div>

      <button type="submit" class="btn btn-primary" :disabled="enviando">
        {{ enviando ? 'Enviando...' : 'Enviar Consulta' }}
      </button>
    </form>

    <div v-else class="success-msg">
      <h2>¡Consulta enviada con éxito!</h2>
      <p>Te contactaremos a la brevedad por WhatsApp.</p>
      <router-link to="/catalogo" class="btn btn-primary" style="margin-top: 16px;">
        Seguir viendo productos
      </router-link>
    </div>

    <div class="contact-info">
      <h3>También podés contactarnos directamente</h3>
      <a
        :href="whatsappUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-whatsapp"
      >
        <MessageCircle :size="20" />
        Escribinos por WhatsApp
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { createConsulta } from '../services/consultas'
import { MessageCircle } from 'lucide-vue-next'

const form = ref({
  nombre: '',
  telefono: '',
  productos: '',
})

const enviando = ref(false)
const enviado = ref(false)
const error = ref('')

const number = import.meta.env.VITE_WHATSAPP_NUMBER || '+59169577432'
const whatsappUrl = `https://wa.me/${number}?text=Hola%2C%20quiero%20consultar%20por%20sus%20productos`

const handleSubmit = async () => {
  if (!form.value.nombre.trim() || !form.value.telefono.trim()) {
    error.value = 'Por favor completá nombre y teléfono.'
    return
  }

  enviando.value = true
  error.value = ''

  try {
    await createConsulta({
      nombre: form.value.nombre.trim(),
      telefono: form.value.telefono.trim(),
      productos: form.value.productos.trim() || undefined,
    })
    enviado.value = true
  } catch {
    error.value = 'Ocurrió un error al enviar la consulta. Intentá de nuevo.'
  } finally {
    enviando.value = false
  }
}
</script>

<style scoped>
.page {
  padding: 48px 20px 80px;
  max-width: 600px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
  background: white;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-olive);
}

.form-error {
  color: var(--danger);
  font-weight: 500;
  text-align: center;
}

.success-msg {
  text-align: center;
  padding: 40px 20px;
}

.success-msg h2 {
  color: var(--primary-olive);
  margin-bottom: 8px;
}

.success-msg p {
  color: var(--soft-moss);
}

.contact-info {
  text-align: center;
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.contact-info h3 {
  color: var(--text-main);
  font-size: 1rem;
}
</style>
