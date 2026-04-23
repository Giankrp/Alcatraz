<script setup lang="ts">
import { useVault } from "~/composables/useVault";
import type {
    VaultItem,
    PasswordItem,
    NoteItem,
    CardItem,
    IdentityItem,
} from "~/types/vault";
import PasswordForm from "~/components/vault/forms/PasswordForm.vue";
import NoteForm from "~/components/vault/forms/NoteForm.vue";
import CardForm from "~/components/vault/forms/CardForm.vue";
import IdentityForm from "~/components/vault/forms/IdentityForm.vue";

definePageMeta({
    layout: "vault",
    middleware: "auth",
});

const route = useRoute();
const router = useRouter();
const {
    items,
    updateItem,
    fetchItems,
    getDecryptedItem,
    folders,
    removeItem,
    restoreItem,
    deleteItemPermanent,
} = useVault();
const toast = useToast();

const itemId = computed(() => route.params.id as string);
const item = computed(() => items.value.find((i) => i.id === itemId.value));

const isTrashed = computed(() => item.value?.trashed || false);

// Typed helpers for template
const asPassword = computed(() =>
    item.value?.item_type === "password" ? (item.value as PasswordItem) : null,
);
const asNote = computed(() =>
    item.value?.item_type === "note" ? (item.value as NoteItem) : null,
);
const asCard = computed(() =>
    item.value?.item_type === "card" ? (item.value as CardItem) : null,
);
const asIdentity = computed(() =>
    item.value?.item_type === "identity" ? (item.value as IdentityItem) : null,
);

const folderName = computed(() => {
    const fId = item.value?.folder;
    if (!fId) return "Personal";
    const found = folders.value.find((f) => f.id === fId);
    return found ? found.name : "Personal";
});

const isEditing = ref(false);
const isSaving = ref(false);
const showPassword = ref(false);
const isLoading = ref(true);
const showDeleteModal = ref(false);
const isDeleting = ref(false);

const handleDelete = async () => {
    isDeleting.value = true;
    try {
        if (isTrashed.value) {
            await deleteItemPermanent(itemId.value);
            toast.add({
                title: "Eliminado permanentemente",
                description: "El elemento ha sido borrado para siempre",
                color: "success",
                icon: "i-heroicons-trash",
            });
        } else {
            await removeItem(itemId.value);
            toast.add({
                title: "Movido a la Papelera",
                description: "El elemento ha sido movido a la papelera",
                color: "success",
                icon: "i-heroicons-trash",
            });
        }
        router.push("/boveda");
    } catch (e) {
        toast.add({
            title: "Error",
            description: "No se pudo procesar la solicitud",
            color: "error",
            icon: "i-heroicons-x-circle",
        });
    } finally {
        isDeleting.value = false;
        showDeleteModal.value = false;
    }
};

const handleRestore = async () => {
    try {
        await restoreItem(itemId.value);
        toast.add({
            title: "Elemento Restaurado",
            description: "El elemento ha vuelto a tu bóveda principal",
            color: "success",
            icon: "i-heroicons-arrow-path",
        });
        router.push("/boveda");
    } catch (e) {
        toast.add({
            title: "Error",
            description: "No se pudo restaurar el elemento",
            color: "error",
        });
    }
};

onMounted(async () => {
    const { masterKey } = useMasterPassword();
    if (!masterKey.value) {
        navigateTo("/login/unlock");
        return;
    }
    await loadItem();
});

watch(itemId, async () => {
    await loadItem();
});

const loadItem = async () => {
    isLoading.value = true;
    if (!items.value.length) {
        await fetchItems();
    }

    // Ensure the specific item is fully decrypted
    if (itemId.value) {
        try {
            await getDecryptedItem(itemId.value);
        } catch (e) {
            console.error("Error decrypting item:", e);
            toast.add({
                title: "Error",
                description: "No se pudo descifrar el elemento",
                color: "error",
            });
        }
    }

    isLoading.value = false;

    if (!item.value) {
        router.push("/boveda");
    }
};

const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard
        .writeText(text)
        .then(() => {
            toast.add({
                title: "Copiado",
                description: `${label} copiado al portapapeles`,
                color: "success",
                icon: "i-heroicons-check-circle",
            });
        })
        .catch(() => {
            toast.add({
                title: "Error",
                description: "No se pudo copiar al portapapeles",
                color: "error",
                icon: "i-heroicons-x-circle",
            });
        });
};

const handleSave = (data: any) => {
    if (item.value) {
        updateItem(itemId.value, data);
        isEditing.value = false;
        toast.add({
            title: "Actualizado",
            description: "El elemento ha sido actualizado correctamente",
            color: "success",
            icon: "i-heroicons-check-circle",
        });
    }
};

// Metadata Helpers
const timeSince = (date?: string) => {
    if (!date) return "Desconocido";
    const seconds = Math.floor(
        (new Date().getTime() - new Date(date).getTime()) / 1000,
    );
    let interval = seconds / 31536000;
    if (interval > 1) return `hace ${Math.floor(interval)} años`;
    interval = seconds / 2592000;
    if (interval > 1) return `hace ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `hace ${Math.floor(interval)} días`;
    interval = seconds / 3600;
    if (interval > 1) return `hace ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
    return "justo ahora";
};

const passwordStrength = computed(() => {
    if (item.value?.item_type !== "password" || !asPassword.value?.password)
        return null;
    const p = asPassword.value.password;
    let score = 0;

    // 1. Length (Max 40 points - needs 16+ for full points)
    score += Math.min(40, p.length * 2.5);

    // 2. Diversity (Max 40 points)
    if (/[a-z]/.test(p)) score += 10;
    if (/[A-Z]/.test(p)) score += 10;
    if (/[0-9]/.test(p)) score += 10;
    if (/[^a-zA-Z0-9]/.test(p)) score += 10;

    // 3. Complexity & Entropy (Max 20 points)
    const uniqueChars = new Set(p).size;
    if (uniqueChars > p.length / 2) score += 10; // Good variety of chars
    if (!/(.)\1{2,}/.test(p)) score += 10; // No 3+ characters repeated (e.g., "aaa")

    return Math.floor(Math.min(100, score));
});

const getComponentForType = (type: string) => {
    switch (type) {
        case "password":
            return PasswordForm;
        case "note":
            return NoteForm;
        case "card":
            return CardForm;
        case "identity":
            return IdentityForm;
        default:
            return null;
    }
};
</script>

<template>
    <div
        v-if="isLoading"
        class="min-h-screen bg-gray-950 flex items-center justify-center"
    >
        <UIcon
            name="i-heroicons-arrow-path"
            class="animate-spin text-white w-8 h-8"
        />
    </div>
    <div
        v-else-if="item"
        class="min-h-screen bg-black flex flex-col p-6 md:p-12 lg:p-20 relative overflow-hidden"
    >
        <!-- Cinematic Background -->
        <div class="absolute inset-0 pointer-events-none">
            <div
                class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(24,24,27,0.5)_0%,rgba(0,0,0,1)_80%)]"
            ></div>
            <div
                class="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
            ></div>
            <div
                class="absolute top-0 right-0 w-[60%] h-[60%] bg-white/2 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"
            ></div>

            <!-- Tech Grid Decoration -->
            <div class="absolute inset-0 opacity-[0.05] tech-grid"></div>
        </div>

        <!-- Top Navigation -->
        <div class="relative z-50 flex items-center justify-between mb-12">
            <UButton
                icon="i-heroicons-arrow-left"
                color="neutral"
                variant="ghost"
                @click="router.push('/boveda')"
                class="text-zinc-500 hover:text-white transition-all duration-500 group pl-0"
            >
                <span class="group-hover:-translate-x-1 transition-transform"
                    >Volver a la Bóveda</span
                >
            </UButton>

            <div
                class="flex items-center gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-[0.4em]"
            >
                <span>Encrypted Node: {{ itemId.slice(0, 8) }}</span>
                <div
                    class="size-1.5 rounded-full bg-emerald-500 animate-pulse"
                ></div>
            </div>
        </div>

        <!-- Layout Asimétrico -->
        <div
            class="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-start"
        >
            <!-- Lado Izquierdo: El Item (Protagonista) -->
            <div class="w-full lg:flex-1 space-y-8">
                <Transition
                    appear
                    enter-active-class="duration-1000 ease-out"
                    enter-from-class="opacity-0 translate-y-12"
                >
                    <div class="w-full">
                        <!-- Edit Mode -->
                        <div
                            v-if="isEditing"
                            class="w-full max-w-lg mx-auto relative"
                        >
                            <div
                                class="relative overflow-hidden rounded-[32px] bg-zinc-950/80 shadow-2xl ring-1 ring-white/10 p-8 backdrop-blur-3xl"
                            >
                                <component
                                    :is="getComponentForType(item.item_type)"
                                    :initial-data="item"
                                    :loading="isSaving"
                                    @save="handleSave"
                                    @back="isEditing = false"
                                    class="relative z-10"
                                />
                            </div>
                        </div>

                        <!-- View Mode -->
                        <div v-else>
                            <!-- Password Card -->
                            <div v-if="asPassword" class="group/card relative">
                                <div
                                    class="absolute -inset-4 bg-white/5 blur-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000"
                                ></div>
                                <div
                                    class="relative rounded-[40px] bg-zinc-950 shadow-2xl ring-1 ring-white/10 overflow-hidden"
                                >
                                    <div
                                        class="absolute inset-0 bg-linear-to-b from-white/3 to-transparent"
                                    ></div>

                                    <div
                                        class="p-10 flex items-start justify-between"
                                    >
                                        <div class="flex items-center gap-6">
                                            <div
                                                class="size-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center"
                                            >
                                                <UIcon
                                                    :name="asPassword.icon"
                                                    class="size-8 text-white"
                                                />
                                            </div>
                                            <div>
                                                <h1
                                                    class="text-4xl font-light text-white tracking-tight"
                                                >
                                                    {{ asPassword.title }}
                                                </h1>
                                                <p
                                                    class="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-bold"
                                                >
                                                    {{ folderName }}
                                                </p>
                                            </div>
                                        </div>
                                        <UButton
                                            icon="i-heroicons-pencil-square"
                                            color="neutral"
                                            variant="ghost"
                                            class="rounded-full h-12 w-12"
                                            @click="isEditing = true"
                                        />
                                    </div>

                                    <div class="p-10 pt-0 space-y-4">
                                        <div
                                            v-if="asPassword.username"
                                            class="p-6 rounded-2xl bg-zinc-900/50 border border-white/3 group/field"
                                        >
                                            <label
                                                class="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1 block"
                                                >Usuario</label
                                            >
                                            <div
                                                class="flex items-center justify-between"
                                            >
                                                <span
                                                    class="text-zinc-200 text-xl font-light"
                                                    >{{
                                                        asPassword.username
                                                    }}</span
                                                >
                                                <UButton
                                                    icon="i-heroicons-document-duplicate"
                                                    color="neutral"
                                                    variant="ghost"
                                                    @click="
                                                        copyToClipboard(
                                                            asPassword.username!,
                                                            'Usuario',
                                                        )
                                                    "
                                                />
                                            </div>
                                        </div>

                                        <div
                                            v-if="asPassword.password"
                                            class="p-6 rounded-2xl bg-zinc-900/50 border border-white/3 group/field"
                                        >
                                            <label
                                                class="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1 block"
                                                >Contraseña</label
                                            >
                                            <div
                                                class="flex items-center justify-between"
                                            >
                                                <span
                                                    class="text-white font-mono text-2xl tracking-tighter"
                                                    >{{
                                                        showPassword
                                                            ? asPassword.password
                                                            : "••••••••••••••••"
                                                    }}</span
                                                >
                                                <div
                                                    class="flex items-center gap-1"
                                                >
                                                    <UButton
                                                        :icon="
                                                            showPassword
                                                                ? 'i-heroicons-eye-slash'
                                                                : 'i-heroicons-eye'
                                                        "
                                                        color="neutral"
                                                        variant="ghost"
                                                        @click="
                                                            showPassword =
                                                                !showPassword
                                                        "
                                                    />
                                                    <UButton
                                                        icon="i-heroicons-document-duplicate"
                                                        color="neutral"
                                                        variant="ghost"
                                                        @click="
                                                            copyToClipboard(
                                                                asPassword.password!,
                                                                'Contraseña',
                                                            )
                                                        "
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Note Card -->
                            <div
                                v-else-if="asNote"
                                class="relative rounded-[40px] bg-zinc-950 ring-1 ring-white/10 p-12 overflow-hidden"
                            >
                                <div
                                    class="flex items-center justify-between mb-10"
                                >
                                    <div class="flex items-center gap-6">
                                        <div
                                            class="size-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center"
                                        >
                                            <UIcon
                                                :name="asNote.icon"
                                                class="size-7 text-white"
                                            />
                                        </div>
                                        <h1
                                            class="text-3xl font-light text-white tracking-tight"
                                        >
                                            {{ asNote.title }}
                                        </h1>
                                    </div>
                                    <UButton
                                        icon="i-heroicons-pencil-square"
                                        color="neutral"
                                        variant="ghost"
                                        @click="isEditing = true"
                                    />
                                </div>
                                <div
                                    class="bg-zinc-900/40 rounded-3xl p-10 border border-white/5 min-h-80 relative group/note"
                                >
                                    <p
                                        class="whitespace-pre-wrap text-zinc-400 text-xl leading-relaxed"
                                    >
                                        {{ asNote.note }}
                                    </p>
                                    <UButton
                                        icon="i-heroicons-document-duplicate"
                                        color="neutral"
                                        variant="ghost"
                                        class="absolute top-6 right-6 opacity-0 group-hover/note:opacity-100 transition-opacity"
                                        @click="
                                            copyToClipboard(
                                                asNote.note!,
                                                'Nota',
                                            )
                                        "
                                    />
                                </div>
                            </div>

                            <!-- Card/Identity (Simplified for layout) -->
                            <div v-else class="w-full">
                                <!-- Fallback to previous card logic but wrapped -->
                                <div
                                    v-if="asCard"
                                    class="relative rounded-[40px] bg-zinc-950 p-12 ring-1 ring-white/10"
                                >
                                    <!-- Repetir lógica de tarjeta visual... pero ya optimizada -->
                                    <div
                                        class="flex items-center justify-between mb-10"
                                    >
                                        <h1
                                            class="text-3xl font-light text-white"
                                        >
                                            {{ asCard.title }}
                                        </h1>
                                        <UButton
                                            icon="i-heroicons-pencil-square"
                                            color="neutral"
                                            variant="ghost"
                                            @click="isEditing = true"
                                        />
                                    </div>
                                    <div
                                        class="relative w-full aspect-[1.6] rounded-3xl overflow-hidden bg-zinc-900 ring-1 ring-white/10 mb-8 p-10 flex flex-col justify-between"
                                    >
                                        <div
                                            class="text-[10px] font-mono tracking-[0.5em] text-white/20"
                                        >
                                            ENCRYPTED CREDIT ASSET
                                        </div>
                                        <div
                                            class="text-3xl font-mono text-white tracking-widest text-center"
                                        >
                                            {{
                                                showPassword
                                                    ? asCard.number
                                                    : "•••• •••• •••• " +
                                                      asCard.number?.slice(-4)
                                            }}
                                        </div>
                                        <div
                                            class="flex justify-between items-end"
                                        >
                                            <div
                                                class="uppercase text-xs font-light text-zinc-400 tracking-widest"
                                            >
                                                {{ asCard.holder }}
                                            </div>
                                            <div
                                                class="font-mono text-zinc-400"
                                            >
                                                {{ asCard.expiry }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    v-else-if="asIdentity"
                                    class="relative rounded-[40px] bg-zinc-950 p-12 ring-1 ring-white/10"
                                >
                                    <div
                                        class="flex items-center justify-between mb-10"
                                    >
                                        <h1
                                            class="text-4xl font-light text-white"
                                        >
                                            {{ asIdentity.firstName }}
                                            {{ asIdentity.lastName }}
                                        </h1>
                                        <UButton
                                            icon="i-heroicons-pencil-square"
                                            color="neutral"
                                            variant="ghost"
                                            @click="isEditing = true"
                                        />
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <template
                                            v-for="(val, key) in {
                                                email: asIdentity.email,
                                                phone: asIdentity.phone,
                                                address: asIdentity.address,
                                            }"
                                            :key="key"
                                        >
                                            <div
                                                v-if="val"
                                                class="p-6 rounded-2xl bg-zinc-900/50 border border-white/3"
                                            >
                                                <label
                                                    class="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1 block"
                                                    >{{
                                                        String(
                                                            key,
                                                        ).toUpperCase()
                                                    }}</label
                                                >
                                                <div class="text-zinc-200">
                                                    {{ val }}
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>

            <!-- Lado Derecho: Metadatos y Auditoría -->
            <Transition
                appear
                enter-active-class="delay-300 duration-1000 ease-out"
                enter-from-class="opacity-0 translate-x-12"
            >
                <div class="w-full lg:w-96 space-y-8">
                    <!-- Security Integrity Panel -->
                    <div
                        class="p-8 rounded-[32px] bg-zinc-950 ring-1 ring-white/10 relative overflow-hidden group"
                    >
                        <div
                            class="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                        ></div>
                        <h3
                            class="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mb-6"
                        >
                            Integridad del Elemento
                        </h3>

                        <div class="space-y-6">
                            <!-- Password Analysis -->
                            <div
                                v-if="passwordStrength !== null"
                                class="space-y-4"
                            >
                                <div class="space-y-2">
                                    <div class="flex justify-between items-end">
                                        <span
                                            class="text-xs text-zinc-400 font-medium tracking-tight"
                                            >Cifrado de Contraseña</span
                                        >
                                        <span
                                            class="text-xs font-bold"
                                            :class="
                                                passwordStrength > 75
                                                    ? 'text-emerald-500'
                                                    : 'text-amber-500'
                                            "
                                            >{{
                                                passwordStrength > 75
                                                    ? "Robusto"
                                                    : "Vulnerable"
                                            }}</span
                                        >
                                    </div>
                                    <div
                                        class="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden"
                                    >
                                        <div
                                            class="h-full transition-all duration-1000"
                                            :style="{
                                                width: `${passwordStrength || 0}%`,
                                            }"
                                            :class="
                                                (passwordStrength || 0) > 75
                                                    ? 'bg-emerald-500'
                                                    : 'bg-amber-500'
                                            "
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <!-- General Meta -->
                            <div class="space-y-4 pt-4 border-t border-white/5">
                                <div class="flex justify-between group/meta">
                                    <span
                                        class="text-[10px] uppercase text-zinc-600 font-bold tracking-widest"
                                        >Creado</span
                                    >
                                    <span
                                        class="text-xs text-zinc-400 group-hover:text-white transition-colors"
                                        >{{ timeSince(item.created_at) }}</span
                                    >
                                </div>
                                <div class="flex justify-between group/meta">
                                    <span
                                        class="text-[10px] uppercase text-zinc-600 font-bold tracking-widest"
                                        >Modificado</span
                                    >
                                    <span
                                        class="text-xs text-zinc-400 group-hover:text-white transition-colors"
                                        >{{ timeSince(item.updated_at) }}</span
                                    >
                                </div>
                                <div class="flex justify-between group/meta">
                                    <span
                                        class="text-[10px] uppercase text-zinc-600 font-bold tracking-widest"
                                        >Visibilidad</span
                                    >
                                    <span
                                        class="text-xs text-emerald-500 font-bold tracking-widest"
                                        >PRIVATE NODE</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Technical Specs -->
                    <div
                        class="p-8 rounded-[32px] bg-zinc-950/40 ring-1 ring-white/5 border-dashed border-white/5"
                    >
                        <h3
                            class="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em] mb-4"
                        >
                            Encryption Props
                        </h3>
                        <div
                            class="font-mono text-[9px] text-zinc-600 space-y-1.5 overflow-hidden"
                        >
                            <div class="truncate">ID_TAG: {{ itemId }}</div>
                            <div>VERSION: 4.2.0-STABLE</div>
                            <div>CHIP: AES-GCM-256V2</div>
                            <div>SALT_IV: [REDACTED_MEMORY]</div>
                        </div>
                    </div>

                    <!-- Danger Zone -->
                    <div class="pt-8 border-t border-white/5 space-y-3">
                        <UButton
                            v-if="isTrashed"
                            icon="i-heroicons-arrow-path"
                            color="success"
                            variant="soft"
                            block
                            label="Restaurar"
                            class="rounded-2xl py-4"
                            @click="handleRestore"
                        />
                        <UButton
                            icon="i-heroicons-trash"
                            color="error"
                            variant="soft"
                            block
                            :label="
                                isTrashed
                                    ? 'Borrar PermanenteMente'
                                    : 'Mover a la Papelera'
                            "
                            class="rounded-2xl py-4 opacity-50 hover:opacity-100 transition-opacity"
                            @click="showDeleteModal = true"
                        />
                    </div>
                </div>
            </Transition>
        </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="showDeleteModal">
        <template #content>
            <div class="p-8 bg-zinc-950 ring-1 ring-white/10 rounded-[32px]">
                <div class="flex items-center gap-4 mb-6">
                    <div
                        class="size-12 rounded-2xl flex items-center justify-center"
                        :class="
                            isTrashed
                                ? 'bg-red-500/10 border border-red-500/20'
                                : 'bg-amber-500/10 border border-amber-500/20'
                        "
                    >
                        <UIcon
                            :name="
                                isTrashed
                                    ? 'i-heroicons-exclamation-triangle'
                                    : 'i-heroicons-trash'
                            "
                            class="size-6"
                            :class="
                                isTrashed ? 'text-red-500' : 'text-amber-500'
                            "
                        />
                    </div>
                    <div>
                        <h3 class="text-xl font-light text-white">
                            {{
                                isTrashed
                                    ? "¿Eliminar para siempre?"
                                    : "¿Mover a la papelera?"
                            }}
                        </h3>
                        <p class="text-sm text-zinc-500">
                            {{
                                isTrashed
                                    ? "Esta acción es irreversible y los datos se perderán."
                                    : "Podrás restaurar este elemento desde la papelera más tarde."
                            }}
                        </p>
                    </div>
                </div>

                <div class="flex gap-4">
                    <UButton
                        label="Cancelar"
                        color="neutral"
                        variant="ghost"
                        block
                        class="flex-1"
                        @click="showDeleteModal = false"
                    />
                    <UButton
                        :label="
                            isTrashed
                                ? 'Eliminar Permanentemente'
                                : 'Mover a Papelera'
                        "
                        color="error"
                        variant="solid"
                        block
                        class="flex-1"
                        :loading="isDeleting"
                        @click="handleDelete"
                    />
                </div>
            </div>
        </template>
    </UModal>
</template>

<style scoped>
.glass-card-dark {
    position: relative;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(24px) saturate(120%);
    -webkit-backdrop-filter: blur(24px) saturate(120%);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow:
        0 12px 32px rgba(0, 0, 0, 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
    overflow: hidden;
}

.glass-card-dark {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.glass-card-dark::before {
    content: "";
    position: absolute;
    inset: -30% -10% auto -10%;
    height: 200px;
    background: radial-gradient(
        120px 60px at 20% 50%,
        rgba(255, 255, 255, 0.35),
        rgba(255, 255, 255, 0)
    );
    filter: blur(24px);
    transform: translate3d(0, 0, 0);
    animation: glassShift 12s ease-in-out infinite;
}

.glass-card-dark::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.bubble {
    position: absolute;
    border-radius: 9999px;
    filter: blur(12px);
    background: radial-gradient(
        circle at 30% 30%,
        rgba(255, 255, 255, 0.85),
        rgba(255, 255, 255, 0.2)
    );
    mix-blend-mode: screen;
    opacity: 0.85;
    animation: float 14s ease-in-out infinite;
}

.login-bg {
    isolation: isolate;
    background:
        radial-gradient(
            1000px 500px at 10% 10%,
            rgba(255, 255, 255, 0.08),
            rgba(255, 255, 255, 0)
        ),
        radial-gradient(
            800px 400px at 80% 20%,
            rgba(255, 255, 255, 0.06),
            rgba(255, 255, 255, 0)
        ),
        linear-gradient(180deg, #0b0b0d, #121217 60%, #0b0b0d);
}

.bubble-1 {
    width: 220px;
    height: 220px;
    top: 6%;
    left: 8%;
    animation-duration: 12s;
}

.bubble-2 {
    width: 160px;
    height: 160px;
    top: 18%;
    right: 8%;
    animation-duration: 10s;
    animation-delay: 0.6s;
}

.bubble-3 {
    width: 280px;
    height: 280px;
    bottom: 6%;
    left: 4%;
    animation-duration: 14s;
    animation-delay: 1.2s;
}

.bubble-4 {
    width: 180px;
    height: 180px;
    bottom: 12%;
    right: 10%;
    animation-duration: 11s;
    animation-delay: 1.8s;
}

.bubble-5 {
    width: 120px;
    height: 120px;
    top: 48%;
    left: 44%;
    animation-duration: 9s;
    animation-delay: 0.3s;
}

.bubble-6 {
    width: 200px;
    height: 200px;
    top: 68%;
    right: 38%;
    animation-duration: 13s;
    animation-delay: 1.1s;
}

@keyframes float {
    0%,
    100% {
        transform: translate3d(0, 0, 0) scale(1);
        opacity: 0.75;
    }

    20% {
        transform: translate3d(24px, -28px, 0) scale(1.03);
        opacity: 0.85;
    }

    50% {
        transform: translate3d(-20px, 18px, 0) scale(1.07);
        opacity: 0.7;
    }

    80% {
        transform: translate3d(16px, -12px, 0) scale(1.02);
        opacity: 0.8;
    }
}

@keyframes glassShift {
    0%,
    100% {
        transform: translate3d(0, 0, 0);
        opacity: 0.9;
    }

    50% {
        transform: translate3d(20px, -10px, 0);
        opacity: 0.75;
    }
}

.tech-grid {
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
    background-size: 40px 40px;
}
</style>
