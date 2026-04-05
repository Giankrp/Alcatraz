<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { VaultItem } from '~/types/vault'

definePageMeta({
  layout: 'vault',
  middleware: "auth"
})

const router = useRouter()
const { email, avatarUrl, initials, displayName, avatarColor, logout, fetchUser } = useUser()

useHead({
  title: 'Tu Bóveda',
  meta: [
    { name: 'description', content: 'Gestor de contraseñas y notas cifradas — Bóveda de Alcatraz.' }
  ]
})

const { items, searchQuery, fetchItems, folders, addFolder, updateFolder, deleteFolder } = useVault()

onMounted(() => {
  const { masterPassword } = useMasterPassword()
  if (!masterPassword.value) {
    console.warn("Memoria RAM limpia. Redirigiendo a desbloqueo...")
    navigateTo('/login/unlock')
    return
  }
  fetchItems()
  fetchUser()
})

const navigation = computed(() => [
  {
    label: 'GENERAL',
    links: [
      { label: 'Todos los elementos', icon: 'i-heroicons-squares-2x2', key: 'all' },
      { label: 'Papelera', icon: 'i-heroicons-trash', key: 'trash' }
    ]
  },
  {
    label: 'CATEGORÍAS',
    links: [
      { label: 'Contraseñas', icon: 'i-heroicons-key', key: 'passwords' },
      { label: 'Tarjetas de crédito', icon: 'i-heroicons-credit-card', key: 'cards' },
      { label: 'Notas seguras', icon: 'i-heroicons-document-text', key: 'notes' },
      { label: 'Documentos', icon: 'i-heroicons-document', key: 'documents' },
      { label: 'Identidad', icon: 'i-heroicons-user-circle', key: 'identities' }
    ]
  },
  {
    label: 'Carpetas',
    links: folders.value.map(f => ({
      label: f.name,
      icon: 'i-heroicons-folder',
      key: `folders/${f.id}`
    }))
  }
])

const selected = ref('all')

const selectedLabel = computed(() => {
  for (const group of navigation.value) {
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

    if (s === 'passwords') result = result.filter(i => i.item_type === 'password')
    else if (s === 'cards') result = result.filter(i => i.item_type === 'card')
    else if (s === 'notes') result = result.filter(i => i.item_type === 'note')
    else if (s === 'identities') result = result.filter(i => i.item_type === 'identity')
    else if (s === 'documents') result = result.filter(i => i.item_type === 'document')
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
      (i.item_type === 'password' && (i as any).username?.toLowerCase().includes(q)) ||
      (i.item_type === 'identity' && ((i as any).firstName?.toLowerCase().includes(q) || (i as any).lastName?.toLowerCase().includes(q))) ||
      (i.item_type === 'card' && (i as any).holder?.toLowerCase().includes(q)) ||
      (i.item_type === 'document' && (i as any).fileName?.toLowerCase().includes(q))
    )
  }

  return result
})

// Dashboard Stats
const totalItems = computed(() => items.value.length)
const passwordCount = computed(() => items.value.filter(i => i.item_type === 'password').length)
const cardCount = computed(() => items.value.filter(i => i.item_type === 'card').length)
const noteCount = computed(() => items.value.filter(i => i.item_type === 'note').length)
const identityCount = computed(() => items.value.filter(i => i.item_type === 'identity').length)
const documentCount = computed(() => items.value.filter(i => i.item_type === 'document').length)

// Very basic health score for now (0-100)
// Higher score if they have many items and some unique ones
const securityHealth = computed(() => {
  if (items.value.length === 0) return 0
  const passItems = items.value.filter(i => i.item_type === 'password')
  if (passItems.length === 0) return 100 // No passwords = no risks yet?
  return Math.min(100, (passItems.length * 5) + 40)
})

function getSubtitle(item: VaultItem) {
  if (item.item_type === 'password') return (item as any).username || 'Usuario cifrado'
  if (item.item_type === 'card') return (item as any).number ? `•••• ${(item as any).number.slice(-4)}` : 'Tarjeta cifrada'
  if (item.item_type === 'identity') return (item as any).email || 'Identidad cifrada'
  if (item.item_type === 'note') return 'Nota segura'
  if (item.item_type === 'document') return (item as any).fileName || 'Documento cifrado'
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
    { label: 'Contraseñas', icon: 'i-heroicons-key', active: selected.value === 'passwords', onSelect: () => { selected.value = 'passwords' } },
    { label: 'Tarjetas de crédito', icon: 'i-heroicons-credit-card', active: selected.value === 'cards', onSelect: () => { selected.value = 'cards' } },
    { label: 'Notas seguras', icon: 'i-heroicons-document-text', active: selected.value === 'notes', onSelect: () => { selected.value = 'notes' } },
    { label: 'Documentos', icon: 'i-heroicons-document', active: selected.value === 'documents', onSelect: () => { selected.value = 'documents' } },
    { label: 'Identidad', icon: 'i-heroicons-user-circle', active: selected.value === 'identities', onSelect: () => { selected.value = 'identities' } }
  ],
  folders.value.map(f => ({
    label: f.name,
    icon: 'i-heroicons-folder',
    active: selected.value === `folders/${f.id}`,
    onSelect: () => { selected.value = `folders/${f.id}` }
  })),
  [
    { label: 'Perfil', icon: 'i-heroicons-user', onSelect: () => { router.push('/boveda/perfil') } }
  ]
])

// Folder management state
const isFoldersModalOpen = ref(false)
const newFolderName = ref('')
const editingFolderId = ref<string | null>(null)
const editingFolderName = ref('')
const isFolderActionLoading = ref(false)

const toast = useToast()

const handleCreateFolder = async () => {
  if (!newFolderName.value.trim()) return
  isFolderActionLoading.value = true
  try {
    await addFolder(newFolderName.value)
    newFolderName.value = ''
    toast.add({ title: 'Carpeta creada', color: 'success' })
  } catch (e) {
    toast.add({ title: 'Error al crear carpeta', color: 'error' })
  } finally {
    isFolderActionLoading.value = false
  }
}

const startEditingFolder = (folder: any) => {
  editingFolderId.value = folder.id
  editingFolderName.value = folder.name
}

const handleUpdateFolder = async () => {
  if (!editingFolderId.value || !editingFolderName.value.trim()) return
  isFolderActionLoading.value = true
  try {
    await updateFolder(editingFolderId.value, editingFolderName.value)
    editingFolderId.value = null
    toast.add({ title: 'Carpeta actualizada', color: 'success' })
  } catch (e) {
    toast.add({ title: 'Error al actualizar carpeta', color: 'error' })
  } finally {
    isFolderActionLoading.value = false
  }
}

const handleDeleteFolder = async (id: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta carpeta? Los elementos se moverán a Personal.')) {
    isFolderActionLoading.value = true
    try {
      await deleteFolder(id)
      if (selected.value === `folders/${id}`) {
        selected.value = 'all'
      }
      toast.add({ title: 'Carpeta eliminada', color: 'success' })
    } catch (e) {
      toast.add({ title: 'Error al eliminar carpeta', color: 'error' })
    } finally {
      isFolderActionLoading.value = false
    }
  }
}

</script>

<template>
  <div class="min-h-screen vault-bg text-white font-sans selection:bg-primary-500/30">
    <UDashboardGroup unit="rem">
      <UDashboardSidebar v-model:open="open" v-model:collapsed="collapsed" :resizable="isDesktop"
        :collapsible="isDesktop" :collapsed-size="4" class="sidebar-glass border-r border-white/5"
        :ui="{ content: 'bg-transparent' }">
        <template #header="{ collapsed: isCollapsed, collapse }">
          <div class="relative flex items-center w-full py-4"
            :class="isCollapsed ? 'justify-center' : 'justify-between px-4'">
            <div v-if="!isCollapsed" class="flex items-center gap-3 min-w-0 pr-2">
              <div
                class="size-10 rounded-2xl  from-gray-900 to-black text-white grid place-items-center border border-white/10 shadow-lg shrink-0">
                <UIcon name="i-heroicons-lock-closed" class="size-6 text-primary-400" />
              </div>
              <div class="flex flex-col">
                <span class="font-bold text-base tracking-tight leading-none">Alcatraz</span>
                <span class="text-[10px] text-gray-500 uppercase tracking-wider font-medium mt-1">Bóveda Segura</span>
              </div>
            </div>

            <UButton v-if="isDesktop" class="collapse-btn hover:bg-white/5 transition-colors"
              :class="isCollapsed ? 'relative' : ''" variant="ghost" color="neutral" size="sm"
              :aria-expanded="!isCollapsed"
              :aria-label="isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'"
              @click="collapse?.(!isCollapsed)">
              <span class="sr-only">{{ isCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral' }}</span>
              <UIcon :name="isCollapsed ? 'i-heroicons-chevron-double-right' : 'i-heroicons-chevron-double-left'"
                class="size-5 text-gray-400" />
            </UButton>
          </div>
        </template>

        <UNavigationMenu color="neutral" orientation="vertical" :collapsed="collapsed" highlight :items="menuItems"
          class="px-2" :ui="{
            viewportWrapper: 'space-y-1'
          }" />

        <!-- Manage Folders Button -->
        <div v-if="!collapsed" class="px-4 pt-2">
          <UButton icon="i-heroicons-folder-plus" label="Gestionar carpetas" color="neutral" variant="ghost" block
            class="justify-start text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-xs"
            @click="isFoldersModalOpen = true" />
        </div>
        <div v-else class="flex justify-center pt-2">
          <UButton icon="i-heroicons-folder-plus" color="neutral" variant="ghost" size="xs"
            class="text-gray-400 hover:text-white" @click="isFoldersModalOpen = true" />
        </div>

        <template #footer="{ collapsed: isCollapsed }">
          <div class="border-t border-white/5">
            <!-- Settings and User info -->
            <div v-if="!isCollapsed" class="px-3 pt-4 pb-2">
              <NuxtLink to="/boveda/perfil" class="flex items-center gap-3 p-2 text-gray-500 hover:text-gray-300 transition-colors mb-2">
                <UIcon name="i-heroicons-cog-6-tooth" class="size-4" />
                <span class="text-xs font-bold tracking-widest uppercase">Settings</span>
              </NuxtLink>
              
              <div class="flex items-center gap-3 p-2 rounded-xl bg-black border border-white/5 transition-colors group">
                <div
                  class="size-8 rounded flex items-center justify-center text-[10px] font-bold shrink-0 border border-[#10b981]/30 transition-colors overflow-hidden text-white"
                  :style="{ background: avatarUrl ? 'black' : avatarColor }">
                  <img v-if="avatarUrl" :src="avatarUrl" class="size-full object-cover" />
                  <template v-else>{{ initials }}</template>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-xs truncate font-bold text-white tracking-tight leading-none mb-1">{{ displayName }}</div>
                  <div class="text-[9px] text-zinc-600 font-bold uppercase tracking-wider">Admin Session</div>
                </div>
              </div>
            </div>
            <div v-else class="flex flex-col items-center gap-4 pt-4 pb-2">
               <UIcon name="i-heroicons-cog-6-tooth" class="size-4 text-gray-500 hover:text-gray-300" />
               <div
                  class="size-8 rounded flex items-center justify-center text-[10px] font-bold border border-[#10b981]/30 overflow-hidden text-white"
                  :style="{ background: avatarColor }">
                  {{ initials }}
                </div>
            </div>

            <!-- Logout -->
            <div class="px-3 pb-4 pt-1">
              <UButton icon="i-heroicons-arrow-right-start-on-rectangle"
                :label="isCollapsed ? undefined : 'Cerrar sesión'" color="neutral" variant="ghost" block :class="[
                  'text-gray-400 cursor-pointer hover:text-red-400 hover:bg-red-500/10 transition-all duration-200',
                  isCollapsed ? 'justify-center' : ''
                ]" @click="logout" />
            </div>
          </div>
        </template>
      </UDashboardSidebar>

      <UDashboardPanel>
        <template #header>
          <UDashboardNavbar :title="selectedLabel"
            class="bg-black/20! border-b! border-white/5! backdrop-blur-md z-50">
            <template #leading>
              <UDashboardSidebarToggle />
            </template>
          </UDashboardNavbar>
        </template>
        <div class="px-4 md:px-8 pt-8 pb-4 overflow-y-auto min-h-full bg-black" style="scrollbar-gutter: stable;">
          <!-- Dashboard Hero Header -->
          <div v-if="selected === 'all'" class="mb-8">
            <div class="flex flex-col lg:flex-row gap-4 items-stretch">
              <!-- Security Score Widget -->
              <div
                class="lg:w-[40%] p-6 rounded-2xl bg-[#000000] border border-zinc-900 shadow-2xl relative overflow-hidden group">
                <div class="relative z-10 flex flex-col h-full justify-between gap-4">
                  <div class="flex items-center justify-between">
                    <span class="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">ESTADO DE SEGURIDAD</span>
                    <UIcon name="i-heroicons-shield-check" class="size-4 text-[#10b981]" />
                  </div>
                  
                  <div class="flex items-end gap-4">
                    <span class="text-6xl font-black tracking-tighter text-white">100%</span>
                    <div class="mb-2">
                      <div class="px-2 py-0.5 bg-[#10b981]/10 border border-[#10b981]/30 rounded text-[9px] font-bold text-[#10b981] uppercase tracking-wider">OPTIMIZADO</div>
                    </div>
                  </div>
                  
                  <p class="text-[11px] text-zinc-600 font-medium leading-tight max-w-sm">
                    Protocolos de cifrado activos y validados.
                  </p>
                </div>
              </div>

              <!-- Quick Stats Grid -->
              <div class="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div v-for="stat in [
                  { label: 'Passwords', count: passwordCount, icon: 'i-heroicons-key' },
                  { label: 'Tarjetas', count: cardCount, icon: 'i-heroicons-credit-card' },
                  { label: 'Notas', count: noteCount, icon: 'i-heroicons-document-text' },
                  { label: 'Archivos', count: documentCount, icon: 'i-heroicons-document' }
                ]" :key="stat.label" 
                  class="p-4 rounded-xl bg-[#000000] border border-zinc-900 hover:border-[#10b981]/30 transition-all duration-300 group cursor-pointer flex flex-col justify-between">
                  <UIcon :name="stat.icon" class="size-4 text-zinc-700 transition-colors group-hover:text-[#10b981] mb-3" />
                  <div>
                    <div class="text-2xl font-bold text-white mb-0.5">{{ stat.count }}</div>
                    <div class="text-[9px] font-bold text-zinc-700 uppercase tracking-widest group-hover:text-zinc-500 transition-colors truncate">{{ stat.label }}</div>
                  </div>
                </div>

                <!-- Last Trashed -->
                <div
                  class="p-4 rounded-xl bg-[#000000] border border-zinc-900 border-dashed flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-zinc-950 transition-colors col-span-full"
                  @click="selected = 'trash'">
                  <div class="flex items-center gap-2">
                    <UIcon name="i-heroicons-trash"
                      class="size-4 text-zinc-700 group-hover:text-red-500 transition-colors" />
                    <span class="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.2em] group-hover:text-zinc-400 transition-colors">PAPELERA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Toolbar -->
          <div
            class="flex flex-col sm:flex-row gap-6 mb-6 justify-between items-start sm:items-center sticky top-0 z-40 py-2 -mt-2 bg-black/60 backdrop-blur-xl">
            <!-- Search Input -->
            <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" variant="none"
              placeholder="BUSCAR EN LA BÓVEDA..." class="w-full sm:w-80"
              :ui="{ base: 'bg-transparent text-xs font-bold tracking-widest text-zinc-400 focus:text-white transition-colors uppercase' }" autocomplete="off" />

            <!-- Create Button Redesigned -->
            <UButton to="/boveda/new" icon="i-heroicons-plus" variant="outline"
              class="w-full sm:w-auto px-6 py-2.5 border-[#10b981]/30 hover:bg-[#10b981]/10 transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
              :ui="{ base: 'text-[#10b981] font-black uppercase tracking-[0.2em] text-[10px]' }">
              NUEVO ELEMENTO
            </UButton>
          </div>

          <div class="card-grid relative">
            <TransitionGroup appear enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-4 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition-all duration-200 ease-in absolute w-full"
              leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95"
              move-class="transition-all duration-300 ease-in-out">
              <div v-for="i in filteredItems" :key="i.id"
                class="group relative flex flex-col p-6 rounded-2xl bg-[#000000] border border-zinc-900 transition-all duration-300 hover:border-[#10b981]/40 hover:-translate-y-1 cursor-pointer"
                @click="router.push(`/boveda/${i.id}`)">
                <!-- Card Header -->
                <div class="flex justify-between items-start mb-8">
                  <div
                    class="relative size-12 rounded-xl bg-zinc-900/30 flex items-center justify-center group-hover:bg-[#10b981]/10 transition-all duration-300">
                    <UIcon :name="i.icon" class="size-5 text-[#10b981]" />
                  </div>
                  <div
                    class="px-2.5 py-1 rounded bg-[#000000] border border-zinc-800 text-[9px] uppercase tracking-widest font-black text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    {{ i.item_type }}
                  </div>
                </div>

                <!-- Card Content -->
                <div class="mb-4">
                  <h3 class="text-base font-bold text-white mb-2 tracking-tight group-hover:text-[#10b981] transition-colors leading-none truncate">{{
                    i.title
                    }}</h3>
                  <div
                    class="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-wider group-hover:text-zinc-500 transition-colors">
                    <UIcon name="i-heroicons-user" class="size-3" />
                    <span class="truncate">{{ getSubtitle(i) }}</span>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>


      </UDashboardPanel>
    </UDashboardGroup>

    <!-- Folder Management Modal -->
    <UModal v-model:open="isFoldersModalOpen">
      <template #content>
        <div class="p-6 bg-[#050505] border border-white/10 rounded-2xl shadow-2xl">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <UIcon name="i-heroicons-folder" class="text-primary-400" />
              Gestionar Carpetas
            </h3>
            <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" @click="isFoldersModalOpen = false" />
          </div>

          <!-- Add new folder -->
          <div class="flex items-end gap-2 mb-8">
            <UFormGroup label="Nueva carpeta" class="flex-1" :ui="{ label: 'text-xs text-gray-500' }">
              <UInput v-model="newFolderName" placeholder="Nombre de la carpeta" @keyup.enter="handleCreateFolder"
                variant="none" class="bg-white/5 rounded-lg border border-white/10 focus-within:border-white/20" />
            </UFormGroup>
            <UButton icon="i-heroicons-plus" color="neutral" :loading="isFolderActionLoading"
              @click="handleCreateFolder">
              Añadir
            </UButton>
          </div>

          <!-- Folders list -->
          <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
            <div v-for="folder in folders" :key="folder.id"
              class="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5 group">

              <div v-if="editingFolderId === folder.id" class="flex items-center gap-2 flex-1 mr-2">
                <UInput v-model="editingFolderName" size="sm" class="flex-1" @keyup.enter="handleUpdateFolder"
                  autofocus />
                <UButton icon="i-heroicons-check" color="success" variant="ghost" size="xs"
                  @click="handleUpdateFolder" />
                <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="xs"
                  @click="editingFolderId = null" />
              </div>

              <template v-else>
                <div class="flex items-center gap-3">
                  <UIcon name="i-heroicons-folder" class="size-4 text-gray-500" />
                  <span class="text-sm font-medium">{{ folder.name }}</span>
                  <span v-if="folder.is_default"
                    class="text-[9px] uppercase tracking-widest text-primary-400 font-bold border border-primary-400/20 px-1.5 py-0.5 rounded">Default</span>
                </div>

                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <UButton icon="i-heroicons-pencil" color="neutral" variant="ghost" size="xs"
                    @click="startEditingFolder(folder)" />
                  <UButton v-if="!folder.is_default" icon="i-heroicons-trash" color="error" variant="ghost" size="xs"
                    @click="handleDeleteFolder(folder.id)" />
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </UModal>

  </div>
</template>

<style scoped>
.vault-bg {
  background-color: #000000;
}

.sidebar-glass {
  background: rgba(9, 9, 11, 0.6);
  backdrop-filter: blur(16px);
}

:deep(.u-navigation-menu-link) {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #52525b; /* zinc-600 */
  border-left: 2px solid transparent;
  border-bottom: none !important;
  border-radius: 0 !important;
  padding-left: 1.5rem !important;
  transition: all 0.3s ease;
}

:deep(.u-navigation-menu-link-active) {
  color: #10b981 !important;
  background: transparent !important;
  border-left: 3px solid #10b981 !important;
}

:deep(.u-navigation-menu-link-active .u-navigation-menu-link-icon) {
  color: #10b981 !important;
}

:deep(.u-navigation-menu-label) {
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.2em;
  color: #27272a; /* zinc-800 */
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.5rem;
  }
}

@media (min-width: 1280px) {
  .card-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.5rem;
  }
}
</style>
