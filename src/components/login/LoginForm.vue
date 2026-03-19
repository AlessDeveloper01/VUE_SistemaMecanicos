<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errors = ref<Record<string, string>>({})
const serverError = ref('')
const loading = ref(false)

function validate(): boolean {
  errors.value = {}
  serverError.value = ''

  if (!email.value) {
    errors.value.email = 'El correo es obligatorio'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = 'Ingresa un correo válido'
  }

  if (!password.value) {
    errors.value.password = 'La contraseña es obligatoria'
  } else if (password.value.length < 6) {
    errors.value.password = 'Mínimo 6 caracteres'
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validate()) return

  loading.value = true
  const result = await auth.login(email.value, password.value)
  loading.value = false

  if (result.success) {
    router.push({ name: 'dashboard' })
  } else {
    serverError.value = result.error ?? 'Error al iniciar sesión'
  }
}
</script>

<template>
  <form class="w-full flex flex-col gap-8" @submit.prevent="handleSubmit">
    <header class="flex flex-col gap-2">
      <h2 class="text-[2.4rem] font-bold text-body">Iniciar Sesión</h2>
      <p class="text-[1.4rem] text-muted">Ingresa tus credenciales para acceder al sistema</p>
    </header>

    <div
      v-if="serverError"
      class="px-5 py-4 bg-red-50 border border-red-200 text-[1.3rem] text-red-700 font-medium"
    >
      {{ serverError }}
    </div>

    <div class="flex flex-col gap-6">
      <BaseInput
        v-model="email"
        label="Correo Electrónico"
        type="email"
        placeholder="correo@ejemplo.com"
        :error="errors.email"
      />

      <BaseInput
        v-model="password"
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        :error="errors.password"
      />
    </div>

    <div class="flex items-center justify-between">
      <label class="flex items-center gap-3 cursor-pointer">
        <input v-model="rememberMe" type="checkbox" class="w-5 h-5 accent-primary cursor-pointer" />
        <span class="text-[1.3rem] text-muted font-medium">Recordarme</span>
      </label>
      <a
        href="#"
        class="text-[1.3rem] font-semibold text-primary no-underline hover:opacity-70 transition-opacity"
      >
        ¿Olvidaste tu contraseña?
      </a>
    </div>

    <BaseButton type="submit" variant="primary" :full-width="true" :loading="loading">
      {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
    </BaseButton>
  </form>
</template>
