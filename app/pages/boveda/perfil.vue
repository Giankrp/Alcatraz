<script setup lang="ts">
definePageMeta({
  layout: "vault",
  middleware: "auth",
})

const { t } = useI18n()

useHead(() => ({
  title: t('profile.title') + ' · Alcatraz',
  meta: [
    {
      name: "description",
      content: t('profile.description'),
    },
  ],
}))

const {
  email,
  displayName,
  avatarUrl,
  language: userLanguage,
  initials,
  avatarColor,
  createdAt,
  twoFactorEnabled,
  loading: userLoading,
  fetchUser,
  updateProfile
} = useUser()

const { items } = useVault()
const toast = useToast()

// Profile Editing State
const editName = ref('')
const editAvatarUrl = ref('')
const editLanguage = ref('es')
const isSavingProfile = ref(false)

const languages = [
  { label: 'Español (ES)', value: 'es' },
  { label: 'English (EN)', value: 'en' }
]

onMounted(async () => {
  const { masterPassword } = useMasterPassword()
  if (!masterPassword.value) {
    navigateTo("/login/unlock")
    return
  }
  await fetchUser()

  watchEffect(() => {
    const currentEmail = email.value || ''
    const currentName = displayName.value || ''
    const emailPrefix = currentEmail.includes('@') ? currentEmail.split('@')[0] : ''

    if (!isSavingProfile.value) {
      editName.value = currentName !== emailPrefix ? currentName : ''
      editAvatarUrl.value = avatarUrl.value || ''
      editLanguage.value = userLanguage.value || useI18n().locale.value || 'es'
    }
  })
})

// Sync editLanguage with i18n locale for instant feedback
watch(() => useI18n().locale.value, (newLocale) => {
  if (!isSavingProfile.value) {
    editLanguage.value = newLocale
  }
})

const handleUpdateProfile = async () => {
  isSavingProfile.value = true
  try {
    const updated = await updateProfile({
      name: editName.value,
      avatar_url: editAvatarUrl.value,
      language: editLanguage.value
    })
    toast.add({
      title: t('profile.identity.success'),
      description: t('profile.identity.successDesc'),
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
    // Forzamos actualización de los campos de edición
    if (updated) {
      editName.value = updated.name || ''
      editAvatarUrl.value = updated.avatar_url || ''
      editLanguage.value = updated.language || 'es'
    }
  } catch (e) {
    toast.add({
      title: t('profile.identity.error'),
      description: t('profile.identity.errorDesc'),
      color: 'error',
      icon: 'i-heroicons-x-circle',
      ui: { root: "bg-red-500/10 border-red-500/20" }
    })
  } finally {
    isSavingProfile.value = false
  }
}

const formattedDate = computed(() => {
  if (!createdAt.value) return t('profile.stats.dateUnknown')
  const { locale } = useI18n()
  return new Date(createdAt.value).toLocaleDateString(locale.value === 'es' ? 'es-ES' : 'en-US', {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
})

// Existing features state
const showDeleteModal = ref(false)
const showPasswordModal = ref(false)
const showTwoFactorSetup = ref(false)
const localTwoFactor = ref(false)

// Sync local state with real user state
watch(twoFactorEnabled, (val) => {
  localTwoFactor.value = val
}, { immediate: true })

const handleTwoFactorToggle = (val: boolean) => {
  if (val && !twoFactorEnabled.value) {
    // Intentando activar
    localTwoFactor.value = true // Animamos el switch a 'ON'
    showTwoFactorSetup.value = true
  } else if (!val && twoFactorEnabled.value) {
    // Intentando desactivar (Pendiente de implementación en backend)
    toast.add({
      title: 'Desactivar 2FA',
      description: 'La desactivación manual estará disponible pronto. Contacta con soporte si necesitas ayuda.',
      color: 'warning'
    })
  }
}

// Revertir el switch si el usuario cierra el modal de configuración sin terminar
watch(showTwoFactorSetup, (isSetupOpen) => {
  if (!isSetupOpen && !twoFactorEnabled.value) {
    localTwoFactor.value = false
  }
})

const sessions = computed(() => [
  { browser: "Chrome", os: "Linux", ip: "192.168.1.x", current: true, lastActive: t('profile.devices.now') },
  { browser: "Safari", os: "iOS", ip: "10.0.0.x", current: false, lastActive: t('profile.devices.lastActive') },
])

const showExportModal = ref(false)
const exportPassword = ref('')
const exportError = ref('')

const confirmExport = () => {
  const { masterPassword } = useMasterPassword()
  exportError.value = ''
  if (exportPassword.value !== masterPassword.value) {
    exportError.value = 'Contraseña maestra incorrecta'
    return
  }
  const data = JSON.stringify(items.value, null, 2)
  const blob = new Blob([data], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const date = new Date().toISOString().split('T')[0]
  a.download = `alcatraz_backup_${date}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  toast.add({
    title: t('profile.management.exportSuccess'),
    description: t('profile.management.exportSuccessDesc'),
    color: 'success',
    icon: 'i-heroicons-arrow-down-on-square',
    ui: { root: "bg-black border-white/10" }
  })
  exportPassword.value = ''
  showExportModal.value = false
}

const fileInput = ref<HTMLInputElement | null>(null)
const triggerFileInput = () => fileInput.value?.click()

const handleFileImport = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    const text = await file.text()
    const parsedData = JSON.parse(text)
    if (Array.isArray(parsedData)) {
      items.value = [...items.value, ...parsedData]
      toast.add({
        title: t('profile.management.importSuccess'),
        description: t('profile.management.importSuccessDesc', { count: parsedData.length }),
        color: 'success',
        icon: 'i-heroicons-check-circle',
        ui: { root: "bg-black border-white/10" }
      })
    } else { throw new Error("Inv") }
  } catch (e) {
    toast.add({
      title: t('profile.management.importError'),
      description: t('profile.management.importErrorDesc'),
      color: 'error',
      icon: 'i-heroicons-x-circle',
      ui: { root: "bg-red-500/10 border-red-500/20" }
    })
  } finally { input.value = '' }
}
</script>

<template>
  <div class="min-h-screen bg-black text-zinc-400 font-sans selection:bg-emerald-500/30 py-12">
    <div class="max-w-6xl mx-auto px-8 relative">

      <!-- Back navigation -->
      <UButton to="/boveda" variant="ghost" color="neutral" size="sm" icon="i-heroicons-arrow-left"
        class="mb-12 text-zinc-600 hover:text-emerald-400 transition-all group pl-0">
        <span class="group-hover:-translate-x-1 transition-transform font-mono uppercase text-[10px] tracking-widest">{{ $t('profile.back') }}</span>
      </UButton>

      <!-- PROFILE HEADER -->
      <header class="flex items-center gap-10 mb-16 animate-fade-in">
        <div class="relative group">
          <div
            class="size-32 rounded-full border border-zinc-800 flex items-center justify-center bg-zinc-950 relative overflow-hidden transition-all duration-700 group-hover:border-emerald-500/30"
            :style="{ background: avatarUrl ? 'black' : avatarColor }">
            <img v-if="avatarUrl" :src="avatarUrl"
              class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            <span v-else class="text-4xl font-light text-zinc-100">{{ initials }}</span>
            <!-- Status Dot -->
            <div
              class="absolute bottom-2 right-2 size-4 bg-emerald-500 rounded-full border-4 border-black shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
        </div>

        <div class="flex-1">
          <h1 class="text-4xl font-normal text-zinc-100 tracking-tight mb-1">{{ displayName }}</h1>
          <p class="text-xs font-mono text-zinc-600 uppercase tracking-[0.2em] mb-6">{{ email }}</p>

          <div class="flex flex-wrap gap-3">
            <div class="badge-tech group">
              <UIcon name="i-heroicons-cpu-chip"
                class="size-3 text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
              <span>{{ $t('profile.header.node') }}: {{ (displayName || 'ALCATRAZ').toUpperCase() }}</span>
            </div>
            <div class="badge-tech group">
              <UIcon name="i-heroicons-shield-check"
                class="size-3 text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
              <span>{{ $t('profile.header.secureAccess') }}</span>
            </div>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16">

        <!-- LEFT COLUMN -->
        <div class="lg:col-span-7 space-y-16">

          <!-- IDENTITY -->
          <section class="animate-fade-up">
            <div class="section-header">
              <h2 class="text-emerald-500">{{ $t('profile.identity.title') }}</h2>
              <div class="header-line" />
            </div>

            <div class="space-y-8 mt-10">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <UFormField :label="$t('profile.identity.nameLabel')" :ui="{ label: 'label-tech' }">
                  <UInput v-model="editName" placeholder="Alias o nombre real" size="lg"
                    :ui="{ base: 'input-tech h-12' }" />
                </UFormField>

                <UFormField :label="$t('profile.identity.languageLabel')" :ui="{ label: 'label-tech' }">
                  <USelect v-model="editLanguage" :items="languages" size="lg" :ui="{ base: 'input-tech h-12' }" />
                </UFormField>
              </div>

              <UFormField :label="$t('profile.identity.avatarLabel')" :ui="{ label: 'label-tech' }">
                <UInput v-model="editAvatarUrl" placeholder="https://ejemplo.com/perfil.jpg" size="lg"
                  :ui="{ base: 'input-tech h-12' }" />
                <p class="text-[9px] text-zinc-700 mt-2 tracking-wider">{{ $t('profile.identity.avatarHelp') }}</p>
              </UFormField>

              <UButton @click="handleUpdateProfile" :loading="isSavingProfile"
                class="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3 rounded-lg font-bold tracking-widest text-xs transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                {{ $t('profile.identity.saveButton') }}
              </UButton>
            </div>
          </section>

          <!-- SECURITY -->
          <section class="animate-fade-up animate-delay-100">
            <div class="section-header">
              <h2 class="text-emerald-500">{{ $t('profile.security.title') }}</h2>
              <div class="header-line" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
              <div class="card-tech p-6 group hover:border-emerald-500/20 transition-all">
                <div class="flex justify-between items-start mb-10">
                  <div class="size-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800">
                    <UIcon name="i-heroicons-key" class="size-5 text-emerald-500/50" />
                  </div>
                  <UButton variant="ghost" color="neutral" size="xs"
                    class="text-emerald-500 hover:text-emerald-400 font-bold tracking-widest text-[10px]"
                    @click="showPasswordModal = true">
                    {{ $t('profile.security.update') }}
                  </UButton>
                </div>
                <h3 class="text-zinc-100 font-medium text-sm mb-1">{{ $t('profile.security.masterPassword') }}</h3>
              </div>

              <div class="card-tech p-6">
                <div class="flex justify-between items-start mb-10">
                  <div class="size-10 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800">
                    <UIcon name="i-heroicons-shield-check" class="size-5 text-emerald-500/50" />
                  </div>
                  <USwitch 
                    :model-value="localTwoFactor" 
                    color="success" 
                    @update:model-value="handleTwoFactorToggle" 
                  />
                </div>
                <h3 class="text-zinc-100 font-medium text-sm mb-1">{{ $t('profile.security.twoFactor') }}</h3>
                <p class="text-emerald-500/60 text-[10px] uppercase tracking-wider font-bold">
                  {{ twoFactorEnabled ? $t('profile.security.twoFactorActive') : $t('profile.security.twoFactorInactive') }}
                </p>
              </div>
            </div>
          </section>
        </div>

        <!-- RIGHT COLUMN -->
        <div class="lg:col-span-5 space-y-12">

          <!-- STATS -->
          <section class="animate-fade-up animate-delay-200">
            <div class="card-tech p-8 relative overflow-hidden group">
              <div class="absolute top-4 right-4 text-[9px] font-mono text-zinc-700 tracking-widest">V1.0.4</div>
              <h4 class="label-tech mb-8 opacity-60">{{ $t('profile.stats.title') }}</h4>

              <div class="flex items-baseline gap-4 mb-3">
                <span class="text-7xl font-light text-zinc-100 tracking-tighter">{{ items.length }}</span>
                <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] pb-2">{{ $t('profile.stats.items') }}</span>
              </div>

              <div class="w-full h-[3px] bg-zinc-900 rounded-full mb-12">
                <div class="h-full bg-emerald-500/40 w-1/3 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.2)]" />
              </div>

              <div class="space-y-1">
                <h5 class="label-tech opacity-40">{{ $t('profile.stats.memberSince') }}</h5>
                <div class="text-zinc-300 font-medium text-lg capitalize">{{ formattedDate }}</div>
              </div>
            </div>
          </section>

          <!-- DATA MANAGEMENT -->
          <section class="animate-fade-up animate-delay-300">
            <div class="section-header">
              <h2 class="text-emerald-500/60 text-[10px] uppercase tracking-[0.3em] font-bold">{{ $t('profile.management.title') }}</h2>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-6">
              <button @click="showExportModal = true"
                class="card-tech p-5 hover:bg-zinc-900/50 transition-all text-left group cursor-pointer">
                <UIcon name="i-heroicons-arrow-down-tray"
                  class="size-4 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                <div class="text-[10px] font-bold text-zinc-200 tracking-widest uppercase mb-1">{{ $t('profile.management.export') }}</div>
                <div class="text-[9px] text-zinc-600 font-mono">{{ $t('profile.management.exportDesc') }}</div>
              </button>
              <button @click="triggerFileInput"
                class="card-tech p-5 hover:bg-zinc-900/50 transition-all text-left group cursor-pointer">
                <UIcon name="i-heroicons-arrow-up-tray"
                  class="size-4 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                <div class="text-[10px] font-bold text-zinc-200 tracking-widest uppercase mb-1">{{ $t('profile.management.import') }}</div>
                <div class="text-[9px] text-zinc-600 font-mono">{{ $t('profile.management.importDesc') }}</div>
              </button>
              <input type="file" ref="fileInput" accept=".json" class="hidden" @change="handleFileImport" />
            </div>
          </section>

          <!-- DEVICES -->
          <section class="animate-fade-up animate-delay-400">
            <div class="section-header">
              <h2 class="text-emerald-500/60 text-[10px] uppercase tracking-[0.3em] font-bold">{{ $t('profile.devices.title') }}</h2>
            </div>
            <div class="space-y-3 mt-6">
              <div v-for="(session, idx) in sessions" :key="idx"
                class="card-tech px-5 py-4 flex items-center justify-between group">
                <div class="flex items-center gap-4">
                  <UIcon :name="session.os === 'iOS' ? 'i-heroicons-device-phone-mobile' : 'i-heroicons-computer-desktop'"
                    class="size-5 text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                  <div>
                    <div class="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">{{ session.browser }} en {{ session.os }}</div>
                    <div class="text-[9px] font-mono text-zinc-600 uppercase mt-0.5">{{ session.current ? session.ip : $t('profile.devices.lastActive') }}</div>
                  </div>
                </div>
                <span :class="session.current ? 'text-emerald-500 border-emerald-500/20' : 'text-zinc-700 border-zinc-800'"
                  class="text-[8px] font-bold border px-2 py-0.5 rounded tracking-widest uppercase">{{ session.current ? $t('profile.devices.active') : $t('profile.devices.history') }}</span>
              </div>
            </div>
          </section>

          <!-- DANGER -->
          <section class="animate-fade-up animate-delay-500">
            <div class="card-tech p-8 border-red-500/20 bg-red-500/2">
              <div class="flex items-center gap-4 mb-6">
                <div class="size-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <UIcon name="i-heroicons-shield-exclamation" class="size-5 text-red-500" />
                </div>
                <h4 class="text-[10px] font-bold text-red-500 uppercase tracking-[0.3em]">{{ $t('profile.danger.title') }}</h4>
              </div>
              <p class="text-[11px] text-zinc-600 leading-relaxed mb-10">
                {{ $t('profile.danger.desc') }}
              </p>
              <button @click="showDeleteModal = true"
                class="w-full py-4 border border-red-500/30 rounded-lg text-red-500 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-red-500/10 transition-all active:scale-95 cursor-pointer">
                {{ $t('profile.danger.deleteButton') }}
              </button>
            </div>
          </section>
        </div>
      </div>

      <!-- FOOTER -->
      <footer class="mt-32 pb-8 flex justify-center">
        <span class="text-[9px] font-mono text-zinc-800 tracking-[0.6em] uppercase">VAULT SYSTEMS SECURITY</span>
      </footer>
    </div>

    <!-- MODALS (Moved outside main relative container to ensure correct teleportation) -->
    <UModal v-model:open="showPasswordModal">
      <template #content>
        <div class="p-10 bg-black border border-emerald-500/20 rounded-2xl max-w-md mx-auto shadow-[0_0_50px_rgba(0,0,0,1)]">
          <h3 class="text-lg font-bold text-zinc-100 uppercase tracking-widest mb-8">{{ $t('profile.modals.passwordTitle') }}</h3>
          <div class="space-y-6 mb-10">
            <UInput type="password" :placeholder="$t('profile.modals.passwordCurrent')" :ui="{ base: 'input-tech text-white' }" />
            <UInput type="password" :placeholder="$t('profile.modals.passwordNew')" :ui="{ base: 'input-tech text-white' }" />
            <UInput type="password" :placeholder="$t('profile.modals.passwordConfirm')" :ui="{ base: 'input-tech text-white' }" />
          </div>
          <UButton block class="bg-emerald-500 hover:bg-emerald-400 text-black h-12 rounded-lg font-bold tracking-widest uppercase text-xs" @click="showPasswordModal = false">
            {{ $t('profile.modals.passwordSave') }}
          </UButton>
        </div>
      </template>
    </UModal>

    <UModal v-model:open="showExportModal">
      <template #content>
        <div class="p-10 bg-black border border-emerald-500/20 rounded-2xl max-w-md mx-auto shadow-[0_0_50px_rgba(0,0,0,1)] text-center">
          <UIcon name="i-heroicons-lock-closed" class="size-12 text-emerald-500 mb-6 mx-auto" />
          <h3 class="text-lg font-bold text-zinc-100 uppercase tracking-widest mb-4">{{ $t('profile.modals.exportVerify') }}</h3>
          <p class="text-xs text-zinc-600 mb-8 uppercase tracking-wider leading-relaxed">{{ $t('profile.modals.exportAuth') }}</p>
          <UInput v-model="exportPassword" type="password" :placeholder="$t('profile.modals.exportPassword')" class="mb-3" :ui="{ base: 'input-tech text-white' }" @keyup.enter="confirmExport" />
          <p v-if="exportError" class="text-[10px] text-red-500 mb-8 font-mono uppercase">{{ $t(`profile.modals.${exportError === 'Contraseña maestra incorrecta' ? 'masterPasswordError' : ''}`) || exportError }}</p>
          <div class="flex flex-col gap-3">
            <UButton block class="bg-emerald-500 hover:bg-emerald-400 text-black h-12 rounded-lg font-bold tracking-widest uppercase text-xs" @click="confirmExport">
              {{ $t('profile.modals.exportButton') }}
            </UButton>
            <UButton block variant="ghost" color="neutral" class="text-zinc-600 hover:text-zinc-400" @click="showExportModal = false">
              {{ $t('profile.danger.cancel') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <UModal v-model:open="showDeleteModal">
      <template #content>
        <div class="p-10 bg-black border border-red-500/20 rounded-2xl max-w-sm mx-auto shadow-2xl">
          <h3 class="text-lg font-bold text-red-500 uppercase tracking-widest mb-4">{{ $t('profile.danger.modalTitle') }}</h3>
          <p class="text-xs text-zinc-600 mb-10 leading-relaxed">{{ $t('profile.danger.modalDesc') }}</p>
          <div class="flex flex-col gap-3">
            <UButton block color="error" class="h-12 rounded-lg font-bold tracking-widest uppercase text-xs">{{ $t('profile.danger.confirmDelete') }}</UButton>
            <UButton block variant="ghost" color="neutral" class="text-zinc-600 hover:text-zinc-400" @click="showDeleteModal = false">{{ $t('profile.danger.cancel') }}</UButton>
          </div>
        </div>
      </template>
    </UModal>

    <ProfileTwoFactorSetup v-model:open="showTwoFactorSetup" @enabled="fetchUser" />
  </div>
</template>

<style scoped>
.section-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.section-header h2 {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.header-line {
  height: 1px;
  width: 2.5rem;
  background: currentColor;
  opacity: 0.5;
}

.label-tech {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #52525b;
}

.badge-tech {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background: #09090b;
  border: 1px solid #18181b;
  border-radius: 8px;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: #71717a;
}

.input-tech {
  background: #09090b !important;
  border: 1px solid #18181b !important;
  border-radius: 8px !important;
  color: #d4d4d8 !important;
  transition: all 0.3s ease !important;
}

.input-tech:focus-within {
  border-color: rgba(16, 185, 129, 0.3) !important;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.05) !important;
}

.card-tech {
  background: #09090b;
  border: 1px solid #18181b;
  border-radius: 16px;
}

@media (max-width: 1024px) {
  .grid {
    gap: 3rem;
  }
}
</style>
