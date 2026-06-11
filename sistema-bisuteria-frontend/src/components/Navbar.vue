<template>
    <div class="navbar">
        <h3>Panel Administrativo</h3>

        <label class="switch">
            <input type="checkbox" v-model="darkMode" @change="toggleDark">
            <span class="slider"></span>
        </label>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const darkMode = ref(false)

const toggleDark = () => {
    document.body.classList.toggle('dark')
}
</script>
<style scoped>
.navbar {
    height: 60px;
    background: var(--earth-brown);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.05);
    color: var(--surface);
}

body.dark .navbar {
    background: var(--surface);
    color: var(--text);
    box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.3);
}

/* Switch Slider */
.switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked+.slider {
    background-color: var(--primary-olive);
}

input:checked+.slider:before {
    transform: translateX(26px);
}
</style>