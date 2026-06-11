<template>
  <div class="login-container">
    <div class="login-card">
      <div class="left"></div>

      <div class="right">
        <h1 class="page-title">Iniciar Sesión</h1>
        <form @submit.prevent="handleLogin" class="form">  
          <div class="form-group input-icon">
            <User class="icon" />
            <input v-model="email" type="email" placeholder="Correo electrónico" />
          </div>

          <div class="form-group input-icon password-group">
            <Lock class="icon" />
            <input 
              v-model="password" 
              type="password" 
              placeholder="Contraseña"
              @input="checkPasswordStrength"
            />
            <small v-if="password" :class="strengthClass">{{ passwordStrength }}</small>
          </div>

          <div class="form-group">
            <label class="captcha-label" @click="generateCaptcha" title="Click para cambiar código">
              <span>Código de Seguridad:</span>
              <div class="code-display">
                <strong>{{ captchaText }}</strong>
              </div>
            </label>
            <div class="captcha-input-container">
              <Calculator class="icon" />
              <input v-model="captcha" type="text" placeholder="Ingresa el código" />
            </div>
          </div>

          <button type="submit" :disabled="loading">
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>

          <button type="button" class="register-btn" @click="handleRegister">
            ¿No tienes cuenta? Regístrate
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { User, Lock, Calculator } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const captcha = ref('')
const captchaText = ref('')
const passwordStrength = ref('')
const strengthClass = ref('')
const loading = ref(false)

const generateCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 4 ; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  captchaText.value = result
}

onMounted(() => generateCaptcha())

const checkPasswordStrength = async () => {
  if (!password.value) {
    passwordStrength.value = ''
    return
  }
  
  const result = await auth.checkPasswordStrength(password.value)
  
  const mapping: Record<string, { text: string; class: string }> = {
    weak: { text: 'Débil', class: 'weak' },
    intermediate: { text: 'Media', class: 'medium' },
    strong: { text: 'Fuerte', class: 'strong' },
  }
  
  const res = mapping[result.strength] || mapping.weak
  passwordStrength.value = res.text
  strengthClass.value = res.class
}

const handleLogin = async () => {
  if (!email.value || !password.value || !captcha.value) {
    Swal.fire({
      title: 'Error',
      text: 'Todos los campos son obligatorios',
      icon: 'error'
    })
    return
  }

  if (captcha.value.toLowerCase() !== captchaText.value.toLowerCase()) {
    Swal.fire({
      title: 'Error',
      text: 'Código de seguridad incorrecto',
      icon: 'error'
    })
    generateCaptcha()
    captcha.value = ''
    return
  }

  loading.value = true

  const result = await auth.login(email.value, password.value, captcha.value)

  loading.value = false

  if (result.success) {
    Swal.fire({
      title: '¡Bienvenido!',
      text: `Hola ${auth.user?.nombre}`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
    router.push('/dashboard')
  }
}

const handleRegister = async () => {
  const { value: formValues } = await Swal.fire({
    title: 'Registrarse',
    customClass: {
      popup: 'swal-register-popup',
      title: 'swal-register-title',
      htmlContainer: 'swal-register-html',
      confirmButton: 'swal-register-confirm',
      cancelButton: 'swal-register-cancel',
    },
    buttonsStyling: false,
    html: `
      <input id="swal-nombre" class="swal2-input swal-register-input" placeholder="Nombre completo">
      <input id="swal-email" class="swal2-input swal-register-input" type="email" placeholder="Correo electrónico">
      <input id="swal-password" class="swal2-input swal-register-input" type="password" placeholder="Contraseña">
      <input id="swal-confirm" class="swal2-input swal-register-input" type="password" placeholder="Confirmar contraseña">
    `,
    preConfirm: () => {
      const nombre = (document.getElementById('swal-nombre') as HTMLInputElement).value
      const email = (document.getElementById('swal-email') as HTMLInputElement).value
      const password = (document.getElementById('swal-password') as HTMLInputElement).value
      const confirm = (document.getElementById('swal-confirm') as HTMLInputElement).value
      
      if (!nombre || !email || !password || !confirm) {
        Swal.showValidationMessage('Todos los campos son obligatorios')
        return false
      }
      
      if (password !== confirm) {
        Swal.showValidationMessage('Las contraseñas no coinciden')
        return false
      }
      
      return { nombre, email, password }
    },
    showCancelButton: true,
    confirmButtonText: 'Registrarse',
    cancelButtonText: 'Cancelar',
  })

  if (formValues) {
    loading.value = true
    
    await auth.register(
      formValues.nombre,
      formValues.email,
      formValues.password
    )

    loading.value = false

    if (auth.isAuth) {
      Swal.fire({
        title: '¡Registrado!',
        text: 'Bienvenido al sistema',
        icon: 'success',
        confirmButtonColor: '#445a14',
      })
      router.push('/dashboard')
    }
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(120deg, var(--bg-cream) 0%, var(--soft-moss) 45%, var(--primary-olive) 100%);
  background-size: 300% 300%;
  animation: gradientMove 15s ease infinite;
}

.login-card {
  display: flex;
  width: 1000px;
  height: 580px;
  background: white;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0px 20px 40px rgba(0,0,0,0.25);
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-3px);
}

.left {
  flex: 1.2;
  background: url('../assets/logo_aurel.png') center/cover no-repeat;
}

.right {
  flex: 1;
  background-color: var(--bg-cream);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h1 {
  font-size: 40px;
  font-weight: bolder;
  color: var(--primary-olive);
  margin-bottom: 30px;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
}

.input-icon .icon {
  position: absolute;
  left: 12px;
  top: 15px;
  color: var(--primary-olive);
  width: 18px;
}

input {
  font-size: 18px;
  color: var(--text-main);
  background-color: var(--white-pure);
  padding: 12px 12px 12px 40px;
  border-radius: 12px;
  border: 2px solid var(--primary-olive);
  transition: 0.3s;
}

input:focus {
  border-color: var(--earth-brown);
  outline: none;
}

label {
  color: var(--text-main);
}

.captcha-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
}

.code-display {
  background: white;
  border: 2px dashed var(--primary-olive);
  border-radius: 10px;
  padding: 4px 12px;
  text-align: center;
  letter-spacing: 4px;
  font-size: 15px;
  min-height: 36px;
  user-select: none;
}

.captcha-input-container {
  display: flex;
  align-items: center;
  position: relative;
}

.captcha-input-container .icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-olive);
  width: 18px;
  height: 18px;
}

button {
  background-color: var(--primary-olive);
  color: white;
  padding: 12px;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, background 0.3s;
}

button:hover:not(:disabled) {
  background: var(--earth-brown);
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-btn {
  background: transparent;
  color: var(--primary-olive);
  border: 2px solid var(--primary-olive);
}

.register-btn:hover {
  background: var(--primary-olive);
  color: white;
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.weak { color: #ff6b35; font-size: 16px; font-weight: bold;}
.medium { color: #ffa500; font-size: 16px; font-weight: bold;}
.strong { color: #27ae60; font-size: 16px; font-weight: bold;}
</style>

<style>
.swal-register-popup {
  border-radius: 20px;
  padding: 30px 35px;
  background: var(--bg-cream);
  width: 500px;
}

.swal-register-title {
  color: var(--primary-olive);
  font-size: 38px;
  font-weight: bold;
  padding: 0;
  margin-bottom: 20px;
}

.swal-register-html {
  margin-bottom: 20px;
  padding: 0;
}

.swal-register-input {
  font-size: 18px !important;
  color: var(--text-main) !important;
  background: var(--white-pure) !important;
  border: 2px solid var(--primary-olive) !important;
  border-radius: 12px !important;
  padding: 12px 16px !important;
  outline: none;
  transition: border-color 0.3s, box-shadow 0.3s;
  box-shadow: none !important;
  width: 100% !important;
  box-sizing: border-box !important;
  margin: 10px 0 !important;
}

.swal-register-input:focus {
  border-color: var(--earth-brown) !important;
  box-shadow: 0 0 0 3px rgba(126, 90, 56, 0.15) !important;
}

.swal-register-popup .swal2-actions {
  gap: 18px;
  margin-top: 10px;
}

.swal-register-confirm {
  background: var(--primary-olive);
  color: white;
  padding: 12px 32px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
}

.swal-register-confirm:hover {
  background: var(--earth-brown);
  transform: translateY(-2px);
}

.swal-register-cancel {
  background: transparent;
  color: var(--earth-brown);
  border: 2px solid var(--earth-brown);
  padding: 12px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s, color 0.3s, transform 0.2s;
}

.swal-register-cancel:hover {
  background: var(--earth-brown);
  color: white;
  transform: translateY(-2px);
}
</style>