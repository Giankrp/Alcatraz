<script setup lang="ts">
  import { z } from "zod"
  import FormLayout from "./FormLayout.vue"

  const emit = defineEmits(["back", "save"])

  const props = defineProps<{
    initialData?: any
    loading?: boolean
  }>()

  const { t } = useI18n()

  const schema = z.object({
    title: z.string().min(1, t("vault.forms.identityForm.zodRequired")),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().or(z.literal("")),
    phone: z.string(),
    address: z.string(),
    licenseNumber: z.string().optional(),
    passportNumber: z.string().optional(),
    folder: z.string(),
  })

  const { folders: rawFolders } = useVault()
  const folderOptions = computed(() =>
    rawFolders.value.map(f => ({
      label: f.name,
      value: f.id,
    })),
  )

  const defaultFolderId = computed(() => rawFolders.value.find(f => f.is_default)?.id || "personal")

  const state = reactive({
    title: props.initialData?.title || "",
    firstName: props.initialData?.firstName || "",
    lastName: props.initialData?.lastName || "",
    email: props.initialData?.email || "",
    phone: props.initialData?.phone || "",
    address: props.initialData?.address || "",
    licenseNumber: props.initialData?.licenseNumber || "",
    passportNumber: props.initialData?.passportNumber || "",
    folder: props.initialData?.folder || defaultFolderId.value,
  })

  function handleSaveLayout() {
    emit("save", { ...state })
  }
</script>

<template>
  <FormLayout
    :title="initialData ? $t('vault.forms.identityForm.edit') : $t('vault.forms.identityForm.new')"
    :can-save="true"
    :is-editing="!!initialData"
    :loading="loading"
    @back="emit('back')"
    @save="handleSaveLayout"
  >
    <UForm :schema="schema" :state="state" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField :label="$t('vault.forms.identityForm.titleLabel')" name="title">
          <UInput
            v-model="state.title"
            :placeholder="$t('vault.forms.identityForm.titlePlaceholder')"
            icon="i-heroicons-tag"
            variant="none"
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
            autocomplete="off"
          />
        </UFormField>

        <UFormField :label="$t('vault.forms.identityForm.folderLabel')" name="folder">
          <USelect
            v-model="state.folder"
            :items="folderOptions"
            variant="none"
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
            icon="i-heroicons-folder"
          />
        </UFormField>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField :label="$t('vault.forms.identityForm.firstNameLabel')" name="firstName">
          <UInput
            v-model="state.firstName"
            :placeholder="$t('vault.forms.identityForm.firstNamePlaceholder')"
            variant="none"
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
            autocomplete="off"
          />
        </UFormField>
        <UFormField :label="$t('vault.forms.identityForm.lastNameLabel')" name="lastName">
          <UInput
            v-model="state.lastName"
            :placeholder="$t('vault.forms.identityForm.lastNamePlaceholder')"
            variant="none"
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
            autocomplete="off"
          />
        </UFormField>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField :label="$t('vault.forms.identityForm.emailLabel')" name="email">
          <UInput
            v-model="state.email"
            :placeholder="$t('vault.forms.identityForm.emailPlaceholder')"
            icon="i-heroicons-envelope"
            variant="none"
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
            autocomplete="off"
          />
        </UFormField>
        <UFormField :label="$t('vault.forms.identityForm.phoneLabel')" name="phone">
          <UInput
            v-model="state.phone"
            :placeholder="$t('vault.forms.identityForm.phonePlaceholder')"
            icon="i-heroicons-phone"
            variant="none"
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
            autocomplete="off"
          />
        </UFormField>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UFormField :label="$t('vault.forms.identityForm.licenseLabel')" name="licenseNumber">
          <UInput
            v-model="state.licenseNumber"
            :placeholder="$t('vault.forms.identityForm.licensePlaceholder')"
            icon="i-heroicons-identification"
            variant="none"
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
            autocomplete="off"
          />
        </UFormField>
        <UFormField :label="$t('vault.forms.identityForm.passportLabel')" name="passportNumber">
          <UInput
            v-model="state.passportNumber"
            :placeholder="$t('vault.forms.identityForm.passportPlaceholder')"
            icon="i-heroicons-globe-alt"
            variant="none"
            class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors"
            autocomplete="off"
          />
        </UFormField>
      </div>

      <UFormField :label="$t('vault.forms.identityForm.addressLabel')" name="address">
        <UTextarea
          v-model="state.address"
          :rows="3"
          :placeholder="$t('vault.forms.identityForm.addressPlaceholder')"
          variant="none"
          class="bg-white/5 rounded-lg border border-white/5 focus-within:border-white/20 transition-colors bottom-3"
          autocomplete="off"
          autoresize
        />
      </UFormField>

      <div class="rounded-xl bg-white/5 p-4 border border-white/5 flex gap-4 items-start">
        <div class="p-2 bg-white/5 rounded-lg">
          <UIcon name="i-heroicons-shield-check" class="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 class="text-sm font-medium text-white mb-1">
            {{ $t("vault.forms.identityForm.noticeTitle") }}
          </h4>
          <p class="text-xs text-gray-400 leading-relaxed">
            {{ $t("vault.forms.identityForm.noticeDesc") }}
          </p>
        </div>
      </div>
    </UForm>
  </FormLayout>
</template>
