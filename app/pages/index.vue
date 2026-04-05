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
    <UContainer class="pt-20 pb-28 hero-glow relative">
      <div class="relative z-10">
        <div class="flex justify-center animate-fade-up">
          <UBadge color="neutral" variant="soft" size="md"
            class="px-4 py-2 rounded-full border border-green-500/20 bg-green-500/10 text-green-400">
            <UIcon name="i-heroicons-shield-check" class="size-3.5 mr-1" />
            Seguridad de máxima protección
          </UBadge>
        </div>

        <h1
          class="mt-10 text-center text-5xl md:text-7xl font-extrabold tracking-tight animate-fade-up animate-delay-100">
          Tus secretos bajo
          <span class="block bg-linear-to-r from-green-400 via-green-300 to-green-500 bg-clip-text text-transparent">
            máxima seguridad
          </span>
        </h1>

        <p class="mt-8 mx-auto max-w-2xl text-center text-neutral-400 text-lg animate-fade-up animate-delay-200">
          Como la prisión más segura del mundo, Alcatraz protege tus contraseñas
          y notas con cifrado militar. Nadie entra, nadie sale sin tu autorización.
        </p>

        <div class="mt-10 flex items-center justify-center gap-4 animate-fade-up animate-delay-300">
          <UButton to="/login" class="btn-accent btn-lg hover:scale-[1.02] transition-transform">
            Comenzar Ahora
            <UIcon name="i-heroicons-arrow-right-16-solid" class="size-4" />
          </UButton>
          <UButton to="/demo" variant="outline" color="neutral"
            class="btn btn-lg btn-ghost hover:scale-[1.02] transition-transform hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400">
            Ver Demo
          </UButton>
        </div>

        <!-- Stat cards -->
        <div class="mt-16 grid gap-5 sm:grid-cols-3 animate-fade-up animate-delay-400">
          <div class="stat-card flex items-center gap-4">
            <div class="icon-accent">
              <UIcon name="i-heroicons-lock-closed" class="size-5" />
            </div>
            <div>
              <div class="text-2xl font-bold tracking-tight">256-bit</div>
              <div class="text-sm text-neutral-400">Cifrado AES</div>
            </div>
          </div>

          <div class="stat-card flex items-center gap-4">
            <div class="icon-accent">
              <UIcon name="i-heroicons-document-text" class="size-5" />
            </div>
            <div>
              <div class="text-2xl font-bold tracking-tight">Ilimitadas</div>
              <div class="text-sm text-neutral-400">Notas cifradas</div>
            </div>
          </div>

          <div class="stat-card flex items-center gap-4">
            <div class="icon-accent">
              <UIcon name="i-heroicons-shield-check" class="size-5" />
            </div>
            <div>
              <div class="text-2xl font-bold tracking-tight">Zero-knowledge</div>
              <div class="text-sm text-neutral-400">Arquitectura</div>
            </div>
          </div>
        </div>

        <!-- Hero Dashboard Mockup -->
        <div class="mt-20 animate-fade-up animate-delay-500">
          <div class="hero-mockup-wrapper">
            <div class="hero-mockup-glow" />
            <div class="hero-mockup-frame">
              <!-- Browser chrome -->
              <div class="browser-bar">
                <div class="flex items-center gap-1.5">
                  <span class="size-2.5 rounded-full bg-white/10" />
                  <span class="size-2.5 rounded-full bg-white/10" />
                  <span class="size-2.5 rounded-full bg-white/10" />
                </div>
                <div class="browser-url">
                  <UIcon name="i-heroicons-lock-closed" class="size-2.5 text-green-400" />
                  <span>alcatraz.app/boveda</span>
                </div>
                <div />
              </div>
              <!-- Screenshot -->
              <NuxtImg src="/images/hero-dashboard.png" alt="Alcatraz — Panel de la bóveda"
                class="w-full block rounded-b-xl" loading="eager" />
            </div>
          </div>
        </div>
      </div>
    </UContainer>

    <div class="section-divider" />

    <!-- Características completas -->
    <section class="bg-(--surface-1)">
      <UContainer id="caracteristicas" class="py-24">
        <h2 class="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold animate-fade-up">
          Todo lo que necesitas para estar seguro
        </h2>
        <p class="mt-4 text-center text-neutral-400 px-4 animate-fade-up animate-delay-100">
          Funciones diseñadas para proteger tu información más valiosa
        </p>

        <div class="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          <SecurityCard title="Gestor de Contraseñas"
            description="Almacena y genera contraseñas seguras con un solo clic. Autocompletado inteligente en todos tus sitios web."
            icon="i-heroicons-key" class="animate-fade-up animate-delay-100" />
          <SecurityCard title="Notas Cifradas"
            description="Guarda información sensible como números de tarjetas, códigos y documentos con cifrado de extremo a extremo."
            icon="i-heroicons-document-text" class="animate-fade-up animate-delay-200" />
          <SecurityCard title="Multiplataforma"
            description="Accede desde iOS, Android, Windows, Mac y Linux. Sincronización instantánea."
            icon="i-heroicons-device-phone-mobile" class="animate-fade-up animate-delay-300" />
          <SecurityCard title="Backup Automático"
            description="Respaldo automático en la nube con cifrado. Nunca pierdas tu información."
            icon="i-heroicons-cloud" class="animate-fade-up animate-delay-400" />
          <SecurityCard title="Autenticación Biométrica"
            description="Desbloqueo con huella dactilar o reconocimiento facial. Seguridad sin complicaciones."
            icon="i-heroicons-finger-print" class="animate-fade-up animate-delay-500" />
          <SecurityCard title="Auditoría de Seguridad"
            description="Analiza la fortaleza de tus contraseñas y recibe alertas de brechas conocidas."
            icon="i-heroicons-shield-check" class="animate-fade-up animate-delay-600" />
        </div>
      </UContainer>
    </section>

    <div class="section-divider" />

    <!-- Seguridad en cada paso -->
    <UContainer id="seguridad" class="py-24">
      <h2 class="text-center text-4xl md:text-5xl font-extrabold animate-fade-up">Seguridad en cada paso</h2>
      <p class="mt-4 text-center text-neutral-400 animate-fade-up animate-delay-100">
        Tu privacidad es nuestra prioridad. Implementamos los más altos estándares de seguridad.
      </p>

      <div class="mt-12 grid gap-5 md:grid-cols-2">
        <!-- Large featured card -->
        <div class="landing-card-accent md:p-8 p-6 animate-fade-up animate-delay-200">
          <div class="flex items-center gap-3 mb-5">
            <div class="icon-accent">
              <UIcon name="i-heroicons-lock-closed" class="size-5" />
            </div>
            <div class="text-xl md:text-2xl font-bold">Cifrado de extremo a extremo</div>
          </div>

          <p class="text-neutral-400">
            Utilizamos cifrado AES-256, el mismo estándar usado por bancos y gobiernos.
            Tus datos se cifran en tu dispositivo antes de enviarse a la nube.
          </p>


          <ul class="mt-6 space-y-3">
            <li class="flex items-center gap-3 text-neutral-300">
              <UIcon name="i-heroicons-check-circle" class="size-5 text-green-400 shrink-0" />
              Cifrado AES-256 en reposo y en tránsito
            </li>
            <li class="flex items-center gap-3 text-neutral-300">
              <UIcon name="i-heroicons-check-circle" class="size-5 text-green-400 shrink-0" />
              Derivación de claves con Argon2id
            </li>
            <li class="flex items-center gap-3 text-neutral-300">
              <UIcon name="i-heroicons-check-circle" class="size-5 text-green-400 shrink-0" />
              Autenticación de dos factores (2FA) disponible
            </li>
          </ul>
        </div>

        <!-- Stacked cards column -->
        <div class="grid gap-5">
          <div class="landing-card p-6 animate-fade-up animate-delay-300">
            <div class="flex items-center gap-3 mb-3">
              <div class="icon-accent">
                <UIcon name="i-heroicons-eye-slash" class="size-5" />
              </div>
              <div class="text-base sm:text-lg font-semibold">Arquitectura Zero-Knowledge</div>
            </div>
            <p class="text-neutral-400">
              Ni siquiera nosotros podemos ver tus datos. Solo tú tienes acceso a tu información.
            </p>
          </div>

          <div class="landing-card p-6 animate-fade-up animate-delay-400">
            <div class="flex items-center gap-3 mb-3">
              <div class="icon-accent">
                <UIcon name="i-heroicons-server-stack" class="size-5" />
              </div>
              <div class="text-base sm:text-lg font-semibold">Infraestructura Segura</div>
            </div>
            <p class="text-neutral-400">
              Centros de datos certificados con monitoreo 24/7 y auditorías regulares.
            </p>
          </div>

          <div class="landing-card p-6 animate-fade-up animate-delay-500">
            <div class="flex items-center gap-3 mb-3">
              <div class="icon-accent">
                <UIcon name="i-heroicons-code-bracket" class="size-5" />
              </div>
              <div class="text-base sm:text-lg font-semibold">Código Abierto</div>
            </div>
            <p class="text-neutral-400">
              Transparencia total: nuestro código es auditado por la comunidad.
            </p>
          </div>
        </div>
      </div>
    </UContainer>

    <div class="section-divider" />

    <!-- CTA final -->
    <section class="cta-section">
      <UContainer class="py-28 text-center relative z-10">
        <h2 class="text-4xl md:text-5xl font-extrabold animate-fade-up">
          Comienza a proteger tus datos hoy mismo
        </h2>
        <p class="mt-4 text-neutral-400 text-lg animate-fade-up animate-delay-100">
          Únete a más de 100,000 usuarios. Prueba gratis 30 días, sin tarjeta.
        </p>

        <div class="mt-10 flex justify-center gap-4 animate-fade-up animate-delay-200">
          <UButton to="/login" class="btn-accent btn-lg hover:scale-[1.02] transition-transform">
            <UIcon name="i-heroicons-arrow-right-16-solid" class="size-4" />
            Comenzar Gratis
          </UButton>
          <UButton to="/contacto" color="neutral" variant="outline"
            class="btn btn-lg btn-ghost hover:scale-[1.02] transition-transform hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400">
            Hablar con Ventas
          </UButton>
        </div>

        <div
          class="mt-8 flex flex-wrap justify-center gap-6 text-base text-neutral-400 animate-fade-up animate-delay-300">
          <span class="inline-flex items-center gap-2">
            <UIcon name="i-heroicons-check-circle" class="size-4 text-green-400" />
            Sin tarjeta de crédito
          </span>
          <span class="inline-flex items-center gap-2">
            <UIcon name="i-heroicons-check-circle" class="size-4 text-green-400" />
            Cancela cuando quieras
          </span>
          <span class="inline-flex items-center gap-2">
            <UIcon name="i-heroicons-check-circle" class="size-4 text-green-400" />
            Soporte 24/7
          </span>
        </div>
      </UContainer>
    </section>
  </div>
</template>
