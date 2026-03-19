<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useVehiculosStore, type EstadoVehiculo } from '@/stores/vehiculos'
import { useOrdenesStore, calcularTotal } from '@/stores/ordenes'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'

const router = useRouter()
const route = useRoute()
const vehStore = useVehiculosStore()
const ordStore = useOrdenesStore()

const collapsed = inject<Ref<boolean>>('sidebarCollapsed')!
const darkMode = inject<Ref<boolean>>('darkMode')!

const vehiculo = computed(() => vehStore.obtenerPorId(route.params.id as string))

const ordenesDelVehiculo = computed(() => {
  if (!vehiculo.value) return []
  return ordStore.ordenes.filter((o) => o.placa === vehiculo.value!.placa)
})

const estadoConfig: Record<EstadoVehiculo, { label: string; clase: string }> = {
  en_taller: {
    label: 'En taller',
    clase: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  },
  disponible: {
    label: 'Disponible',
    clase: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  },
  en_espera: {
    label: 'En espera',
    clase: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  },
}

function confirmarEliminar() {
  if (vehiculo.value && confirm(`Eliminar ${vehiculo.value.nombre}?`)) {
    vehStore.eliminar(vehiculo.value.id)
    router.push({ name: 'vehiculos-lista' })
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

      <main v-if="vehiculo" class="flex-1 px-12 py-10 max-[768px]:px-5 max-[768px]:py-6">
        <!-- Header -->
        <div
          class="flex items-center justify-between mb-10 max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-4"
        >
          <div class="flex items-center gap-4">
            <button
              class="w-9 h-9 flex items-center justify-center text-muted dark:text-dk-muted hover:text-body dark:hover:text-dk-body cursor-pointer border-none bg-transparent transition-colors"
              @click="router.push({ name: 'vehiculos-lista' })"
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
            <h1
              class="text-[2.4rem] font-light text-body dark:text-dk-body tracking-[-0.02em] leading-none"
            >
              {{ vehiculo.nombre }}
            </h1>
            <span
              class="text-[1.1rem] font-medium px-3 py-1 rounded-full"
              :class="estadoConfig[vehiculo.estado].clase"
              >{{ estadoConfig[vehiculo.estado].label }}</span
            >
          </div>
          <div class="flex items-center gap-3">
            <button
              class="px-5 py-2.5 text-[1.2rem] font-medium text-primary border border-primary/30 bg-transparent cursor-pointer hover:bg-primary hover:text-white transition-colors"
              @click="router.push({ name: 'vehiculos-editar', params: { id: vehiculo.id } })"
            >
              Editar
            </button>
            <button
              class="px-5 py-2.5 text-[1.2rem] font-medium text-red-500 border border-red-200 dark:border-red-900/40 bg-transparent cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              @click="confirmarEliminar"
            >
              Eliminar
            </button>
            <button
              class="px-5 py-2.5 text-[1.2rem] font-semibold text-white bg-primary border-none cursor-pointer hover:bg-primary-dark transition-colors"
              @click="router.push({ name: 'ordenes-crear' })"
            >
              + Nueva Orden
            </button>
          </div>
        </div>

        <!-- 2 columns -->
        <div class="grid grid-cols-2 gap-10 max-[1200px]:grid-cols-1">
          <!-- Left -->
          <div class="flex flex-col gap-10">
            <!-- Info vehiculo -->
            <section
              class="bg-surface dark:bg-dk-surface border border-border dark:border-dk-border"
            >
              <header class="px-8 py-6 border-b border-border dark:border-dk-border">
                <h2 class="text-[1.5rem] font-bold text-body dark:text-dk-body">
                  Informacion del Vehiculo
                </h2>
              </header>
              <div class="p-8">
                <dl class="grid grid-cols-2 gap-6">
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Marca
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ vehiculo.marca }}
                    </dd>
                  </div>
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Modelo
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ vehiculo.modelo }}
                    </dd>
                  </div>
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Anio
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ vehiculo.anio }}
                    </dd>
                  </div>
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Placas
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ vehiculo.placa }}
                    </dd>
                  </div>
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Color
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ vehiculo.color || '—' }}
                    </dd>
                  </div>
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      VIN
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ vehiculo.vin || '—' }}
                    </dd>
                  </div>
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Kilometraje
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ vehiculo.kilometraje.toLocaleString() }} km
                    </dd>
                  </div>
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Combustible
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ vehiculo.combustible }}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <!-- Cliente -->
            <section
              class="bg-surface dark:bg-dk-surface border border-border dark:border-dk-border"
            >
              <header class="px-8 py-6 border-b border-border dark:border-dk-border">
                <h2 class="text-[1.5rem] font-bold text-body dark:text-dk-body">
                  Cliente Propietario
                </h2>
              </header>
              <div class="p-8">
                <div
                  class="flex items-center gap-5 mb-6 pb-6 border-b border-border dark:border-dk-border"
                >
                  <div
                    class="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-[1.4rem] font-semibold shrink-0"
                  >
                    {{
                      vehiculo.clienteNombre
                        .split(' ')
                        .map((w) => w.charAt(0))
                        .slice(0, 2)
                        .join('')
                    }}
                  </div>
                  <div>
                    <p class="text-[1.6rem] font-semibold text-body dark:text-dk-body">
                      {{ vehiculo.clienteNombre }}
                    </p>
                  </div>
                </div>
                <dl class="grid grid-cols-2 gap-6">
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Telefono
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ vehiculo.clienteTelefono }}
                    </dd>
                  </div>
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Email
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ vehiculo.clienteEmail }}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <!-- Notas -->
            <section
              v-if="vehiculo.notas"
              class="bg-surface dark:bg-dk-surface border border-border dark:border-dk-border"
            >
              <header class="px-8 py-6 border-b border-border dark:border-dk-border">
                <h2 class="text-[1.5rem] font-bold text-body dark:text-dk-body">Notas</h2>
              </header>
              <div class="p-8">
                <p class="text-[1.4rem] text-body dark:text-dk-body leading-relaxed">
                  {{ vehiculo.notas }}
                </p>
              </div>
            </section>

            <!-- Historial de ordenes -->
            <section
              class="bg-surface dark:bg-dk-surface border border-border dark:border-dk-border"
            >
              <header class="px-8 py-6 border-b border-border dark:border-dk-border">
                <h2 class="text-[1.5rem] font-bold text-body dark:text-dk-body">
                  Historial de Servicios
                </h2>
              </header>
              <div class="p-8">
                <div v-if="ordenesDelVehiculo.length === 0" class="py-8 text-center">
                  <p class="text-[1.3rem] text-muted dark:text-dk-muted">
                    Sin servicios registrados
                  </p>
                </div>
                <div v-else class="flex flex-col">
                  <article
                    v-for="orden in ordenesDelVehiculo"
                    :key="orden.id"
                    class="flex gap-6 py-6 border-b border-border/60 dark:border-dk-border/60 last:border-b-0 cursor-pointer hover:bg-bg dark:hover:bg-dk-bg -mx-4 px-4 transition-colors"
                    @click="router.push({ name: 'ordenes-detalle', params: { id: orden.id } })"
                  >
                    <time
                      class="flex flex-col items-center justify-center w-[4.8rem] h-[4.8rem] bg-bg dark:bg-dk-bg border border-border dark:border-dk-border shrink-0"
                    >
                      <span
                        class="text-[1.6rem] font-bold text-body dark:text-dk-body leading-none"
                        >{{ orden.fechaIngreso.split('-')[2] }}</span
                      >
                      <span
                        class="text-[1rem] font-semibold text-muted dark:text-dk-muted uppercase"
                        >{{
                          new Date(orden.fechaIngreso).toLocaleDateString('es-MX', {
                            month: 'short',
                          })
                        }}</span
                      >
                    </time>
                    <div class="flex-1">
                      <p class="text-[1.4rem] font-semibold text-body dark:text-dk-body mb-1">
                        {{ orden.diagnostico || 'Servicio' }}
                      </p>
                      <p class="text-[1.2rem] text-muted dark:text-dk-muted mb-2">
                        {{ orden.id }} — {{ orden.mecanico || 'Sin asignar' }}
                      </p>
                      <div class="flex items-center justify-between">
                        <span
                          class="text-[1rem] font-medium px-2 py-0.5 rounded-full"
                          :class="
                            estadoConfig[
                              orden.estado === 'en_proceso'
                                ? 'en_taller'
                                : orden.estado === 'completado'
                                  ? 'disponible'
                                  : 'en_espera'
                            ].clase
                          "
                        >
                          {{
                            orden.estado === 'en_proceso'
                              ? 'En proceso'
                              : orden.estado === 'completado'
                                ? 'Completado'
                                : orden.estado === 'pendiente'
                                  ? 'Pendiente'
                                  : 'Cancelado'
                          }}
                        </span>
                        <span class="text-[1.3rem] font-bold text-body dark:text-dk-body"
                          >${{ fmt(calcularTotal(orden.servicios)) }}</span
                        >
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </section>
          </div>

          <!-- Right -->
          <div class="flex flex-col gap-10">
            <!-- Quick stats -->
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
                      Total servicios
                    </dt>
                    <dd class="text-[2rem] font-light text-body dark:text-dk-body">
                      {{ ordenesDelVehiculo.length }}
                    </dd>
                  </div>
                  <div class="py-4 border-b border-border/60 dark:border-dk-border/60">
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Completados
                    </dt>
                    <dd class="text-[2rem] font-light text-emerald-500">
                      {{ ordenesDelVehiculo.filter((o) => o.estado === 'completado').length }}
                    </dd>
                  </div>
                  <div class="py-4">
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Total gastado
                    </dt>
                    <dd class="text-[2rem] font-light text-primary">
                      ${{
                        fmt(
                          ordenesDelVehiculo
                            .filter((o) => o.estado === 'completado')
                            .reduce((s, o) => s + calcularTotal(o.servicios), 0),
                        )
                      }}
                    </dd>
                  </div>
                  <div class="py-4">
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Kilometraje
                    </dt>
                    <dd class="text-[2rem] font-light text-body dark:text-dk-body">
                      {{ vehiculo.kilometraje.toLocaleString() }}
                      <span class="text-[1.2rem]">km</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <!-- Próximos mantenimientos -->
            <section
              class="bg-surface dark:bg-dk-surface border border-border dark:border-dk-border"
            >
              <header class="px-8 py-6 border-b border-border dark:border-dk-border">
                <h2 class="text-[1.5rem] font-bold text-body dark:text-dk-body">
                  Proximos Mantenimientos
                </h2>
              </header>
              <div class="p-8 flex flex-col gap-3">
                <div
                  class="flex justify-between items-center py-4 border-b border-border/60 dark:border-dk-border/60"
                >
                  <span class="text-[1.3rem] font-medium text-body dark:text-dk-body"
                    >Cambio de aceite</span
                  >
                  <span class="text-[1.2rem] font-semibold text-primary"
                    >{{ (vehiculo.kilometraje + 5000).toLocaleString() }} km</span
                  >
                </div>
                <div
                  class="flex justify-between items-center py-4 border-b border-border/60 dark:border-dk-border/60"
                >
                  <span class="text-[1.3rem] font-medium text-body dark:text-dk-body"
                    >Afinacion</span
                  >
                  <span class="text-[1.2rem] font-semibold text-muted dark:text-dk-muted"
                    >{{ (vehiculo.kilometraje + 10000).toLocaleString() }} km</span
                  >
                </div>
                <div class="flex justify-between items-center py-4">
                  <span class="text-[1.3rem] font-medium text-body dark:text-dk-body"
                    >Revision de frenos</span
                  >
                  <span class="text-[1.2rem] font-semibold text-muted dark:text-dk-muted"
                    >{{ (vehiculo.kilometraje + 15000).toLocaleString() }} km</span
                  >
                </div>
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
                  @click="router.push({ name: 'vehiculos-editar', params: { id: vehiculo.id } })"
                >
                  <span
                    class="w-7 h-7 bg-primary/10 text-primary flex items-center justify-center text-[1.4rem] font-light leading-none"
                    >✎</span
                  >
                  <span class="text-[1.3rem] font-medium text-body dark:text-dk-body"
                    >Editar vehiculo</span
                  >
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <main v-else class="flex-1 px-12 py-10 flex items-center justify-center">
        <div class="text-center">
          <p class="text-[1.6rem] text-muted dark:text-dk-muted mb-4">Vehiculo no encontrado</p>
          <button
            class="text-[1.3rem] font-medium text-primary cursor-pointer border-none bg-transparent"
            @click="router.push({ name: 'vehiculos-lista' })"
          >
            Volver a vehiculos
          </button>
        </div>
      </main>
    </div>
  </div>
</template>
