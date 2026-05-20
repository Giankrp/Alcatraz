<script setup lang="ts">
  const emit = defineEmits(["select"])

  const isEditing = ref(false)
  const router = useRouter()
  const { t } = useI18n()

  const types = computed(() => [
    {
      id: "password",
      label: t("vault.types.password.label"),
      icon: "i-heroicons-key",
      color: "text-primary-400",
      desc: t("vault.types.password.desc"),
    },
    {
      id: "note",
      label: t("vault.types.note.label"),
      icon: "i-heroicons-document-text",
      color: "text-yellow-400",
      desc: t("vault.types.note.desc"),
    },
    {
      id: "card",
      label: t("vault.types.card.label"),
      icon: "i-heroicons-credit-card",
      color: "text-blue-400",
      desc: t("vault.types.card.desc"),
    },
    {
      id: "identity",
      label: t("vault.types.identity.label"),
      icon: "i-heroicons-user-circle",
      color: "text-green-400",
      desc: t("vault.types.identity.desc"),
    },
  ])
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <UButton
        icon="i-heroicons-arrow-left"
        color="neutral"
        variant="ghost"
        @click="isEditing ? (isEditing = false) : router.push('/boveda')"
        class="hover:bg-white/10"
      >
        {{ isEditing ? $t("vault.forms.cancelEdit") : $t("vault.forms.backToVault") }}
      </UButton>
    </div>
    <div class="text-center mb-6">
      <h3 class="text-xl font-bold text-white mb-2">{{ $t("vault.forms.whatToSave") }}</h3>
      <p class="text-gray-400 text-sm">{{ $t("vault.forms.selectTypeDesc") }}</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button
        v-for="t in types"
        :key="t.id"
        class="group relative flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-200 border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 hover:-translate-y-0.5"
        @click="emit('select', t.id)"
      >
        <div
          class="p-2.5 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors"
        >
          <UIcon :name="t.icon" class="size-6" :class="t.color" />
        </div>
        <div>
          <div
            class="font-semibold text-white text-sm group-hover:text-primary-200 transition-colors"
          >
            {{ t.label }}
          </div>
          <div class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ t.desc }}</div>
        </div>
      </button>
    </div>
  </div>
</template>
