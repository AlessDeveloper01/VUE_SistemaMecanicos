<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useInventarioStore, getEstadoStock, type EstadoStock } from '@/stores/inventario'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'

const router = useRouter()
const route = useRoute()
const store = useInventarioStore()

const collapsed = inject<Ref<boolean>>('sidebarCollapsed')!
const darkMode = inject<Ref<boolean>>('darkMode')!

const item = computed(() => store.obtenerPorId(route.params.id as string))
const ajusteStock = ref(1)

const estadoConfig: Record<EstadoStock, { label: string; clase: string }> = {
  critico: {
    label: 'Critico',
    clase: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  },
  bajo: {
    label: 'Bajo',
    clase: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  },
  normal: {
    label: 'Normal',
    clase: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  },
}

function confirmarEliminar() {
  if (item.value && confirm(`Eliminar "${item.value.nombre}"?`)) {
    store.eliminar(item.value.id)
    router.push({ name: 'inventario-lista' })
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

      <main v-if="item" class="flex-1 px-12 py-10 max-[768px]:px-5 max-[768px]:py-6">
        <div
          class="flex items-center justify-between mb-10 max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-4"
        >
          <div class="flex items-center gap-4">
            <button
              class="w-9 h-9 flex items-center justify-center text-muted dark:text-dk-muted hover:text-body dark:hover:text-dk-body cursor-pointer border-none bg-transparent transition-colors"
              @click="router.push({ name: 'inventario-lista' })"
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
            <div>
              <h1
                class="text-[2.4rem] font-light text-body dark:text-dk-body tracking-[-0.02em] leading-none"
              >
                {{ item.nombre }}
              </h1>
              <p class="text-[1.2rem] text-muted dark:text-dk-muted font-mono">
                {{ item.sku }} — {{ item.categoria }}
              </p>
            </div>
            <span
              class="text-[1.1rem] font-medium px-3 py-1 rounded-full"
              :class="estadoConfig[getEstadoStock(item)].clase"
              >{{ estadoConfig[getEstadoStock(item)].label }}</span
            >
          </div>
          <div class="flex items-center gap-3">
            <button
              class="px-5 py-2.5 text-[1.2rem] font-medium text-primary border border-primary/30 bg-transparent cursor-pointer hover:bg-primary hover:text-white transition-colors"
              @click="router.push({ name: 'inventario-editar', params: { id: item.id } })"
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

        <div class="grid grid-cols-2 gap-10 max-[1200px]:grid-cols-1">
          <!-- Left -->
          <div class="flex flex-col gap-10">
            <section
              class="bg-surface dark:bg-dk-surface border border-border dark:border-dk-border"
            >
              <header class="px-8 py-6 border-b border-border dark:border-dk-border">
                <h2 class="text-[1.5rem] font-bold text-body dark:text-dk-body">Informacion</h2>
              </header>
              <div class="p-8">
                <dl class="grid grid-cols-2 gap-6">
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      SKU
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body font-mono">
                      {{ item.sku }}
                    </dd>
                  </div>
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Categoria
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ item.categoria }}
                    </dd>
                  </div>
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Proveedor
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ item.proveedor || '—' }}
                    </dd>
                  </div>
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Ubicacion
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ item.ubicacion || '—' }}
                    </dd>
                  </div>
                  <div>
                    <dt
                      class="text-[1.1rem] text-muted dark:text-dk-muted uppercase tracking-wider mb-1"
                    >
                      Unidad
                    </dt>
                    <dd class="text-[1.4rem] font-medium text-body dark:text-dk-body">
                      {{ item.unidad }}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <section
              v-if="item.notas"
              class="bg-surface dark:bg-dk-surface border border-border dark:border-dk-border"
            >
              <header class="px-8 py-6 border-b border-border dark:border-dk-border">
                <h2 class="text-[1.5rem] font-bold text-body dark:text-dk-body">Notas</h2>
              </header>
              <div class="p-8">
                <p class="text-[1.4rem] text-body dark:text-dk-body leading-relaxed">
                  {{ item.notas }}
                </p>
              </div>
            </section>
          </div>

          <!-- Right -->
          <div class="flex flex-col gap-10">
            <!-- Stock -->
            <section
              class="bg-surface dark:bg-dk-surface border border-border dark:border-dk-border"
            >
              <header class="px-8 py-6 border-b border-border dark:border-dk-border">
                <h2 class="text-[1.5rem] font-bold text-body dark:text-dk-body">Stock</h2>
              </header>
              <div class="p-8">
                <div class="flex items-baseline gap-3 mb-6">
                  <span
                    class="text-[4rem] font-light text-body dark:text-dk-body leading-none"
                    :class="
                      getEstadoStock(item) === 'critico'
                        ? 'text-red-500'
                        : getEstadoStock(item) === 'bajo'
                          ? 'text-amber-500'
                          : ''
                    "
                    >{{ item.stock }}</span
                  >
                  <span class="text-[1.4rem] text-muted dark:text-dk-muted"
                    >/ {{ item.stockMinimo }} minimo ({{ item.unidad }})</span
                  >
                </div>
                <div class="flex items-center gap-3">
                  <button
                    class="px-4 py-2 text-[1.3rem] font-semibold text-white bg-red-500 border-none cursor-pointer hover:opacity-90 transition-opacity"
                    @click="store.ajustarStock(item.id, -ajusteStock)"
                  >
                    -{{ ajusteStock }}
                  </button>
                  <input
                    v-model.number="ajusteStock"
                    type="number"
                    min="1"
                    class="w-20 px-3 py-2 text-center text-[1.4rem] text-body dark:text-dk-body bg-bg dark:bg-dk-bg border border-border dark:border-dk-border outline-none focus:border-primary transition-colors"
                  />
                  <button
                    class="px-4 py-2 text-[1.3rem] font-semibold text-white bg-emerald-500 border-none cursor-pointer hover:opacity-90 transition-opacity"
                    @click="store.ajustarStock(item.id, ajusteStock)"
                  >
                    +{{ ajusteStock }}
                  </button>
                </div>
              </div>
            </section>

            <!-- Precios -->
            <section
              class="bg-surface dark:bg-dk-surface border border-border dark:border-dk-border"
            >
              <header class="px-8 py-6 border-b border-border dark:border-dk-border">
                <h2 class="text-[1.5rem] font-bold text-body dark:text-dk-body">Precios</h2>
              </header>
              <div class="p-8">
                <dl class="flex flex-col gap-4">
                  <div
                    class="flex justify-between items-center py-3 border-b border-border/60 dark:border-dk-border/60"
                  >
                    <dt class="text-[1.2rem] text-muted dark:text-dk-muted">Precio compra</dt>
                    <dd class="text-[1.4rem] font-semibold text-body dark:text-dk-body">
                      ${{ fmt(item.precioCompra) }}
                    </dd>
                  </div>
                  <div
                    class="flex justify-between items-center py-3 border-b border-border/60 dark:border-dk-border/60"
                  >
                    <dt class="text-[1.2rem] text-muted dark:text-dk-muted">Precio venta</dt>
                    <dd class="text-[1.4rem] font-semibold text-primary">
                      ${{ fmt(item.precioVenta) }}
                    </dd>
                  </div>
                  <div
                    class="flex justify-between items-center py-3 border-b border-border/60 dark:border-dk-border/60"
                  >
                    <dt class="text-[1.2rem] text-muted dark:text-dk-muted">Margen</dt>
                    <dd class="text-[1.4rem] font-semibold text-emerald-500">
                      {{
                        item.precioCompra > 0
                          ? (
                              ((item.precioVenta - item.precioCompra) / item.precioCompra) *
                              100
                            ).toFixed(0) + '%'
                          : '—'
                      }}
                    </dd>
                  </div>
                  <div
                    class="flex justify-between items-center py-3 border-b border-border/60 dark:border-dk-border/60"
                  >
                    <dt class="text-[1.2rem] text-muted dark:text-dk-muted">
                      Valor stock (compra)
                    </dt>
                    <dd class="text-[1.4rem] font-semibold text-body dark:text-dk-body">
                      ${{ fmt(item.stock * item.precioCompra) }}
                    </dd>
                  </div>
                  <div class="flex justify-between items-center py-3">
                    <dt class="text-[1.2rem] text-muted dark:text-dk-muted">Valor stock (venta)</dt>
                    <dd class="text-[1.4rem] font-semibold text-primary">
                      ${{ fmt(item.stock * item.precioVenta) }}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>
          </div>
        </div>
      </main>

      <main v-else class="flex-1 px-12 py-10 flex items-center justify-center">
        <div class="text-center">
          <p class="text-[1.6rem] text-muted dark:text-dk-muted mb-4">Articulo no encontrado</p>
          <button
            class="text-[1.3rem] font-medium text-primary cursor-pointer border-none bg-transparent"
            @click="router.push({ name: 'inventario-lista' })"
          >
            Volver a inventario
          </button>
        </div>
      </main>
    </div>
  </div>
</template>
