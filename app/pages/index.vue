<script lang="ts" setup>
useHead({
  title: 'Gestor de contraseñas y notas cifradas',
  meta: [
    { name: 'description', content: 'Alcatraz: seguridad de nivel máximo para tus contraseñas y notas con cifrado AES-256 y arquitectura zero-knowledge.' },
    { property: 'og:title', content: 'Alcatraz — Seguridad máxima para tus datos' },
    { property: 'og:description', content: 'Protege contraseñas y notas cifradas con AES-256 y zero-knowledge.' }
  ]
})
</script>

<template>
  <div>
    <!-- Hero -->
    <UContainer class="pt-16 pb-24">
      <div class="flex justify-center">
        <UBadge color="neutral" variant="soft" size="md" class="px-4 py-2 rounded-2xl text-neutral-100 bg-accented">
          Seguridad de máxima protección
        </UBadge>
      </div>

      <h1 class="mt-10 text-center text-5xl md:text-7xl font-extrabold tracking-tight">
        Tus secretos bajo
        <span class="block opacity-70">máxima seguridad</span>
      </h1>

      <p class="mt-8 mx-auto max-w-3xl text-center opacity-70">
        Como la prisión más segura del mundo, Alcatraz protege tus contraseñas
        y notas con cifrado militar. Nadie entra, nadie sale sin tu autorización.
      </p>

      <div class="mt-10 flex items-center justify-center gap-4">
        <UButton to="/login" color="neutral" variant="solid" trailing-icon="i-heroicons-arrow-right-16-solid" class="hover:translate-x-1 transition-transform">
          Comenzar Ahora
        </UButton>
        <UButton to="/demo" variant="outline" color="neutral" class="bg-black text-white font-semibold text-xs px-4 py-2 hover:bg-black/90  hover:translate-x-1 transition-transform">Ver Demo</UButton>
      </div>

      <!-- Resumen (tres tarjetas) -->
      <div class="mt-16 grid gap-6 sm:grid-cols-3">
        <UCard class=" bg-black text-white">
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-lock-closed" class="size-5" />
              <div class="text-xl font-bold">256-bit</div>
            </div>
            <div class="text-sm opacity-70">Cifrado AES</div>
          </template>
        </UCard>

        <UCard class=" bg-black text-white">
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-document-text" class="size-5" />
              <div class="text-xl font-bold">Ilimitadas</div>
            </div>
            <div class="text-sm opacity-70">Notas cifradas</div>
          </template>
        </UCard>

        <UCard class=" bg-black text-white">
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-shield-check" class="size-5" />
              <div class="text-xl font-bold">Zero-knowledge</div>
            </div>
            <div class="text-sm opacity-70">Arquitectura</div>
          </template>
        </UCard>
      </div>
    </UContainer>

    <!-- Características completas -->
    <UContainer id="caracteristicas" class="pt-8 pb-24">
      <h2 class="text-center text-4xl md:text-5xl font-extrabold">Todo lo que necesitas para estar seguro</h2>
      <p class="mt-4 text-center opacity-70">Funciones diseñadas para proteger tu información más valiosa</p>

      <div class="mt-10 grid gap-6 md:grid-cols-3">
        <!-- Usa SecurityCard con UCard internamente -->
        <SecurityCard
          title="Gestor de Contraseñas"
          description="Almacena y genera contraseñas seguras con un solo clic. Autocompletado inteligente en todos tus sitios web."
          icon="i-heroicons-key"
        />
        <SecurityCard
          title="Notas Cifradas"
          description="Guarda información sensible como números de tarjetas, códigos y documentos con cifrado de extremo a extremo."
          icon="i-heroicons-document-text"
        />
        <SecurityCard
          title="Multiplataforma"
          description="Accede desde iOS, Android, Windows, Mac y Linux. Sincronización instantánea."
          icon="i-heroicons-device-phone-mobile"
        />
        <SecurityCard
          title="Backup Automático"
          description="Respaldo automático en la nube con cifrado. Nunca pierdas tu información."
          icon="i-heroicons-cloud"
        />
        <SecurityCard
          title="Autenticación Biométrica"
          description="Desbloqueo con huella dactilar o reconocimiento facial. Seguridad sin complicaciones."
          icon="i-heroicons-finger-print"
        />
        <SecurityCard
          title="Auditoría de Seguridad"
          description="Analiza la fortaleza de tus contraseñas y recibe alertas de brechas conocidas."
          icon="i-heroicons-shield-check"
        />
      </div>
    </UContainer>

    <!-- Seguridad en cada paso -->
    <UContainer id="seguridad" class="pt-8 pb-24 ">
      <h2 class="text-center text-4xl md:text-5xl font-extrabold">Seguridad en cada paso</h2>
      <p class="mt-4 text-center opacity-70">
        Tu privacidad es nuestra prioridad. Implementamos los más altos estándares de seguridad.
      </p>

      <div class="mt-10 grid gap-6 md:grid-cols-2">
        <UCard class="md:p-8 bg-black text-white">
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-lock-closed" class="size-5" />
              <div class="text-xl md:text-2xl font-bold">Cifrado de extremo a extremo</div>
            </div>
          </template>

          <p class="opacity-70">
            Utilizamos cifrado AES-256, el mismo estándar usado por bancos y gobiernos.
            Tus datos se cifran en tu dispositivo antes de enviarse a la nube.
          </p>

          <ul class="mt-5 space-y-3">
            <li class="flex items-center gap-3 opacity-70">
              <UIcon name="i-heroicons-check-circle" class="size-5" />
              Cifrado AES-256 en reposo y en tránsito
            </li>
            <li class="flex items-center gap-3 opacity-70">
              <UIcon name="i-heroicons-check-circle" class="size-5" />
              Derivación de claves con Argon2id, el estándar de seguridad de última generación
            </li>
            <li class="flex items-center gap-3 opacity-70">
              <UIcon name="i-heroicons-check-circle" class="size-5" />
              Autenticación de dos factores (2FA) disponible
            </li>
          </ul>
        </UCard>

        <div class="grid gap-6 ">
          <UCard class=" bg-black text-white">
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-eye-slash" class="size-5" />
                <div class="text-base sm:text-lg font-semibold">Arquitectura Zero-Knowledge</div>
              </div>
            </template>
            <p class="opacity-70">
              Ni siquiera nosotros podemos ver tus datos. Solo tú tienes acceso a tu información.
            </p>
          </UCard>

          <UCard class=" bg-black text-white">
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-server-stack" class="size-5" />
                <div class="text-base sm:text-lg font-semibold">Infraestructura Segura</div>
              </div>
            </template>
            <p class="opacity-70">
              Centros de datos certificados con monitoreo 24/7 y auditorías regulares.
            </p>
          </UCard>

          <UCard class=" bg-black text-white">
            <template #header>
              <div class="flex items-center gap-3">
                <UIcon name="i-heroicons-code-bracket" class="size-5" />
                <div class="text-base sm:text-lg font-semibold">Código Abierto</div>
              </div>
            </template>
            <p class="opacity-70">
              Transparencia total: nuestro código es auditado por la comunidad.
            </p>
          </UCard>
        </div>
      </div>
    </UContainer>

    <!-- CTA final -->
    <section class="bg-black text-white">
      <UContainer class="py-24 text-center">
        <h2 class="text-4xl md:text-5xl font-extrabold">
          Comienza a proteger tus datos hoy mismo
        </h2>
        <p class="mt-4 text-neutral-300">
          Únete a más de 100,000 usuarios. Prueba gratis 30 días, sin tarjeta.
        </p>

        <div class="mt-8 flex justify-center gap-4">
          <UButton to="/registro" color="neutral" variant="solid" icon="i-heroicons-arrow-right-16-solid" class="btn btn-lg">
            Comenzar Gratis
          </UButton>
          <UButton to="/contacto" color="neutral" variant="outline" class="btn btn-lg btn-ghost">Hablar con Ventas</UButton>
        </div>

      <div class="mt-6 flex flex-wrap justify-center gap-6 text-base text-neutral-300">
          <span class="inline-flex items-center gap-2">
            <UIcon name="i-heroicons-check-circle" class="size-4" />
            Sin tarjeta de crédito
          </span>
          <span class="inline-flex items-center gap-2">
            <UIcon name="i-heroicons-check-circle" class="size-4" />
            Cancela cuando quieras
          </span>
          <span class="inline-flex items-center gap-2">
            <UIcon name="i-heroicons-check-circle" class="size-4" />
            Soporte 24/7
          </span>
        </div>
      </UContainer>
    </section>
  </div>
</template>
