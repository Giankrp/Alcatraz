<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { VaultItem } from '~/types/vault'

definePageMeta({
  layout: 'vault'
})

const router = useRouter()

useHead({
  title: 'Tu Bóveda',
  meta: [
    { name: 'description', content: 'Gestor de contraseñas y notas cifradas — Bóveda de Alcatraz.' }
  ]
})

const { items, searchQuery } = useVault()

const navigation = [
  {
    label: 'Bóveda',
    links: [
      { label: 'Todos los elementos', icon: 'i-heroicons-squares-2x2', key: 'all' },
      { label: 'Papelera', icon: 'i-heroicons-trash', key: 'trash' }
    ]
  },
  {
    label: 'Tipos',
    links: [
      { label: 'Tarjetas de crédito', icon: 'i-heroicons-credit-card', key: 'cards' },
      { label: 'Notas seguras', icon: 'i-heroicons-document-text', key: 'notes' },
      { label: 'Documentos', icon: 'i-heroicons-document', key: 'documents' },
      { label: 'Datos personales', icon: 'i-heroicons-user-circle', key: 'identities' }
    ]
  },
  {
    label: 'Carpetas',
    links: [
      { label: 'Trabajo', icon: 'i-heroicons-folder', key: 'folders/work' },
      { label: 'Personal', icon: 'i-heroicons-folder', key: 'folders/personal' }
    ]
  }
]

const selected = ref('all')

const selectedLabel = computed(() => {
  for (const group of navigation) {
    const found = group.links.find(l => l.key === selected.value)
    if (found) return found.label
  }
  return 'Todos los elementos'
})

const filteredItems = computed(() => {
  const s = selected.value
  let result = items.value

  // 1. Filter by category/folder
  if (s === 'trash') {
    result = result.filter(i => i.trashed)
  } else {
    result = result.filter(i => !i.trashed) // Base filter for non-trash
    
    if (s === 'cards') result = result.filter(i => i.type === 'card')
    else if (s === 'notes') result = result.filter(i => i.type === 'note')
    else if (s === 'identities') result = result.filter(i => i.type === 'identity')
    else if (s.startsWith('folders/')) {
      const folder = s.split('/')[1]
      result = result.filter(i => i.folder === folder)
    }
  }

  // 2. Filter by search query
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(i => 
      i.title.toLowerCase().includes(q) || 
      (i.type === 'password' && i.username.toLowerCase().includes(q)) ||
      (i.type === 'identity' && (i.firstName.toLowerCase().includes(q) || i.lastName.toLowerCase().includes(q))) ||
      (i.type === 'card' && i.holder.toLowerCase().includes(q))
    )
  }

  return result
})

function getSubtitle(item: VaultItem) {
  if (item.type === 'password') return item.username
  if (item.type === 'card') return item.number
  if (item.type === 'identity') return item.email
  if (item.type === 'note') return 'Nota segura'
  return '...'
}

const open = ref(false)
const collapsed = ref(false)
const isDesktop = ref(false)

const toggleIcon = computed(() => {
  if (isDesktop.value) return collapsed.value ? 'i-heroicons-chevron-double-right' : 'i-heroicons-chevron-double-left'
  return open.value ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'
})

const toggleLabel = computed(() => {
  if (isDesktop.value) return collapsed.value ? 'Expandir barra lateral' : 'Colapsar barra lateral'
  return open.value ? 'Ocultar barra lateral' : 'Mostrar barra lateral'
})

function toggleSidebar() {
  if (isDesktop.value) {
    collapsed.value = !collapsed.value
    return
  }
  open.value = !open.value
}

const STORAGE_OPEN_KEY = 'alcatraz:vault-sidebar-open'
const STORAGE_COLLAPSED_KEY = 'alcatraz:vault-sidebar-collapsed'

function readStoredBool(key: string, fallback: boolean) {
  if (typeof window === 'undefined') return fallback
  const raw = window.localStorage.getItem(key)
  if (raw === null) return fallback
  return raw === 'true'
}

function writeStoredBool(key: string, value: boolean) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(key, String(value))
}

let mediaQuery: MediaQueryList | null = null
let onMediaChange: ((e: MediaQueryListEvent) => void) | null = null

onMounted(() => {
  if (typeof window === 'undefined') return

  mediaQuery = window.matchMedia('(min-width: 1024px)')
  const applyDesktop = (matches: boolean) => {
    isDesktop.value = matches
    if (matches) {
      open.value = false
      return
    }
    open.value = readStoredBool(STORAGE_OPEN_KEY, false)
  }

  applyDesktop(mediaQuery.matches)

  collapsed.value = readStoredBool(STORAGE_COLLAPSED_KEY, false)

  onMediaChange = (e) => applyDesktop(e.matches)
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', onMediaChange)
  }
  else if (mediaQuery.addListener) {
    mediaQuery.addListener(onMediaChange)
  }
})

onBeforeUnmount(() => {
  if (!mediaQuery || !onMediaChange) return
  if (mediaQuery.removeEventListener) {
    mediaQuery.removeEventListener('change', onMediaChange)
  }
  else if (mediaQuery.removeListener) {
    mediaQuery.removeListener(onMediaChange)
  }
})

watch(open, (v) => {
  if (isDesktop.value) return
  writeStoredBool(STORAGE_OPEN_KEY, v)
})

watch(collapsed, (v) => {
  writeStoredBool(STORAGE_COLLAPSED_KEY, v)
})
const menuItems = computed<NavigationMenuItem[][]>(() => [
  [
    { label: 'Todos los elementos', icon: 'i-heroicons-squares-2x2', active: selected.value === 'all', onSelect: () => { selected.value = 'all' } },
    { label: 'Papelera', icon: 'i-heroicons-trash', active: selected.value === 'trash', onSelect: () => { selected.value = 'trash' } }
  ],
  [
    { label: 'Tarjetas de crédito', icon: 'i-heroicons-credit-card', active: selected.value === 'cards', onSelect: () => { selected.value = 'cards' } },
    { label: 'Notas seguras', icon: 'i-heroicons-document-text', active: selected.value === 'notes', onSelect: () => { selected.value = 'notes' } },
    { label: 'Datos personales', icon: 'i-heroicons-user-circle', active: selected.value === 'identities', onSelect: () => { selected.value = 'identities' } }
  ],
  [
    { label: 'Trabajo', icon: 'i-heroicons-folder', active: selected.value === 'folders/work', onSelect: () => { selected.value = 'folders/work' } },
    { label: 'Personal', icon: 'i-heroicons-folder', active: selected.value === 'folders/personal', onSelect: () => { selected.value = 'folders/personal' } }
  ]
])
</script>

<template>
  <div class="min-h-screen vault-bg text-white font-sans selection:bg-primary-500/30">
    <UDashboardGroup unit="rem">
      <UDashboardSidebar
        v-model:open="open"
        v-model:collapsed="collapsed"
        :resizable="isDesktop"
        :collapsible="isDesktop"
        :collapsed-size="4"
        class="sidebar-glass border-r border-white/5"
        :ui="{ content: 'bg-transparent' }"
      >
        <template #header="{ collapsed: isCollapsed, collapse }">
          <div class="relative flex items-center w-full py-4" :class="isCollapsed ? 'justify-center' : 'justify-between px-4'">
            <div v-if="!isCollapsed" class="flex items-center gap-3 min-w-0 pr-2">
              <div class="size-10 rounded-2xl  from-gray-900 to-black text-white grid place-items-center border border-white/10 shadow-lg shrink-0">
                <UIcon name="i-heroicons-lock-closed" class="size-6 text-primary-400" />
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-base tracking-tight leading-none">Alcatraz</span>
                <span class="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-1">Bóveda Segura</span>
              </div>
            </div>
            
            <UButton
              v-if="isDesktop"
              class="collapse-btn hover:bg-white/5 transition-colors"
              :class="isCollapsed ? 'relative' : ''"
              variant="ghost"
              color="neutral"
              size="sm"
              :aria-expanded="!isCollapsed"
              :aria-label="isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'"
              @click="collapse?.(!isCollapsed)"
            >
              <span class="sr-only">{{ isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral' }}</span>
              <UIcon :name="isCollapsed ? 'i-heroicons-chevron-double-right' : 'i-heroicons-chevron-double-left'" class="size-5 text-gray-400" />
            </UButton>
          </div>
        </template>

        <UNavigationMenu
          color="neutral"
          orientation="vertical"
          :collapsed="collapsed"
          highlight
          :items="menuItems"
          class="px-2"
          :ui="{
            viewportWrapper: 'space-y-2'
          }"
        />
      </UDashboardSidebar>

      <UDashboardPanel>
        <template #header>
          <UDashboardNavbar :title="selectedLabel" class="bg-transparent! border-b! border-white/5! backdrop-blur-sm z-50">
            <template #leading>
              <UDashboardSidebarToggle />
            </template>
          </UDashboardNavbar>
        </template>
        <div class="p-4 md:p-8 pb-24 overflow-y-auto min-h-full" style="scrollbar-gutter: stable;">
          <!-- Toolbar -->
          <div class="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center sticky top-0 z-40 py-2 -mt-2">
             <!-- Search Input -->
             <UInput
               v-model="searchQuery"
               icon="i-heroicons-magnifying-glass"
               variant="outline"
               placeholder="Buscar en la bóveda..."
               class="w-full sm:w-72  backdrop-blur-md"
               :ui="{ trailingIcon:'',base:'bg-black' }"
               autocomplete="off"
             />

             <!-- Create Button -->
             <UButton 
               to="/boveda/new"
               icon="i-heroicons-plus"
              
               variant="solid"
               class="w-full sm:w-auto border border-white/10"
               size="md"
               :ui="{ base:'bg-white/5 text-white hover:bg-white/10 transition-colors' }"
             >
               Nuevo Elemento
             </UButton>
          </div>

          <div class="card-grid relative">
            <TransitionGroup 
              appear
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-4 scale-95"
              enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition-all duration-200 ease-in absolute w-full"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
              move-class="transition-all duration-300 ease-in-out"
            >
              <div 
                v-for="i in filteredItems" 
                :key="i.id" 
                class="group relative flex flex-col p-5 rounded-3xl card-glass transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                @click="router.push(`/boveda/${i.id}`)"
              >
                <!-- Card Header -->
                <div class="flex justify-between items-start mb-5">
                  <div class="relative">
                    <div class="absolute inset-0 bg-white/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="relative size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                      <UIcon :name="i.icon" class="size-6 text-gray-300 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div class="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                    {{ i.type }}
                  </div>
                </div>

                <!-- Card Content -->
                <div class="mb-6">
                  <h3 class="text-lg font-semibold text-white mb-1 group-hover:text-primary-200 transition-colors">{{ i.title }}</h3>
                  <div class="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                    <UIcon name="i-heroicons-user" class="size-3.5" />
                    <span class="truncate">{{ getSubtitle(i) }}</span>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
       
       
      </UDashboardPanel>
    </UDashboardGroup>
  
  </div>
</template>

<style scoped>
.vault-bg {
  background-color: #020202;
  background-image: 
    radial-gradient(circle at 0% 0%, rgba(30, 41, 59, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 100% 0%, rgba(15, 23, 42, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 50% 100%, rgba(30, 41, 59, 0.2) 0%, transparent 50%);
}

.sidebar-glass {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(20px);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.25rem;
}
@media (min-width: 640px) { .card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .card-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; } }
@media (min-width: 1280px) { .card-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.75rem; } }

.card-glass {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.2), 0 8px 20px rgba(0,0,0,0.4);
  will-change: transform, opacity;
  backface-visibility: hidden;
}

.card-glass:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.6);
}
</style>
