<script setup lang="ts">
import { useVault } from '~/composables/useVault'
import type { VaultItem, PasswordItem, NoteItem, CardItem, IdentityItem } from '~/types/vault'
import PasswordForm from '~/components/vault/forms/PasswordForm.vue'
import NoteForm from '~/components/vault/forms/NoteForm.vue'
import CardForm from '~/components/vault/forms/CardForm.vue'
import IdentityForm from '~/components/vault/forms/IdentityForm.vue'

definePageMeta({
  layout: 'vault'
})

const route = useRoute()
const router = useRouter()
const { items, updateItem, fetchItems, getDecryptedItem } = useVault()
const toast = useToast()

const itemId = computed(() => route.params.id as string)
const item = computed(() => items.value.find(i => i.id === itemId.value))

// Typed helpers for template
const asPassword = computed(() => item.value?.item_type === 'password' ? item.value as PasswordItem : null)
const asNote = computed(() => item.value?.item_type === 'note' ? item.value as NoteItem : null)
const asCard = computed(() => item.value?.item_type === 'card' ? item.value as CardItem : null)
const asIdentity = computed(() => item.value?.item_type === 'identity' ? item.value as IdentityItem : null)

const isEditing = ref(false)
const isSaving = ref(false)
const showPassword = ref(false)
const isLoading = ref(true)

onMounted(async () => {
  await loadItem()
})

watch(itemId, async () => {
  await loadItem()
})

const loadItem = async () => {
  isLoading.value = true
  if (!items.value.length) {
    await fetchItems()
  }

  // Ensure the specific item is fully decrypted
  if (itemId.value) {
    try {
      await getDecryptedItem(itemId.value)
    } catch (e) {
      console.error('Error decrypting item:', e)
      toast.add({ title: 'Error', description: 'No se pudo descifrar el elemento', color: 'error' })
    }
  }

  isLoading.value = false

  if (!item.value) {
    router.push('/boveda')
  }
}

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.add({
      title: 'Copiado',
      description: `${label} copiado al portapapeles`,
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
  }).catch(() => {
    toast.add({
      title: 'Error',
      description: 'No se pudo copiar al portapapeles',
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  })
}

const handleSave = (data: any) => {
  if (item.value) {
    updateItem(itemId.value, data)
    isEditing.value = false
    toast.add({
      title: 'Actualizado',
      description: 'El elemento ha sido actualizado correctamente',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
  }
}

const getComponentForType = (type: string) => {
  switch (type) {
    case 'password': return PasswordForm
    case 'note': return NoteForm
    case 'card': return CardForm
    case 'identity': return IdentityForm
    default: return null
  }
}
</script>

<template>
  <div v-if="isLoading" class="min-h-screen bg-gray-950 flex items-center justify-center">
    <UIcon name="i-heroicons-arrow-path" class="animate-spin text-white w-8 h-8" />
  </div>
  <div v-else-if="item"
    class="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">

    <!-- Background Effects -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
    </div>

    <!-- Back Navigation -->
    <div v-if="!isEditing" class="absolute top-6 left-6 z-10">
      <UButton icon="i-heroicons-arrow-left" color="neutral" variant="ghost" @click="router.push('/boveda')"
        class="hover:bg-white/10">
        Volver a la Bóveda
      </UButton>
    </div>

    <!-- Main Content -->
    <div class="w-full max-w-2xl relative z-10">

      <!-- Edit Mode -->
      <div v-if="isEditing" class="w-full max-w-lg mx-auto relative perspective-1000">
        <div class="relative overflow-hidden rounded-4xl bg-[#050505] shadow-2xl ring-1 ring-white/8 p-8">
          <!-- Cinematic Glows -->
          <div class="absolute -top-50 -right-50 w-125 h-125 bg-white/3 blur-[120px] rounded-full pointer-events-none">
          </div>
          <div
            class="absolute -bottom-50 -left-50 w-125 h-125 bg-white/2 blur-[120px] rounded-full pointer-events-none">
          </div>

          <component :is="getComponentForType(item.item_type)" :initial-data="item" :loading="isSaving"
            @save="handleSave" @back="isEditing = false" class="relative z-10" />
        </div>
      </div>

      <!-- View Mode -->
      <div v-else>
        <!-- Header Actions (Hidden for Password type as it has internal edit button) -->
        <div v-if="item.item_type !== 'password'" class="flex justify-end mb-4">
          <UButton icon="i-heroicons-pencil-square" color="neutral" variant="soft"
            class="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10" @click="isEditing = true">
            Editar
          </UButton>
        </div>

        <!-- Password View -->
        <div v-if="asPassword" class="w-full max-w-2xl mx-auto perspective-1000">
          <div class="relative overflow-hidden rounded-4xl bg-[#050505] shadow-2xl ring-1 ring-white/8">

            <!-- Cinematic Glows -->
            <div
              class="absolute -top-50 -right-50 w-125 h-125 bg-white/3 blur-[120px] rounded-full pointer-events-none">
            </div>
            <div
              class="absolute -bottom-50 -left-50 w-125 h-125 bg-white/2 blur-[120px] rounded-full pointer-events-none">
            </div>

            <!-- Header Section -->
            <div class="relative p-10 pb-8 flex items-start justify-between z-10">
              <div class="flex items-center gap-8">
                <!-- Icon with Prism Effect -->
                <div class="relative group cursor-default">
                  <div
                    class="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  </div>
                  <div
                    class="relative size-20 rounded-[20px] bg-linear-to-br from-white/8 to-white/1 flex items-center justify-center ring-1 ring-white/10 shadow-lg backdrop-blur-md">
                    <UIcon :name="asPassword.icon"
                      class="size-10 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                  </div>
                </div>

                <!-- Title & Meta -->
                <div class="space-y-2">
                  <h1
                    class="text-4xl font-light text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/60 tracking-tight">
                    {{ asPassword.title }}</h1>
                  <div class="flex items-center gap-3">
                    <div class="inline-flex items-center px-3 py-1 rounded-full bg-white/3 ring-1 ring-white/5">
                      <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">{{
                        asPassword.folder }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <UButton icon="i-heroicons-pencil-square" color="neutral" variant="ghost" :ui="{ base: 'rounded-full' }"
                class="opacity-40 hover:opacity-100 hover:bg-white/8 transition-all duration-300 w-10 h-10 flex items-center justify-center"
                @click="isEditing = true" />
            </div>

            <!-- Content Container -->
            <div class="p-10 pt-2 space-y-6 relative z-10">

              <!-- Username Field -->
              <div v-if="asPassword.username"
                class="group relative bg-white/2 hover:bg-white/4 rounded-2xl p-5 transition-all duration-500 ring-1 ring-transparent hover:ring-white/10">
                <div class="flex flex-col gap-1.5">
                  <label
                    class="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] transition-colors group-hover:text-neutral-500">Usuario</label>
                  <div class="flex items-center justify-between">
                    <span class="text-neutral-200 font-light text-lg select-all tracking-wide">{{ asPassword.username
                    }}</span>
                    <UButton icon="i-heroicons-document-duplicate" color="neutral" variant="ghost" size="xs"
                      class="opacity-0 group-hover:opacity-60 hover:opacity-100! transition-all duration-300"
                      @click="copyToClipboard(asPassword.username!, 'Usuario')" />
                  </div>
                </div>
              </div>

              <!-- Password Field -->
              <div v-if="asPassword.password"
                class="group relative bg-white/2 hover:bg-white/4 rounded-2xl p-5 transition-all duration-500 ring-1 ring-transparent hover:ring-white/10">
                <div class="flex flex-col gap-1.5">
                  <label
                    class="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] transition-colors group-hover:text-neutral-500">Contraseña</label>
                  <div class="flex items-center justify-between">
                    <span class="text-white font-mono text-xl tracking-wider">
                      {{ showPassword ? asPassword.password : '••••••••••••••••' }}
                    </span>
                    <div class="flex items-center gap-2">
                      <UButton :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" color="neutral"
                        variant="ghost" size="xs"
                        class="opacity-0 group-hover:opacity-60 hover:opacity-100! transition-all duration-300"
                        @click="showPassword = !showPassword" />
                      <div class="w-px h-4 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <UButton icon="i-heroicons-document-duplicate" color="neutral" variant="ghost" size="xs"
                        class="opacity-0 group-hover:opacity-60 hover:opacity-100! transition-all duration-300"
                        @click="copyToClipboard(asPassword.password!, 'Contraseña')" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- URL Field -->
              <div v-if="asPassword.url"
                class="group relative bg-white/2 hover:bg-white/4 rounded-2xl p-5 transition-all duration-500 ring-1 ring-transparent hover:ring-white/10">
                <div class="flex flex-col gap-1.5">
                  <label
                    class="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] transition-colors group-hover:text-neutral-500">Website</label>
                  <div class="flex items-center justify-between">
                    <a :href="asPassword.url" target="_blank"
                      class="text-neutral-300 hover:text-white font-light text-lg transition-colors truncate pr-4 decoration-white/30 hover:underline underline-offset-4">
                      {{ asPassword.url?.replace(/^https?:\/\//, '') }}
                    </a>
                    <div class="flex items-center gap-2">
                      <UButton icon="i-heroicons-arrow-top-right-on-square" color="neutral" variant="ghost" size="xs"
                        class="opacity-0 group-hover:opacity-60 hover:opacity-100! transition-all duration-300"
                        :to="asPassword.url" target="_blank" />
                      <UButton icon="i-heroicons-document-duplicate" color="neutral" variant="ghost" size="xs"
                        class="opacity-0 group-hover:opacity-60 hover:opacity-100! transition-all duration-300"
                        @click="copyToClipboard(asPassword.url!, 'URL')" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Security Footer (Minimal) -->
              <div
                class="mt-8 pt-8 flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity duration-500">
                <div class="flex items-center gap-2 text-[10px] font-medium tracking-widest text-neutral-400 uppercase">
                  <UIcon name="i-heroicons-shield-check" class="w-3 h-3" />
                  <span>AES-256 Encrypted</span>
                </div>
                <div class="text-[10px] font-mono text-neutral-600">
                  ID-{{ asPassword.id?.toString().padStart(4, '0') }}
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Note View -->
        <div v-else-if="asNote" class="w-full max-w-2xl mx-auto perspective-1000">
          <div class="relative overflow-hidden rounded-4xl bg-[#050505] shadow-2xl ring-1 ring-white/8">

            <!-- Cinematic Glows -->
            <div
              class="absolute -top-50 -right-50 w-125 h-125 bg-white/3 blur-[120px] rounded-full pointer-events-none">
            </div>
            <div
              class="absolute -bottom-50 -left-50 w-125 h-125 bg-white/2 blur-[120px] rounded-full pointer-events-none">
            </div>

            <!-- Header Section -->
            <div class="relative p-10 pb-8 flex items-start justify-between z-10">
              <div class="flex items-center gap-8">
                <div class="relative group cursor-default">
                  <div
                    class="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  </div>
                  <div
                    class="relative size-20 rounded-[20px] bg-linear-to-br from-white/8 to-white/1 flex items-center justify-center ring-1 ring-white/10 shadow-lg backdrop-blur-md">
                    <UIcon :name="asNote.icon"
                      class="size-10 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                  </div>
                </div>

                <div class="space-y-2">
                  <h1
                    class="text-4xl font-light text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/60 tracking-tight">
                    {{ asNote.title }}</h1>
                  <div class="flex items-center gap-3">
                    <div class="inline-flex items-center px-3 py-1 rounded-full bg-white/3 ring-1 ring-white/5">
                      <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">{{ asNote.folder
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <UButton icon="i-heroicons-pencil-square" color="neutral" variant="ghost" :ui="{ base: 'rounded-full' }"
                class="opacity-40 hover:opacity-100 hover:bg-white/8 transition-all duration-300 w-10 h-10 flex items-center justify-center"
                @click="isEditing = true" />
            </div>

            <!-- Note Content -->
            <div class="p-10 pt-2 relative z-10">
              <div
                class="group relative bg-white/2 hover:bg-white/4 rounded-3xl p-8 transition-all duration-500 ring-1 ring-transparent hover:ring-white/10 min-h-100">
                <!-- Ambient Light inside note -->
                <div
                  class="absolute top-0 right-0 w-64 h-64 bg-white/2 blur-[80px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                </div>

                <div class="prose prose-invert max-w-none relative z-10">
                  <div
                    class="whitespace-pre-wrap text-neutral-300 font-light text-lg leading-relaxed selection:bg-white/20">
                    {{ asNote.note }}
                  </div>
                </div>

                <!-- Floating Action -->
                <div
                  class="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <UButton icon="i-heroicons-document-duplicate" color="neutral" variant="ghost" size="sm"
                    class="bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10"
                    @click="copyToClipboard(asNote.note!, 'Nota')" />
                </div>
              </div>

              <!-- Footer -->
              <div
                class="mt-8 pt-4 flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity duration-500 px-2">
                <div class="flex items-center gap-2 text-[10px] font-medium tracking-widest text-neutral-400 uppercase">
                  <UIcon name="i-heroicons-lock-closed" class="w-3 h-3" />
                  <span>End-to-End Encrypted</span>
                </div>
                <div class="text-[10px] font-mono text-neutral-600">
                  ID-{{ asNote.id?.toString().padStart(4, '0') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card View -->
        <div v-else-if="asCard" class="w-full max-w-2xl mx-auto perspective-1000">
          <div class="relative overflow-hidden rounded-4xl bg-[#050505] shadow-2xl ring-1 ring-white/8">

            <!-- Cinematic Glows -->
            <div
              class="absolute -top-50 -right-50 w-125 h-125 bg-white/3 blur-[120px] rounded-full pointer-events-none">
            </div>
            <div
              class="absolute -bottom-50 -left-50 w-125 h-125 bg-white/2 blur-[120px] rounded-full pointer-events-none">
            </div>

            <!-- Header -->
            <div class="relative p-10 pb-4 flex items-start justify-between z-10">
              <div class="flex items-center gap-8">
                <div class="relative group cursor-default">
                  <div
                    class="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  </div>
                  <div
                    class="relative size-20 rounded-[20px] bg-linear-to-br from-white/8 to-white/1 flex items-center justify-center ring-1 ring-white/10 shadow-lg backdrop-blur-md">
                    <UIcon :name="asCard.icon"
                      class="size-10 text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                  </div>
                </div>
                <div class="space-y-2">
                  <h1
                    class="text-4xl font-light text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/60 tracking-tight">
                    {{ asCard.title }}</h1>
                  <div class="flex items-center gap-3">
                    <div class="inline-flex items-center px-3 py-1 rounded-full bg-white/3 ring-1 ring-white/5">
                      <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">{{ asCard.folder
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <UButton icon="i-heroicons-pencil-square" color="neutral" variant="ghost" :ui="{ base: 'rounded-full' }"
                class="opacity-40 hover:opacity-100 hover:bg-white/8 transition-all duration-300 w-10 h-10 flex items-center justify-center"
                @click="isEditing = true" />
            </div>

            <!-- Content -->
            <div class="p-10 pt-6 space-y-8 relative z-10">

              <!-- The Card Itself -->
              <div
                class="relative w-full aspect-[1.586/1] rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 hover:scale-[1.02] group ring-1 ring-white/10">
                <!-- Premium Matte Black Texture -->
                <div class="absolute inset-0 bg-[#080808]">
                  <!-- Subtle noise/gradient -->
                  <div class="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-black opacity-60"></div>
                  <div
                    class="absolute -top-1/2 -right-1/2 w-full h-full bg-white/5 blur-[80px] rounded-full mix-blend-overlay">
                  </div>
                </div>

                <div class="relative z-10 p-8 flex flex-col justify-between h-full">
                  <div class="flex justify-between items-start">
                    <div class="text-sm font-bold tracking-[0.3em] text-white/30 font-mono">ALCATRAZ TITANIUM</div>
                    <UIcon name="i-heroicons-wifi" class="size-10 rotate-90 text-white/20" />
                  </div>

                  <div class="space-y-8">
                    <div class="flex items-center gap-6">
                      <!-- Chip -->
                      <div
                        class="w-14 h-10 rounded-lg bg-linear-to-tr from-[#d4af37]/20 to-[#f9d976]/20 border border-[#d4af37]/40 flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                        <div class="absolute inset-0 bg-linear-to-b from-white/10 to-transparent"></div>
                        <div class="w-full h-px bg-[#d4af37]/30 absolute top-1/3"></div>
                        <div class="w-full h-px bg-[#d4af37]/30 absolute bottom-1/3"></div>
                        <div class="h-full w-px bg-[#d4af37]/30 absolute left-1/3"></div>
                        <div class="h-full w-px bg-[#d4af37]/30 absolute right-1/3"></div>
                      </div>
                      <UIcon name="i-heroicons-signal" class="size-6 text-white/20 rotate-90" />
                    </div>

                    <div class="group/number cursor-pointer"
                      @click="copyToClipboard(asCard.number!, 'Número de tarjeta')">
                      <div
                        class="font-mono text-3xl tracking-[0.15em] text-white/90 drop-shadow-2xl transition-all duration-300 group-hover/number:text-white flex items-center gap-4">
                        <span>{{ showPassword ? asCard.number : '•••• •••• •••• ' + asCard.number?.slice(-4) }}</span>
                        <UIcon name="i-heroicons-document-duplicate"
                          class="size-4 text-white/20 opacity-0 group-hover/number:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </div>

                  <div class="flex justify-between items-end text-neutral-400">
                    <div>
                      <div class="text-[9px] uppercase tracking-widest mb-1.5 opacity-40 font-bold">Titular</div>
                      <div class="font-medium uppercase tracking-[0.15em] text-sm text-neutral-200">{{ asCard.holder }}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-[9px] uppercase tracking-widest mb-1.5 opacity-40 font-bold">Expira</div>
                      <div class="font-mono text-sm text-neutral-200 tracking-wider">{{ asCard.expiry }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Security Details -->
              <div class="grid grid-cols-2 gap-4">
                <div
                  class="group relative bg-white/2 hover:bg-white/4 rounded-2xl p-5 transition-all duration-500 ring-1 ring-transparent hover:ring-white/10">
                  <label
                    class="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] transition-colors group-hover:text-neutral-500">CVC
                    / CVV</label>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-white font-mono text-xl tracking-wider">{{ showPassword ? asCard.cvv : '•••'
                    }}</span>
                    <div class="flex gap-2">
                      <UButton :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'" color="neutral"
                        variant="ghost" size="xs"
                        class="opacity-0 group-hover:opacity-60 hover:opacity-100! transition-all duration-300"
                        @click="showPassword = !showPassword" />
                      <UButton icon="i-heroicons-document-duplicate" color="neutral" variant="ghost" size="xs"
                        class="opacity-0 group-hover:opacity-60 hover:opacity-100! transition-all duration-300"
                        @click="copyToClipboard(asCard.cvv!, 'CVV')" />
                    </div>
                  </div>
                </div>
                <div
                  class="group relative bg-white/2 hover:bg-white/4 rounded-2xl p-5 transition-all duration-500 ring-1 ring-transparent hover:ring-white/10 flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] mb-1">Tipo</div>
                    <div class="text-white font-mono text-sm tracking-wider">VISA / MC</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Identity View -->
        <div v-else-if="asIdentity" class="w-full max-w-2xl mx-auto perspective-1000">
          <div class="relative overflow-hidden rounded-4xl bg-[#050505] shadow-2xl ring-1 ring-white/8">

            <!-- Cinematic Glows -->
            <div
              class="absolute -top-50 -right-50 w-125 h-125 bg-white/3 blur-[120px] rounded-full pointer-events-none">
            </div>
            <div
              class="absolute -bottom-50 -left-50 w-125 h-125 bg-white/2 blur-[120px] rounded-full pointer-events-none">
            </div>

            <!-- Header -->
            <div class="relative p-10 pb-8 flex items-start justify-between z-10">
              <div class="flex items-center gap-8">
                <!-- Avatar Circle -->
                <div class="relative group cursor-default">
                  <div
                    class="absolute inset-0 bg-linear-to-tr from-white/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  </div>
                  <div
                    class="relative size-20 rounded-full bg-linear-to-br from-white/8 to-white/1 flex items-center justify-center ring-1 ring-white/10 shadow-lg backdrop-blur-md overflow-hidden">
                    <span class="text-2xl font-light text-white tracking-widest">{{ asIdentity.firstName?.[0] }}{{
                      asIdentity.lastName?.[0] }}</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <h1
                    class="text-4xl font-light text-transparent bg-clip-text bg-linear-to-b from-white via-white to-white/60 tracking-tight">
                    {{ asIdentity.firstName }} {{ asIdentity.lastName }}</h1>
                  <div class="flex items-center gap-3">
                    <div class="inline-flex items-center px-3 py-1 rounded-full bg-white/3 ring-1 ring-white/5">
                      <span class="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">Identidad</span>
                    </div>
                  </div>
                </div>
              </div>
              <UButton icon="i-heroicons-pencil-square" color="neutral" variant="ghost" :ui="{ base: 'rounded-full' }"
                class="opacity-40 hover:opacity-100 hover:bg-white/8 transition-all duration-300 w-10 h-10 flex items-center justify-center"
                @click="isEditing = true" />
            </div>

            <!-- Content Grid -->
            <div class="p-10 pt-2 relative z-10">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <!-- Email -->
                <div v-if="asIdentity.email"
                  class="group relative bg-white/2 hover:bg-white/4 rounded-2xl p-5 transition-all duration-500 ring-1 ring-transparent hover:ring-white/10 col-span-2 md:col-span-1">
                  <div class="flex flex-col gap-1.5">
                    <label
                      class="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] transition-colors group-hover:text-neutral-500">Email</label>
                    <div class="flex items-center justify-between">
                      <span class="text-neutral-200 font-light text-base truncate">{{ asIdentity.email }}</span>
                      <UButton icon="i-heroicons-document-duplicate" color="neutral" variant="ghost" size="xs"
                        class="opacity-0 group-hover:opacity-100 transition-opacity"
                        @click="copyToClipboard(asIdentity.email!, 'Email')" />
                    </div>
                  </div>
                </div>

                <!-- Phone -->
                <div v-if="asIdentity.phone"
                  class="group relative bg-white/2 hover:bg-white/4 rounded-2xl p-5 transition-all duration-500 ring-1 ring-transparent hover:ring-white/10 col-span-2 md:col-span-1">
                  <div class="flex flex-col gap-1.5">
                    <label
                      class="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] transition-colors group-hover:text-neutral-500">Teléfono</label>
                    <div class="flex items-center justify-between">
                      <span class="text-neutral-200 font-light text-base">{{ asIdentity.phone }}</span>
                      <UButton icon="i-heroicons-document-duplicate" color="neutral" variant="ghost" size="xs"
                        class="opacity-0 group-hover:opacity-100 transition-opacity"
                        @click="copyToClipboard(asIdentity.phone!, 'Teléfono')" />
                    </div>
                  </div>
                </div>

                <!-- Address -->
                <div v-if="asIdentity.address"
                  class="group relative bg-white/2 hover:bg-white/4 rounded-2xl p-5 transition-all duration-500 ring-1 ring-transparent hover:ring-white/10 col-span-2">
                  <div class="flex flex-col gap-1.5">
                    <label
                      class="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] transition-colors group-hover:text-neutral-500">Dirección</label>
                    <div class="flex items-start justify-between">
                      <span class="text-neutral-200 font-light text-base leading-relaxed">{{ asIdentity.address
                      }}</span>
                      <UButton icon="i-heroicons-document-duplicate" color="neutral" variant="ghost" size="xs"
                        class="opacity-0 group-hover:opacity-100 transition-opacity"
                        @click="copyToClipboard(asIdentity.address!, 'Dirección')" />
                    </div>
                  </div>
                </div>

                <!-- License / Passport Placeholders (Future proofing) -->
                <div v-if="asIdentity.licenseNumber"
                  class="group relative bg-white/2 hover:bg-white/4 rounded-2xl p-5 transition-all duration-500 ring-1 ring-transparent hover:ring-white/10 col-span-2 md:col-span-1">
                  <div class="flex flex-col gap-1.5">
                    <label class="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em]">Licencia</label>
                    <span class="text-neutral-200 font-mono text-base">{{ asIdentity.licenseNumber }}</span>
                  </div>
                </div>

                <div v-if="asIdentity.passportNumber"
                  class="group relative bg-white/2 hover:bg-white/4 rounded-2xl p-5 transition-all duration-500 ring-1 ring-transparent hover:ring-white/10 col-span-2 md:col-span-1">
                  <div class="flex flex-col gap-1.5">
                    <label class="text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em]">Pasaporte</label>
                    <span class="text-neutral-200 font-mono text-base">{{ asIdentity.passportNumber }}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
