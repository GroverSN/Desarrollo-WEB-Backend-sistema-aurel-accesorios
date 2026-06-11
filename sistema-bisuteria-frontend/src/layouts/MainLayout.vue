<template>
    <div class="layout">

        <!-- SIDEBAR -->
        <aside :class="['sidebar', { collapsed }]">
            <button class="toggle" @click="toggleSidebar">
                ☰
            </button>
            <h2 class="logo">Aurel Accesorios</h2>

            <nav class="menu">

                <router-link to="/dashboard" class="link" active-class="active">
                    <LayoutDashboard class="icon" />
                    <span>Dashboard</span>
                </router-link>

                <router-link to="/productos" class="link" active-class="active">
                    <Package class="icon" />
                    <span>Productos</span>
                </router-link>

                <router-link to="/ventas" class="link" active-class="active">
                    <ShoppingCart class="icon" />
                    <span>Ventas</span>
                </router-link>

                <router-link to="/reportes" class="link" active-class="active">
                    <BarChart3 class="icon" />
                    <span>Reportes</span>
                </router-link>

                <router-link to="/consultas" class="link" active-class="active">
                    <MessageSquare class="icon" />
                    <span>Consultas</span>
                </router-link>

                <button class="logout" @click="logout">
                    <LogOut class="icon" />
                    <span>Salir</span>
                </button>
            </nav>


        </aside>

        <!-- CONTENIDO DERECHO -->
        <div class="right">

            <!-- NAVBAR SUPERIOR -->
            <Navbar />

            <!-- CONTENIDO DINÁMICO -->
            <main class="content">
                <transition-group name="fade" tag="div">
                    <slot />
                </transition-group>
            </main>

        </div>

    </div>
</template>

<script setup lang="ts">
import Navbar from '../components/Navbar.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { LayoutDashboard, Package, BarChart3, LogOut, ShoppingCart, MessageSquare } from 'lucide-vue-next'
import { ref } from 'vue'

const collapsed = ref(false)

const toggleSidebar = () => {
    collapsed.value = !collapsed.value
}

const router = useRouter()
const auth = useAuthStore()

const logout = () => {
    auth.logout()
    router.push('/')
}
</script>

<style scoped>
.layout {
    display: flex;
    height: 100vh;
}

/* SIDEBAR */
.sidebar {
    width: 240px;
    min-width: 240px;
    transition: 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    overflow-x: hidden; /* VITAL: evita que el texto se vea mientras se cierra */
    white-space: nowrap; /* VITAL: evita que el texto haga saltos de línea al comprimirse */
    background: var(--primary-olive);
    color: var(--white-pure);
}

.sidebar.collapsed {
    width: 70px;
    min-width: 70px;
}

.sidebar.collapsed .logo,
.sidebar.collapsed .menu span,
.sidebar.collapsed .logout span {
    display: none;
}

.toggle {
    margin-bottom: 20px;
    background: transparent;
    border: none;
    color: white;
    font-size: 25px;
    cursor: pointer;
    width: 100%;
    text-align: center;
    padding: 10px 0;
}

/* LOGO */
.logo {
    margin-bottom: 30px;
    text-align: center;
    color: var(--white-pure);
}

/* MENU */
.menu {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* LINKS */
.link {
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 10px;
    border-radius: 10px;
    color: var(--white-pure);
    text-decoration: none;
    transition: 0.3s;
}

.link:hover {
    background: var(--soft-moss);
    color: var(--white-pure);
}

.sidebar.collapsed .link {
    justify-content: center;
}

.sidebar.collapsed .logout {
    justify-content: center;
}

/* ACTIVO 🔥 */
.active {
    background: var(--bg-cream);
    color: var(--primary);
    font-weight: bold;
}

/* ICONOS */
.icon {
    width: 18px;
    height: 18px;
}

/* LOGOUT */
.logout {
    font-size: 20px;
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 10px;
    border: none;
    border-radius: 10px;
    background: var(--primary-olive);
    color: white;
    cursor: pointer;
    transition: 0.3s;
}

.logout:hover {
    background: var(--danger);
    opacity: 0.9;
}

/* LADO DERECHO */
.right {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--bg-cream);
}

/* CONTENIDO */
.content {
    padding: 20px;
    overflow-y: auto;
    position: relative;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>