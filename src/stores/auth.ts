import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const FALLBACK_EMAIL = 'admin@lowmech.com'
const FALLBACK_PASSWORD = 'aless123'
const STORAGE_KEY = 'lowmech_auth'

function cargarUsuario(): { name: string; email: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as { name: string; email: string }
  } catch {
    // ignore
  }
  return null
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ name: string; email: string } | null>(cargarUsuario())
  const isAuthenticated = computed(() => !!user.value)

  async function login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> {
    await new Promise((r) => setTimeout(r, 800))

    if (email === FALLBACK_EMAIL && password === FALLBACK_PASSWORD) {
      user.value = { name: 'Admin LowMech', email }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value))
      return { success: true }
    }

    return { success: false, error: 'Correo o contrasena incorrectos' }
  }

  function logout() {
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { user, isAuthenticated, login, logout }
})
