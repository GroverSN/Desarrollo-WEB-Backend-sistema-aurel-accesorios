<template>
  <a
    :href="whatsappUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="whatsapp-float"
    title="Consultar por WhatsApp"
  >
    <MessageCircle :size="28" />
  </a>
</template>

<script setup lang="ts">
import { MessageCircle } from 'lucide-vue-next'

const number = import.meta.env.VITE_WHATSAPP_NUMBER || '+59169577432'
const whatsappUrl = `https://wa.me/${number}?text=Hola%2C%20quiero%20consultar%20por%20sus%20productos`
</script>

<style scoped>
.whatsapp-float {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: #25d366;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4);
  transition: transform 0.3s, box-shadow 0.3s;
  z-index: 99;
}

.whatsapp-float:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
}

@media (max-width: 768px) {
  .whatsapp-float {
    bottom: 16px;
    right: 16px;
    width: 48px;
    height: 48px;
  }
}
</style>
