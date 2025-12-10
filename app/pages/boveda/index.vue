<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
useHead({
  title: 'Tu Bóveda',
  meta: [
    { name: 'description', content: 'Gestor de contraseñas y notas cifradas — Bóveda de Alcatraz.' }
  ]
})

const items = [
  { id: 1, title: 'GitHub', username: 'user@example.com', url: 'https://github.com', icon: 'i-heroicons-code-bracket', type: 'password', folder: 'work', trashed: false },
  { id: 2, title: 'Gmail', username: 'user@example.com', url: 'https://mail.google.com', icon: 'i-heroicons-envelope', type: 'password', folder: 'personal', trashed: false },
  { id: 3, title: 'Banco', username: 'user@bank.com', url: 'https://bank.example', icon: 'i-heroicons-shield-check', type: 'password', folder: 'personal', trashed: false },
  { id: 4, title: 'Visa', username: '**** **** **** 1234', url: 'https://visa.example', icon: 'i-heroicons-credit-card', type: 'card', folder: 'personal', trashed: false },
  { id: 5, title: 'Nota Segura', username: 'Nota confidencial', url: '#', icon: 'i-heroicons-document-text', type: 'note', folder: 'work', trashed: false },
  { id: 6, title: 'DNI PDF', username: 'Documento', url: '#', icon: 'i-heroicons-document', type: 'document', folder: 'personal', trashed: false },
  { id: 7, title: 'Perfil Personal', username: 'Juan Pérez', url: '#', icon: 'i-heroicons-user-circle', type: 'identity', folder: 'personal', trashed: false },
  { id: 8, title: 'Antiguo Twitter', username: '@olduser', url: 'https://twitter.com', icon: 'i-heroicons-hashtag', type: 'password', folder: 'personal', trashed: true }
]

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
  if (s === 'all') return items.filter(i => !i.trashed)
  if (s === 'trash') return items.filter(i => i.trashed)
  if (s === 'cards') return items.filter(i => i.type === 'card' && !i.trashed)
  if (s === 'notes') return items.filter(i => i.type === 'note' && !i.trashed)
  if (s === 'documents') return items.filter(i => i.type === 'document' && !i.trashed)
  if (s === 'identities') return items.filter(i => i.type === 'identity' && !i.trashed)
  if (s.startsWith('folders/')) {
    const folder = s.split('/')[1]
    return items.filter(i => i.folder === folder && !i.trashed)
  }
  return items.filter(i => !i.trashed)
})
const open = ref(true)
const collapsed = ref(false)
const sidebarAnim = ref('')
onMounted(() => {
  const raw = typeof window !== 'undefined' ? window.localStorage.getItem('alcatraz:sidebar-open') : null
  if (raw !== null) {
    open.value = raw === 'true'
  }
  const rawCollapsed = typeof window !== 'undefined' ? window.localStorage.getItem('alcatraz:sidebar-collapsed') : null
  if (rawCollapsed !== null) {
    collapsed.value = rawCollapsed === 'true'
  }
})

watch(open, v => {
  sidebarAnim.value = v ? 'opening' : 'closing'
  setTimeout(() => {
    sidebarAnim.value = ''
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('alcatraz:sidebar-open', String(v))
    }
  }, 300)
})

watch(collapsed, v => {
  sidebarAnim.value = v ? 'closing' : 'opening'
  setTimeout(() => {
    sidebarAnim.value = ''
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('alcatraz:sidebar-collapsed', String(v))
    }
  }, 300)
})
const menuItems = computed<NavigationMenuItem[][]>(() => [
  [
    { label: 'Todos los elementos', icon: 'i-heroicons-squares-2x2', active: selected.value === 'all', onSelect: () => { selected.value = 'all' } },
    { label: 'Papelera', icon: 'i-heroicons-trash', active: selected.value === 'trash', onSelect: () => { selected.value = 'trash' } }
  ],
  [
    { label: 'Tarjetas de crédito', icon: 'i-heroicons-credit-card', active: selected.value === 'cards', onSelect: () => { selected.value = 'cards' } },
    { label: 'Notas seguras', icon: 'i-heroicons-document-text', active: selected.value === 'notes', onSelect: () => { selected.value = 'notes' } },
    { label: 'Documentos', icon: 'i-heroicons-document', active: selected.value === 'documents', onSelect: () => { selected.value = 'documents' } },
    { label: 'Datos personales', icon: 'i-heroicons-user-circle', active: selected.value === 'identities', onSelect: () => { selected.value = 'identities' } }
  ],
  [
    { label: 'Trabajo', icon: 'i-heroicons-folder', active: selected.value === 'folders/work', onSelect: () => { selected.value = 'folders/work' } },
    { label: 'Personal', icon: 'i-heroicons-folder', active: selected.value === 'folders/personal', onSelect: () => { selected.value = 'folders/personal' } }
  ]
])
</script>

<template>
  <div class="min-h-screen vault-bg text-white">
    <UDashboardGroup unit="rem">
      <Transition name="sidebar-slide" appear>
        <div :class="['animated-sidebar', sidebarAnim]">
        <UDashboardSidebar v-show="open" v-model:open="open" v-model:collapsed="collapsed" resizable collapsible :collapsed-size="4">
        <template #header="{ collapsed }">
          <div class="relative flex items-center gap-3 px-2" :class="[collapsed ? 'justify-center' : 'justify-between', !collapsed && 'pr-12']">
            <div class="size-8 rounded-xl bg-black text-white grid place-items-center border border-white/10">
              <UIcon name="i-heroicons-lock-closed" class="size-5" />
            </div>
            <span v-if="!collapsed" class="font-semibold text-sm tracking-tight truncate">Alcatraz</span>
            <UDashboardSidebarCollapse class="absolute right-2 top-1/2 -translate-y-1/2" size="lg" square variant="subtle" :aria-expanded="!collapsed" aria-label="Alternar barra lateral" />
          </div>
        </template>

        <UNavigationMenu
          color="neutral"
          orientation="vertical"
          :collapsed="collapsed"
          highlight
          :items="menuItems"
        />
      </UDashboardSidebar>
      </div>
      </Transition>

      <UDashboardPanel>
        <template #header>
          <UDashboardNavbar :title="selectedLabel">
            <template #leading>
              <UButton variant="ghost" color="neutral" size="sm" icon="i-heroicons-bars-3" @click="open = !open" aria-label="Mostrar/ocultar sidebar" />
            </template>
            <template #trailing>
              <div class="flex items-center gap-2">
                <UButton variant="solid" class="btn-primary" icon="i-heroicons-plus">Nuevo</UButton>
                <UButton variant="ghost" class="btn-ghost" icon="i-heroicons-magnifying-glass">Buscar</UButton>
              </div>
            </template>
          </UDashboardNavbar>
        </template>

        <div class="p-4 md:p-8">
          <div class="card-grid">
            <UCard v-for="i in filteredItems" :key="i.id" class="bg-black">
              <template #header>
                <div class="flex items-center gap-3">
                  <div class="icon-pill">
                    <UIcon :name="i.icon" class="size-5" />
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="text-base sm:text-lg font-semibold">{{ i.title }}</div>
                    <span class="badge">{{ i.type }}</span>
                  </div>
                </div>
              </template>
              <div class="space-y-2 text-sm opacity-85">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-user" class="size-4 text-white/60" />
                  {{ i.username }}
                </div>
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-link" class="size-4 text-white/60" />
                  <ULink :to="i.url" target="_blank" class="text-white/80 hover:text-white underline underline-offset-4 transition-colors">{{ i.url }}</ULink>
                </div>
              </div>

              <div class="mt-4 flex gap-2 pt-4 border-t border-white/5">
                <UButton size="xs" variant="solid" class="btn-primary" icon="i-heroicons-clipboard-document">Copiar</UButton>
                <UButton size="xs" variant="ghost" class="btn-ghost" icon="i-heroicons-pencil-square">Editar</UButton>
                <div class="flex-1"></div>
                <UButton size="xs" variant="ghost" class="btn-ghost" icon="i-heroicons-star"></UButton>
              </div>
            </UCard>
          </div>
        </div>
      </UDashboardPanel>
    </UDashboardGroup>
  </div>
</template>

<style scoped>
.vault-bg {
  background:
    radial-gradient(900px 500px at 10% 10%, rgba(255,255,255,0.06), rgba(255,255,255,0)),
    radial-gradient(700px 380px at 80% 20%, rgba(255,255,255,0.05), rgba(255,255,255,0)),
    linear-gradient(180deg, #0b0b0d, #121217 60%, #0b0b0d);
}

@keyframes slideIn {
  0% { transform: translate3d(-100px, 0, 0); opacity: 0; }
  100% { transform: translate3d(0, 0, 0); opacity: 1; }
}
@keyframes slideOut {
  0% { transform: translate3d(0, 0, 0); opacity: 1; }
  100% { transform: translate3d(-100px, 0, 0); opacity: 0; }
}

/* micro-interacciones generales */
.provider-glass { /* mantener compatibilidad con clases existentes */
  background: rgba(0,0,0,0.8);
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}
@media (min-width: 640px) { .card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.25rem; } }
@media (min-width: 768px) { .card-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; } }
@media (min-width: 1280px) { .card-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1.75rem; } }

.card-surface {
  position: relative;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.08);
  transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
  will-change: transform;
  border-radius: 16px;
}
.card-surface:hover { transform: translateY(-4px); box-shadow: 0 18px 40px rgba(0,0,0,0.4); background: rgba(255,255,255,0.08); }

.icon-pill {
  padding: 8px;
  border-radius: 12px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 12px;
  line-height: 1;
  color: #fff;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 9999px;
}

.btn-primary {
  background: #000;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 8px 20px rgba(0,0,0,0.35);
  transition: transform .2s ease, background .2s ease, box-shadow .2s ease;
}
.btn-primary:hover { background: rgba(0,0,0,0.9); }
.btn-primary:active { transform: translateY(1px); }

.btn-ghost {
  color: rgba(255,255,255,0.75);
  background: transparent;
  border: 1px solid rgba(255,255,255,0.16);
  transition: transform .2s ease, color .2s ease, background .2s ease;
}
.btn-ghost:hover { color: #fff; background: rgba(255,255,255,0.08); }
.btn-ghost:active { transform: translateY(1px); }
.animated-sidebar {
  transition: transform .3s ease-in-out, opacity .3s ease-in-out;
}
.animated-sidebar.opening { animation: slideIn .3s ease-in-out both; }
.animated-sidebar.closing { animation: slideOut .3s ease-in-out both; }

.sidebar-slide-enter-active,
.sidebar-slide-leave-active { transition: transform .3s ease-in-out, opacity .3s ease-in-out; }
.sidebar-slide-enter-from { transform: translate3d(-100px, 0, 0); opacity: 0; }
.sidebar-slide-enter-to { transform: translate3d(0, 0, 0); opacity: 1; }
.sidebar-slide-leave-from { transform: translate3d(0, 0, 0); opacity: 1; }
.sidebar-slide-leave-to { transform: translate3d(-100px, 0, 0); opacity: 0; }
</style>
