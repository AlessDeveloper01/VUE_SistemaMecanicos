<script setup lang="ts">
defineProps<{
  id: string
  title: string
  subtitle: string
  mechanic: string
  time: string
  status: 'proceso' | 'pendiente' | 'completado'
}>()

const statusColor = {
  proceso: 'bg-blue-400',
  pendiente: 'bg-amber-400',
  completado: 'bg-emerald-400',
} as const
</script>

<template>
  <div class="py-5 border-b border-border/60 dark:border-dk-border/60 last:border-b-0">
    <div class="flex items-center gap-3 mb-2">
      <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="statusColor[status]"></span>
      <span class="text-[1.1rem] text-muted dark:text-dk-muted font-medium">{{ id }}</span>
    </div>
    <p class="text-[1.4rem] font-medium text-body dark:text-dk-body mb-0.5">{{ title }}</p>
    <p class="text-[1.1rem] text-muted dark:text-dk-muted mb-3">{{ subtitle }}</p>
    <div class="flex items-center gap-6 text-[1.1rem] text-muted dark:text-dk-muted">
      <span>{{ time }}</span>
      <span>{{ mechanic }}</span>
    </div>
  </div>
</template>
