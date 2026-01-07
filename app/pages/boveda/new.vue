<script setup lang="ts">
import TypeSelector from '~/components/vault/forms/TypeSelector.vue'

// Lazy load components
const PasswordForm = defineAsyncComponent(() => import('~/components/vault/forms/PasswordForm.vue'))
const NoteForm = defineAsyncComponent(() => import('~/components/vault/forms/NoteForm.vue'))
const CardForm = defineAsyncComponent(() => import('~/components/vault/forms/CardForm.vue'))
const IdentityForm = defineAsyncComponent(() => import('~/components/vault/forms/IdentityForm.vue'))

const { addItem } = useVault()
const router = useRouter()

const currentView = ref('selector')

const views = {
  selector: TypeSelector,
  password: PasswordForm,
  note: NoteForm,
  card: CardForm,
  identity: IdentityForm
}

const currentComponent = computed(() => views[currentView.value as keyof typeof views] || TypeSelector)

function handleSelect(type: string) {
  currentView.value = type
}

function handleBack() {
  if (currentView.value === 'selector') {
    router.push('/boveda')
  } else {
    currentView.value = 'selector'
  }
}

function handleSave(data: any) {
  // Extract createAnother flag and clean data
  const { createAnother, ...itemData } = data
  
  addItem({ type: currentView.value, ...itemData })
  
  if (createAnother) {
    currentView.value = 'selector'
  } else {
    router.push('/boveda')
  }
}
</script>

<template>
  <div class="min-h-screen vault-bg text-white font-sans selection:bg-primary-500/30 flex items-center justify-center p-4">
    <div class="w-full max-w-lg bg-[#0f1115]/90 border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden p-6">
      <!-- Background Effects -->
      <div class="absolute top-0 right-0 -mt-16 -mr-16 size-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 -mb-16 -ml-16 size-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Content -->
      <div class="relative z-10">
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform translate-x-4 opacity-0"
          enter-to-class="transform translate-x-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-x-0 opacity-100"
          leave-to-class="transform -translate-x-4 opacity-0"
          mode="out-in"
        >
          <component
            :is="currentComponent"
            @select="handleSelect"
            @back="handleBack"
            @save="handleSave"
          />
        </transition>
      </div>
    </div>
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
</style>
