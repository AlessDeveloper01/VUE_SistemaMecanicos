<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useClientesStore } from '@/stores/clientes'
import { useVehiculosStore } from '@/stores/vehiculos'
import { useOrdenesStore, calcularTotal } from '@/stores/ordenes'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'

const router = useRouter()
const route = useRoute()
const cliStore = useClientesStore()
const vehStore = useVehiculosStore()
const ordStore = useOrdenesStore()

const collapsed = inject<Ref<boolean>>('sidebarCollapsed')!
const darkMode = inject<Ref<boolean>>('darkMode')!

const cliente = computed(() => cliStore.obtenerPorId(route.params.id as string))

const vehiculosDelCliente = computed(() => {
  if (!cliente.value) return []
  return vehStore.vehiculos.filter((v) => v.clienteNombre === cliente.value!.nombre)
})

const ordenesDelCliente = computed(() => {
  if (!cliente.value) return []
  return ordStore.ordenes.filter((o) => o.clienteNombre === cliente.value!.nombre)
})

const totalGastado = computed(() =>
  ordenesDelCliente.value
    .filter((o) => o.estado === 'completado')
    .reduce((s, o) => s + calcularTotal(o.servicios), 0),
)

function confirmarEliminar() {
  if (cliente.value && confirm(`Eliminar al cliente ${cliente.value.nombre}?`)) {
    cliStore.eliminar(cliente.value.id)
    router.push({ name: 'clientes-lista' })
  }
}

function fmt(n: number): string {
  return n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<template>
  <div class="min-h-screen bg-bg dark:bg-dk-bg transition-colors duration-300">
    <AppSidebar />
    <div
      class="min-h-screen flex flex-col transition-all duration-300 ease-out max-[768px]:ml-0"
      :class="collapsed ? 'ml-[6.4rem]' : 'ml-[22rem]'"
    >
      <AppTopbar :dark-mode="darkMode" @toggle-dark="darkMode = !darkMode" />

      <main v-if="cliente" class="flex-1 px-12 py-10 max-[768px]:px-5 max-[768px]:py-6">
        <!-- Header -->
        <div
          class="flex items-center justify-between mb-10 max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-4"
        >
          <div class="flex items-center gap-4">
            <button
              class="w-9 h-9 flex items-center justify-center text-muted dark:text-dk-muted hover:text-body dark:hover:text-dk-body cursor-pointer border-none bg-transparent transition-colors"
              @click="router.push({ name: 'clientes-lista' })"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="flex items-center gap-4">
              <span
                class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-[1.4rem] font-semibold shrink-0"
                >{{
                  cliente.nombre
                    .split(' ')
                    .map((w) => w.charAt(0))
                    .slice(0, 2)
                    .join('')
                }}</span
              >
              <div>
                <h1
                  class="text-[2.4rem] font-light text-body dark:text-dk-body tracking-[-0.02em] leading-none"
                >
                  {{ cliente.nombre }}
                </h1>
                <p class="text-[1.2rem] text-muted dark:text-dk-muted">{{ cliente.id }}</p>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              class="px-5 py-2.5 text-[1.2rem] font-medium text-primary border border-primary/30 bg-transparent cursor-pointer hover:bg-primary hover:text-white transition-colors"
              @click="router.push({ name: 'clientes-editar', params: { id: cliente.id } })"
            >
              Editar
            </button>
            <button
              class="px-5 py-2.5 text-[1.2rem] font-medium text-red-500 border border-red-200 dark:border-red-900/40 bg-transparent cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              @click="confirmarEliminar"
            >
              Eliminar
            </button>
          </div>
        </div>

        <!-- 2 columns -->
        <div class="grid grid-cols-2 gap-10 max-[1200px]:grid-cols-1">
          <!-- Left -->
          <div class="flex flex-col gap-10">
            <!-- Info -->
            <section
              class="bg-surface dark:bg-dk-surface border border-border dark:border-dk-border"
            >
              <header class="px-8 py-6 border-b border-border dark:border-dk-border">
                <h2 class="text-[1.5rem] font-bold text-body dark:text-dk-body">
                  Informacion del Cliente
                </h2>
              </header>
              <div class="p-8">
                <dl class="grid grid-cols-2 gap-6">
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Telefono
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ cliente.telefono }}
                    </dd>
                  </div>
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Email
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ cliente.email }}
                    </dd>
                  </div>
                  <div class="col-span-2">
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Direccion
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ cliente.direccion || '—' }}
                    </dd>
                  </div>
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      RFC
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ cliente.rfc || '—' }}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <!-- Notas -->
            <section
              v-if="cliente.notas"
              class="bg-surface dark:bg-dk-surface border border-border dark:border-dk-border"
            >
              <header class="px-8 py-6 border-b border-border dark:border-dk-border">
                <h2 class="text-[1.5rem] font-bold text-body dark:text-dk-body">Notas</h2>
              </header>
              <div class="p-8">
                <p class="text-[1.4rem] text-body dark:text-dk-body leading-relaxed">
                  {{ cliente.notas }}
                </p>
              </div>
            </section>

            <!-- Vehiculos -->
            <section
              class="bg-surface dark:bg-dk-surface border border-border dark:border-dk-border"
            >
              <header class="px-8 py-6 border-b border-border dark:border-dk-border">
                <h2 class="text-[1.5rem] font-bold text-body dark:text-dk-body">Vehiculos</h2>
              </header>
              <div class="p-8">
                <div v-if="vehiculosDelCliente.length === 0" class="py-8 text-center">
                  <p class="text-[1.3rem] text-muted dark:text-dk-muted">
                    Sin vehiculos registrados
                  </p>
                </div>
                <div v-else class="flex flex-col gap-3">
                  <article
                    v-for="v in vehiculosDelCliente"
                    :key="v.id"
                    class="flex items-center gap-5 py-4 border-b border-border/60 dark:border-dk-border/60 last:border-b-0 cursor-pointer hover:bg-bg dark:hover:bg-dk-bg -mx-4 px-4 transition-colors"
                    @click="router.push({ name: 'vehiculos-detalle', params: { id: v.id } })"
                  >
                    <div
                      class="w-10 h-10 bg-subtle dark:bg-dk-subtle flex items-center justify-center shrink-0 text-muted dark:text-dk-muted"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                      >
                        <path
                          d="M14 16H9m10 0h3l-2-7H4l-2 7h3m4 0a2 2 0 104 0m4 0a2 2 0 104 0M5.5 9l1.5-4h10l1.5 4"
                        />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <p class="text-[1.3rem] font-medium text-body dark:text-dk-body">
                        {{ v.nombre }}
                      </p>
                      <p class="text-[1.1rem] text-muted dark:text-dk-muted">
                        {{ v.placa }} — {{ v.kilometraje.toLocaleString() }} km
                      </p>
                    </div>
                    <span
                      class="text-[1.1rem] font-medium px-2.5 py-1 rounded-full"
                      :class="
                        v.estado === 'en_taller'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                          : v.estado === 'disponible'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      "
                    >
                      {{
                        v.estado === 'en_taller'
                          ? 'En taller'
                          : v.estado === 'disponible'
                            ? 'Disponible'
                            : 'En espera'
                      }}
                    </span>
                  </article>
                </div>
              </div>
            </section>

            <!-- Historial ordenes -->
            <section
              class="bg-surface dark:bg-dk-surface border border-border dark:border-dk-border"
            >
              <header class="px-8 py-6 border-b border-border dark:border-dk-border">
                <h2 class="text-[1.5rem] font-bold text-body dark:text-dk-body">
                  Historial de Servicios
                </h2>
              </header>
              <div class="p-8">
                <div v-if="ordenesDelCliente.length === 0" class="py-8 text-center">
                  <p class="text-[1.3rem] text-muted dark:text-dk-muted">
                    Sin servicios registrados
                  </p>
                </div>
                <div v-else class="flex flex-col">
                  <article
                    v-for="o in ordenesDelCliente"
                    :key="o.id"
                    class="flex gap-6 py-5 border-b border-border/60 dark:border-dk-border/60 last:border-b-0 cursor-pointer hover:bg-bg dark:hover:bg-dk-bg -mx-4 px-4 transition-colors"
                    @click="router.push({ name: 'ordenes-detalle', params: { id: o.id } })"
                  >
                    <time
                      class="flex flex-col items-center justify-center w-[4.8rem] h-[4.8rem] bg-bg dark:bg-dk-bg border border-border dark:border-dk-border shrink-0"
                    >
                      <span
                        class="text-[1.6rem] font-bold text-body dark:text-dk-body leading-none"
                        >{{ o.fechaIngreso.split('-')[2] }}</span
                      >
                      <span
                        class="text-[1rem] font-semibold text-muted dark:text-dk-muted uppercase"
                        >{{
                          new Date(o.fechaIngreso).toLocaleDateString('es-MX', { month: 'short' })
                        }}</span
                      >
                    </time>
                    <div class="flex-1">
                      <p class="text-[1.3rem] font-semibold text-body dark:text-dk-body mb-1">
                        {{ o.vehiculoNombre }}
                      </p>
                      <p class="text-[1.1rem] text-muted dark:text-dk-muted">{{ o.id }}</p>
                    </div>
                    <span class="text-[1.2rem] font-bold text-body dark:text-dk-body"
                      >${{ fmt(calcularTotal(o.servicios)) }}</span
                    >
                  </article>
                </div>
              </div>
            </section>
          </div>

          <!-- Right: resumen -->
          <div class="flex flex-col gap-10">
            <section
              class="bg-surface dark:bg-dk-surface border border-border dark:border-dk-border"
            >
              <header class="px-8 py-6 border-b border-border dark:border-dk-border">
                <h2 class="text-[1.5rem] font-bold text-body dark:text-dk-body">Resumen</h2>
              </header>
              <div class="p-8">
                <dl class="grid grid-cols-2 gap-6">
                  <div class="py-4 border-b border-border/60 dark:border-dk-border/60">
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Vehiculos
                    </dt>
                    <dd class="text-[2rem] font-light text-body dark:text-dk-body">
                      {{ vehiculosDelCliente.length }}
                    </dd>
                  </div>
                  <div class="py-4 border-b border-border/60 dark:border-dk-border/60">
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Servicios
                    </dt>
                    <dd class="text-[2rem] font-light text-body dark:text-dk-body">
                      {{ ordenesDelCliente.length }}
                    </dd>
                  </div>
                  <div class="py-4">
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Total gastado
                    </dt>
                    <dd class="text-[2rem] font-light text-primary">${{ fmt(totalGastado) }}</dd>
                  </div>
                </dl>
              </div>
            </section>

            <!-- Acciones -->
            <section
              class="bg-surface dark:bg-dk-surface border border-border dark:border-dk-border"
            >
              <header class="px-8 py-6 border-b border-border dark:border-dk-border">
                <h2 class="text-[1.5rem] font-bold text-body dark:text-dk-body">
                  Acciones Rapidas
                </h2>
              </header>
              <div class="p-8 flex flex-col gap-3">
                <button
                  class="flex items-center gap-3 w-full px-5 py-4 text-left bg-bg dark:bg-dk-bg border border-border dark:border-dk-border cursor-pointer hover:border-primary transition-colors"
                  @click="router.push({ name: 'ordenes-crear' })"
                >
                  <span
                    class="w-7 h-7 bg-primary/10 text-primary flex items-center justify-center text-[1.4rem] font-light leading-none"
                    >+</span
                  >
                  <span class="text-[1.3rem] font-medium text-body dark:text-dk-body"
                    >Crear nueva orden</span
                  >
                </button>
                <button
                  class="flex items-center gap-3 w-full px-5 py-4 text-left bg-bg dark:bg-dk-bg border border-border dark:border-dk-border cursor-pointer hover:border-primary transition-colors"
                  @click="router.push({ name: 'vehiculos-crear' })"
                >
                  <span
                    class="w-7 h-7 bg-primary/10 text-primary flex items-center justify-center text-[1.4rem] font-light leading-none"
                    >+</span
                  >
                  <span class="text-[1.3rem] font-medium text-body dark:text-dk-body"
                    >Registrar vehiculo</span
                  >
                </button>
                <button
                  class="flex items-center gap-3 w-full px-5 py-4 text-left bg-bg dark:bg-dk-bg border border-border dark:border-dk-border cursor-pointer hover:border-primary transition-colors"
                  @click="router.push({ name: 'clientes-editar', params: { id: cliente.id } })"
                >
                  <span
                    class="w-7 h-7 bg-primary/10 text-primary flex items-center justify-center text-[1.4rem] font-light leading-none"
                    >✎</span
                  >
                  <span class="text-[1.3rem] font-medium text-body dark:text-dk-body"
                    >Editar cliente</span
                  >
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <main v-else class="flex-1 px-12 py-10 flex items-center justify-center">
        <div class="text-center">
          <p class="text-[1.6rem] text-muted dark:text-dk-muted mb-4">Cliente no encontrado</p>
          <button
            class="text-[1.3rem] font-medium text-primary cursor-pointer border-none bg-transparent"
            @click="router.push({ name: 'clientes-lista' })"
          >
            Volver a clientes
          </button>
        </div>
      </main>
    </div>
  </div>
</template>
