<script setup lang="ts">
definePageMeta({
    layout: 'vault',
    middleware: 'auth'
})

useHead({
    title: 'Perfil',
    meta: [
        { name: 'description', content: 'Gestiona tu perfil y configuración de seguridad en Alcatraz.' }
    ]
})

const { email, initials, avatarColor, createdAt, fetchUser } = useUser()

onMounted(() => {
    fetchUser()
})

const formattedDate = computed(() => {
    if (!createdAt.value) return 'Desconocida'
    return new Date(createdAt.value).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
})

// Placeholder actions
const showDeleteModal = ref(false)
const showPasswordModal = ref(false)
const twoFactorEnabled = ref(false)

const sessions = ref([
    { browser: 'Chrome', os: 'Linux', ip: '192.168.1.x', current: true, lastActive: 'Ahora' },
    { browser: 'Safari', os: 'iOS', ip: '10.0.0.x', current: false, lastActive: 'Hace 2 horas' },
])
</script>

<template>
    <div class="min-h-screen vault-bg text-white font-sans selection:bg-primary-500/30">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
            <!-- Back navigation -->
            <UButton to="/boveda" variant="ghost" color="neutral" size="sm" icon="i-heroicons-arrow-left"
                class="mb-8 text-neutral-400 hover:text-white transition-colors">
                Volver a la bóveda
            </UButton>

            <!-- Profile Header -->
            <div class="profile-header-card p-6 sm:p-8 mb-8 animate-fade-up">
                <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <!-- Avatar -->
                    <div class="relative group">
                        <div class="avatar-glow absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"
                            :style="{ background: avatarColor }" />
                        <div class="relative size-20 sm:size-24 rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold border-2 border-white/10 shadow-xl transition-transform duration-300 group-hover:scale-105"
                            :style="{ background: avatarColor }">
                            {{ initials }}
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0 text-center sm:text-left">
                        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Mi Perfil</h1>
                        <p class="mt-1 text-neutral-400 truncate">{{ email || 'Cargando...' }}</p>
                        <div class="mt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
                            <span
                                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <UIcon name="i-heroicons-shield-check" class="size-3" />
                                Zero-Knowledge
                            </span>
                            <span
                                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-neutral-400 border border-white/10">
                                <UIcon name="i-heroicons-calendar" class="size-3" />
                                Desde {{ formattedDate }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Account Section -->
            <section class="mb-6 animate-fade-up animate-delay-100">
                <h2 class="section-label">Cuenta</h2>
                <div class="settings-card">
                    <!-- Email row -->
                    <div class="settings-row">
                        <div class="flex items-center gap-3 min-w-0">
                            <div class="settings-icon">
                                <UIcon name="i-heroicons-envelope" class="size-4" />
                            </div>
                            <div class="min-w-0">
                                <div class="text-sm font-medium">Email</div>
                                <div class="text-xs text-neutral-500 truncate">{{ email }}</div>
                            </div>
                        </div>
                        <span class="text-xs text-neutral-600">No modificable</span>
                    </div>

                    <div class="settings-divider" />

                    <!-- Password row -->
                    <div class="settings-row">
                        <div class="flex items-center gap-3">
                            <div class="settings-icon">
                                <UIcon name="i-heroicons-key" class="size-4" />
                            </div>
                            <div>
                                <div class="text-sm font-medium">Contraseña Maestra</div>
                                <div class="text-xs text-neutral-500">Última modificación: desconocida</div>
                            </div>
                        </div>
                        <UButton variant="outline" color="neutral" size="xs"
                            class="text-xs border-white/10 hover:border-white/20" @click="showPasswordModal = true">
                            Cambiar
                        </UButton>
                    </div>
                </div>
            </section>

            <!-- Security Section -->
            <section class="mb-6 animate-fade-up animate-delay-200">
                <h2 class="section-label">Seguridad</h2>
                <div class="settings-card">
                    <!-- 2FA row -->
                    <div class="settings-row">
                        <div class="flex items-center gap-3">
                            <div class="settings-icon text-amber-400 bg-amber-500/10">
                                <UIcon name="i-heroicons-device-phone-mobile" class="size-4" />
                            </div>
                            <div>
                                <div class="text-sm font-medium">Autenticación de dos factores</div>
                                <div class="text-xs text-neutral-500">
                                    {{ twoFactorEnabled ? 'Activada' : 'No configurada' }}
                                </div>
                            </div>
                        </div>
                        <USwitch v-model="twoFactorEnabled" color="primary" />
                    </div>

                    <div class="settings-divider" />

                    <!-- Sessions -->
                    <div class="px-5 py-4">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-3">
                                <div class="settings-icon text-blue-400 bg-blue-500/10">
                                    <UIcon name="i-heroicons-computer-desktop" class="size-4" />
                                </div>
                                <div class="text-sm font-medium">Sesiones activas</div>
                            </div>
                            <span class="text-xs text-neutral-500">{{ sessions.length }} dispositivos</span>
                        </div>

                        <div class="space-y-2">
                            <div v-for="(session, idx) in sessions" :key="idx"
                                class="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5 hover:border-white/10 transition-colors">
                                <div class="flex items-center gap-3 min-w-0">
                                    <UIcon
                                        :name="session.os === 'iOS' ? 'i-heroicons-device-phone-mobile' : 'i-heroicons-computer-desktop'"
                                        class="size-4 text-neutral-500 shrink-0" />
                                    <div class="min-w-0">
                                        <div class="text-sm">
                                            {{ session.browser }} · {{ session.os }}
                                            <span v-if="session.current"
                                                class="ml-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                                                Actual
                                            </span>
                                        </div>
                                        <div class="text-xs text-neutral-600">{{ session.ip }} · {{ session.lastActive
                                        }}</div>
                                    </div>
                                </div>
                                <UButton v-if="!session.current" variant="ghost" color="neutral" size="xs"
                                    icon="i-heroicons-x-mark" class="text-neutral-500 hover:text-red-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Export Section -->
            <section class="mb-6 animate-fade-up animate-delay-300">
                <h2 class="section-label">Datos</h2>
                <div class="settings-card">
                    <div class="settings-row">
                        <div class="flex items-center gap-3">
                            <div class="settings-icon text-purple-400 bg-purple-500/10">
                                <UIcon name="i-heroicons-arrow-down-tray" class="size-4" />
                            </div>
                            <div>
                                <div class="text-sm font-medium">Exportar bóveda</div>
                                <div class="text-xs text-neutral-500">Descarga una copia cifrada de todos tus datos
                                </div>
                            </div>
                        </div>
                        <UButton variant="outline" color="neutral" size="xs"
                            class="text-xs border-white/10 hover:border-white/20">
                            Exportar
                        </UButton>
                    </div>
                </div>
            </section>

            <!-- Danger Zone -->
            <section class="mb-12 animate-fade-up animate-delay-400">
                <h2 class="section-label text-red-400/70">Zona de peligro</h2>
                <div class="settings-card border-red-500/10">
                    <div class="settings-row">
                        <div class="flex items-center gap-3">
                            <div class="settings-icon text-red-400 bg-red-500/10">
                                <UIcon name="i-heroicons-trash" class="size-4" />
                            </div>
                            <div>
                                <div class="text-sm font-medium text-red-400">Eliminar cuenta</div>
                                <div class="text-xs text-neutral-500">Esto eliminará permanentemente tu cuenta y todos
                                    tus datos</div>
                            </div>
                        </div>
                        <UButton variant="outline" color="error" size="xs" class="text-xs"
                            @click="showDeleteModal = true">
                            Eliminar
                        </UButton>
                    </div>
                </div>
            </section>

            <!-- Delete Account Modal -->
            <UModal v-model:open="showDeleteModal">
                <template #content>
                    <div class="p-6 bg-neutral-950 border border-white/10 rounded-2xl">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="size-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                <UIcon name="i-heroicons-exclamation-triangle" class="size-5 text-red-400" />
                            </div>
                            <h3 class="text-lg font-bold">Eliminar cuenta</h3>
                        </div>
                        <p class="text-sm text-neutral-400 mb-6">
                            Esta acción es irreversible. Todos tus datos, contraseñas y notas cifradas serán eliminados
                            permanentemente.
                        </p>
                        <div class="flex justify-end gap-3">
                            <UButton variant="ghost" color="neutral" @click="showDeleteModal = false">
                                Cancelar
                            </UButton>
                            <UButton variant="solid" color="error">
                                Sí, eliminar mi cuenta
                            </UButton>
                        </div>
                    </div>
                </template>
            </UModal>

            <!-- Change Password Modal -->
            <UModal v-model:open="showPasswordModal">
                <template #content>
                    <div class="p-6 bg-neutral-950 border border-white/10 rounded-2xl">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <UIcon name="i-heroicons-key" class="size-5 text-emerald-400" />
                            </div>
                            <h3 class="text-lg font-bold">Cambiar contraseña maestra</h3>
                        </div>
                        <div class="space-y-4 mb-6">
                            <UInput type="password" placeholder="Contraseña actual" class="w-full"
                                :ui="{ base: 'bg-black border-white/10' }" />
                            <UInput type="password" placeholder="Nueva contraseña" class="w-full"
                                :ui="{ base: 'bg-black border-white/10' }" />
                            <UInput type="password" placeholder="Confirmar nueva contraseña" class="w-full"
                                :ui="{ base: 'bg-black border-white/10' }" />
                        </div>
                        <div class="flex justify-end gap-3">
                            <UButton variant="ghost" color="neutral" @click="showPasswordModal = false">
                                Cancelar
                            </UButton>
                            <UButton class="btn-accent" @click="showPasswordModal = false">
                                Guardar
                            </UButton>
                        </div>
                    </div>
                </template>
            </UModal>
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

.profile-header-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 20px;
    backdrop-filter: blur(10px);
}

.section-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.35);
    padding-left: 4px;
    margin-bottom: 8px;
}

.settings-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 16px;
    overflow: hidden;
}

.settings-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    transition: background 0.2s ease;
}

.settings-row:hover {
    background: rgba(255, 255, 255, 0.02);
}

.settings-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.05);
    margin: 0 1.25rem;
}

.settings-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.6);
    flex-shrink: 0;
}

.avatar-glow {
    animation: avatarPulse 4s ease-in-out infinite;
}

@keyframes avatarPulse {

    0%,
    100% {
        opacity: 0.3;
        transform: scale(0.95);
    }

    50% {
        opacity: 0.6;
        transform: scale(1.05);
    }
}
</style>
