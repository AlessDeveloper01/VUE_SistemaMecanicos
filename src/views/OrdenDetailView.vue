<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  useOrdenesStore,
  calcularSubtotal,
  calcularIVA,
  calcularTotal,
  type EstadoOrden,
} from '@/stores/ordenes'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'

const router = useRouter()
const route = useRoute()
const store = useOrdenesStore()

const collapsed = inject<Ref<boolean>>('sidebarCollapsed')!
const darkMode = inject<Ref<boolean>>('darkMode')!

const orden = computed(() => store.obtenerPorId(route.params.id as string))

const estadoConfig: Record<EstadoOrden, { label: string; clase: string }> = {
  pendiente: {
    label: 'Pendiente',
    clase: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  },
  en_proceso: {
    label: 'En proceso',
    clase: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  },
  completado: {
    label: 'Completado',
    clase: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  },
  cancelado: {
    label: 'Cancelado',
    clase: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  },
}

const prioridadConfig: Record<string, { label: string; clase: string }> = {
  normal: { label: 'Normal', clase: 'text-muted dark:text-dk-muted' },
  alta: { label: 'Alta', clase: 'text-amber-500' },
  urgente: { label: 'Urgente', clase: 'text-red-500' },
}

const estadosDisponibles: { valor: EstadoOrden; label: string }[] = [
  { valor: 'pendiente', label: 'Pendiente' },
  { valor: 'en_proceso', label: 'En proceso' },
  { valor: 'completado', label: 'Completado' },
  { valor: 'cancelado', label: 'Cancelado' },
]

function cambiarEstado(estado: EstadoOrden) {
  if (orden.value) store.cambiarEstado(orden.value.id, estado)
}

function confirmarEliminar() {
  if (orden.value && confirm(`Eliminar la orden ${orden.value.id}?`)) {
    store.eliminar(orden.value.id)
    router.push({ name: 'ordenes-lista' })
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

      <main v-if="orden" class="flex-1 px-12 py-10 max-[768px]:px-5 max-[768px]:py-6">
        <!-- Header -->
        <div class="flex items-center gap-4 mb-10">
          <button
            class="w-9 h-9 flex items-center justify-center text-muted dark:text-dk-muted hover:text-body dark:hover:text-dk-body cursor-pointer border-none bg-transparent transition-colors"
            @click="router.push({ name: 'ordenes-lista' })"
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
          <div class="flex-1">
            <div class="flex items-center gap-4">
              <h1
                class="text-[2.4rem] font-light text-body dark:text-dk-body tracking-[-0.02em] leading-none"
              >
                {{ orden.id }}
              </h1>
              <span
                class="text-[1.1rem] font-medium px-3 py-1 rounded-full"
                :class="estadoConfig[orden.estado].clase"
                >{{ estadoConfig[orden.estado].label }}</span
              >
              <span
                v-if="orden.prioridad !== 'normal'"
                class="text-[1.1rem] font-semibold"
                :class="prioridadConfig[orden.prioridad]?.clase"
                >{{ prioridadConfig[orden.prioridad]?.label }}</span
              >
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              class="px-5 py-2.5 text-[1.2rem] font-medium text-primary border border-primary/30 bg-transparent cursor-pointer hover:bg-primary hover:text-white transition-colors"
              @click="router.push({ name: 'ordenes-editar', params: { id: orden.id } })"
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

        <div class="grid grid-cols-[1fr_30rem] gap-14 max-[1000px]:grid-cols-1">
          <!-- Left -->
          <div class="flex flex-col gap-10">
            <!-- Cliente -->
            <section>
              <h2
                class="text-[1.1rem] font-semibold text-primary/60 uppercase tracking-[0.15em] mb-4"
              >
                Cliente
              </h2>
              <div class="grid grid-cols-3 gap-6">
                <div>
                  <span class="text-[1.1rem] text-muted dark:text-dk-muted block mb-1">Nombre</span>
                  <p class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                    {{ orden.clienteNombre }}
                  </p>
                </div>
                <div>
                  <span class="text-[1.1rem] text-muted dark:text-dk-muted block mb-1"
                    >Telefono</span
                  >
                  <p class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                    {{ orden.clienteTelefono }}
                  </p>
                </div>
                <div>
                  <span class="text-[1.1rem] text-muted dark:text-dk-muted block mb-1">Email</span>
                  <p class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                    {{ orden.clienteEmail }}
                  </p>
                </div>
              </div>
            </section>

            <!-- Vehiculo -->
            <section>
              <h2
                class="text-[1.1rem] font-semibold text-primary/60 uppercase tracking-[0.15em] mb-4"
              >
                Vehiculo
              </h2>
              <div class="grid grid-cols-3 gap-6">
                <div>
                  <span class="text-[1.1rem] text-muted dark:text-dk-muted block mb-1"
                    >Vehiculo</span
                  >
                  <p class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                    {{ orden.vehiculoNombre }}
                  </p>
                </div>
                <div>
                  <span class="text-[1.1rem] text-muted dark:text-dk-muted block mb-1">Placa</span>
                  <p class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                    {{ orden.placa }}
                  </p>
                </div>
                <div>
                  <span class="text-[1.1rem] text-muted dark:text-dk-muted block mb-1"
                    >Kilometraje</span
                  >
                  <p class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                    {{ orden.kilometraje.toLocaleString() }} km
                  </p>
                </div>
              </div>
            </section>

            <!-- Diagnostico -->
            <section v-if="orden.diagnostico">
              <h2
                class="text-[1.1rem] font-semibold text-primary/60 uppercase tracking-[0.15em] mb-4"
              >
                Diagnostico
              </h2>
              <p class="text-[1.4rem] text-body dark:text-dk-body leading-relaxed">
                {{ orden.diagnostico }}
              </p>
              <p v-if="orden.notas" class="text-[1.3rem] text-muted dark:text-dk-muted mt-2">
                {{ orden.notas }}
              </p>
            </section>

            <!-- Servicios -->
            <section>
              <h2
                class="text-[1.1rem] font-semibold text-primary/60 uppercase tracking-[0.15em] mb-4"
              >
                Servicios
              </h2>
              <div class="border border-border dark:border-dk-border overflow-hidden">
                <div
                  class="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 bg-bg dark:bg-dk-bg border-b border-border dark:border-dk-border"
                >
                  <span
                    class="text-[1.1rem] font-semibold text-muted dark:text-dk-muted uppercase tracking-wider"
                    >Descripcion</span
                  >
                  <span
                    class="text-[1.1rem] font-semibold text-muted dark:text-dk-muted uppercase tracking-wider w-16 text-right"
                    >Cant.</span
                  >
                  <span
                    class="text-[1.1rem] font-semibold text-muted dark:text-dk-muted uppercase tracking-wider w-24 text-right"
                    >Precio</span
                  >
                  <span
                    class="text-[1.1rem] font-semibold text-muted dark:text-dk-muted uppercase tracking-wider w-28 text-right"
                    >Total</span
                  >
                </div>
                <div
                  v-for="(s, i) in orden.servicios"
                  :key="i"
                  class="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-4 border-b border-border/60 dark:border-dk-border/60 last:border-b-0 items-center"
                >
                  <div>
                    <span
                      class="text-[1rem] uppercase tracking-wider font-medium px-2 py-0.5 rounded"
                      :class="
                        s.tipo === 'servicio'
                          ? 'text-primary bg-primary/10'
                          : 'text-blue-500 bg-blue-50 dark:bg-blue-950/30'
                      "
                      >{{ s.tipo }}</span
                    >
                    <span class="text-[1.3rem] text-body dark:text-dk-body ml-2">{{
                      s.descripcion
                    }}</span>
                  </div>
                  <span class="text-[1.3rem] text-body dark:text-dk-body w-16 text-right">{{
                    s.cantidad
                  }}</span>
                  <span class="text-[1.3rem] text-muted dark:text-dk-muted w-24 text-right"
                    >${{ fmt(s.precioUnitario) }}</span
                  >
                  <span
                    class="text-[1.3rem] font-semibold text-body dark:text-dk-body w-28 text-right"
                    >${{ fmt(s.cantidad * s.precioUnitario) }}</span
                  >
                </div>
              </div>
              <!-- Totales -->
              <div class="mt-4 flex flex-col items-end gap-1">
                <div class="flex items-center gap-6">
                  <span class="text-[1.2rem] text-muted dark:text-dk-muted">Subtotal</span
                  ><span class="text-[1.3rem] font-medium text-body dark:text-dk-body"
                    >${{ fmt(calcularSubtotal(orden.servicios)) }}</span
                  >
                </div>
                <div class="flex items-center gap-6">
                  <span class="text-[1.2rem] text-muted dark:text-dk-muted">IVA (16%)</span
                  ><span class="text-[1.3rem] font-medium text-body dark:text-dk-body"
                    >${{ fmt(calcularIVA(orden.servicios)) }}</span
                  >
                </div>
                <div
                  class="flex items-center gap-6 pt-2 border-t border-border dark:border-dk-border mt-1"
                >
                  <span class="text-[1.4rem] font-bold text-body dark:text-dk-body">Total</span
                  ><span class="text-[2rem] font-bold text-primary"
                    >${{ fmt(calcularTotal(orden.servicios)) }}</span
                  >
                </div>
              </div>
            </section>

            <!-- Info -->
            <div class="grid grid-cols-3 gap-6">
              <div>
                <span class="text-[1.1rem] text-muted dark:text-dk-muted block mb-1"
                  >Fecha ingreso</span
                >
                <p class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                  {{ orden.fechaIngreso }}
                </p>
              </div>
              <div>
                <span class="text-[1.1rem] text-muted dark:text-dk-muted block mb-1"
                  >Fecha promesa</span
                >
                <p class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                  {{ orden.fechaPromesa || '—' }}
                </p>
              </div>
              <div>
                <span class="text-[1.1rem] text-muted dark:text-dk-muted block mb-1"
                  >Fecha fin</span
                >
                <p class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                  {{ orden.fechaFin || '—' }}
                </p>
              </div>
              <div>
                <span class="text-[1.1rem] text-muted dark:text-dk-muted block mb-1">Mecanico</span>
                <p class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                  {{ orden.mecanico || 'Sin asignar' }}
                </p>
              </div>
              <div>
                <span class="text-[1.1rem] text-muted dark:text-dk-muted block mb-1">Anticipo</span>
                <p class="text-[1.4rem] font-medium text-primary">${{ fmt(orden.anticipo) }}</p>
              </div>
              <div>
                <span class="text-[1.1rem] text-muted dark:text-dk-muted block mb-1">Saldo</span>
                <p class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                  ${{ fmt(calcularTotal(orden.servicios) - orden.anticipo) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Right: cambiar estado -->
          <div>
            <h2
              class="text-[1.1rem] font-semibold text-primary/60 uppercase tracking-[0.15em] mb-5"
            >
              Cambiar estado
            </h2>
            <div class="flex flex-col gap-2">
              <button
                v-for="e in estadosDisponibles"
                :key="e.valor"
                class="flex items-center gap-3 px-5 py-4 text-left text-[1.3rem] font-medium cursor-pointer border transition-colors"
                :class="
                  orden.estado === e.valor
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface dark:bg-dk-surface text-body dark:text-dk-body border-border dark:border-dk-border hover:border-primary/40'
                "
                @click="cambiarEstado(e.valor)"
              >
                <span v-if="orden.estado === e.valor" class="w-2 h-2 rounded-full bg-white"></span>
                <span v-else class="w-2 h-2 rounded-full border border-current opacity-30"></span>
                {{ e.label }}
              </button>
            </div>
          </div>
        </div>
      </main>

      <main v-else class="flex-1 px-12 py-10 flex items-center justify-center">
        <div class="text-center">
          <p class="text-[1.6rem] text-muted dark:text-dk-muted mb-4">Orden no encontrada</p>
          <button
            class="text-[1.3rem] font-medium text-primary cursor-pointer border-none bg-transparent"
            @click="router.push({ name: 'ordenes-lista' })"
          >
            Volver a ordenes
          </button>
        </div>
      </main>
    </div>
  </div>
</template>
