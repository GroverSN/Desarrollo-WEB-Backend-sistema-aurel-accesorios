<template>
  <div id="web-app">
    <Navbar />
    <main>
      <router-view />
    </main>
    <Footer />
    <WhatsAppFloat />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import WhatsAppFloat from './components/WhatsAppFloat.vue'
import Toast from './components/Toast.vue'
</script>

<style>
:root {
  --primary-olive: #445a14;
  --bg-cream: #fcf9da;
  --soft-moss: #84813e;
  --earth-brown: #7e5a38;
  --white-pure: #ffffff;
  --text-main: #2d3436;
  --primary: #445a14;
  --bg: #fcf9da;
  --text: #2d3436;
  --danger: #c34747;
  --surface: #ffffff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: var(--bg-cream);
  color: var(--text-main);
  line-height: 1.6;
}

#web-app {
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}

img {
  max-width: 100%;
  height: auto;
}

a {
  text-decoration: none;
  color: inherit;
}

button {
  cursor: pointer;
  font-family: inherit;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
