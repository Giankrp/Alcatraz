<script setup lang="ts">
  const { t } = useI18n()

  useHead(() => ({
    title: t("legal.licenses.title") + " · Alcatraz",
    meta: [{ name: "description", content: t("legal.licenses.intro") }],
  }))
</script>

<template>
  <div class="relative min-h-screen bg-black text-white pt-24 pb-16">
    <UContainer class="max-w-3xl">
      <div class="mb-12">
        <h1 class="text-4xl font-extrabold mb-4">{{ $t("legal.licenses.title") }}</h1>
        <p class="text-zinc-500 text-sm">{{ $t("legal.licenses.lastUpdated") }}</p>
      </div>

      <div class="prose prose-invert max-w-none space-y-12">
        <section>
          <p class="text-lg text-zinc-300 leading-relaxed">
            {{ $t("legal.licenses.intro") }}
          </p>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold text-white border-b border-zinc-800 pb-2">
            GNU General Public License v3 (GPL-3.0)
          </h2>
          <p class="text-zinc-400 leading-relaxed">
            {{ $t("legal.licenses.gplDescription") }}
          </p>
          <div class="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 mt-6 space-y-4">
            <h3 class="font-semibold text-white">¿Qué permite esta licencia?</h3>
            <ul class="list-disc list-inside text-zinc-400 space-y-2 text-sm">
              <li>
                <strong>Uso Comercial:</strong> El software puede ser usado de manera comercial.
              </li>
              <li>
                <strong>Modificación:</strong> Puedes modificar el código fuente del software.
              </li>
              <li>
                <strong>Distribución:</strong> Puedes distribuir copias del software y tus
                modificaciones.
              </li>
              <li>
                <strong>Patentes:</strong> Incluye una concesión de derechos de patentes de los
                contribuyentes.
              </li>
            </ul>
            <h3 class="font-semibold text-white mt-4">¿Cuáles son las condiciones principales?</h3>
            <ul class="list-disc list-inside text-zinc-400 space-y-2 text-sm">
              <li>
                <strong>Código Abierto (Copyleft):</strong> El código fuente de cualquier
                modificación u obra derivada debe publicarse bajo la misma licencia (GPLv3).
              </li>
              <li>
                <strong>Divulgación de origen:</strong> Debes incluir avisos de derechos de autor y
                de licencia originales, e indicar los cambios realizados.
              </li>
            </ul>
          </div>
        </section>

        <section class="space-y-4">
          <h2 class="text-2xl font-bold text-white border-b border-zinc-800 pb-2">
            Texto Completo de la Licencia
          </h2>
          <p class="text-zinc-400 leading-relaxed">
            Puedes consultar el texto legal completo y sin modificaciones de la licencia GPLv3
            directamente en el repositorio de código fuente del proyecto:
          </p>
          <div class="flex flex-col sm:flex-row gap-4 mt-4">
            <UButton
              to="https://github.com/giankrp/Alcatraz/blob/main/LICENSE"
              target="_blank"
              color="neutral"
              variant="outline"
              size="lg"
              icon="i-heroicons-document-text"
            >
              Ver LICENSE en GitHub
            </UButton>
          </div>
        </section>
      </div>

      <div class="mt-16 p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
        <p class="text-zinc-400 mb-6">{{ $t("legal.contact.desc") }}</p>
        <UButton to="/contacto" color="neutral" variant="solid" size="lg">
          {{ $t("legal.contact.title") }}
        </UButton>
      </div>
    </UContainer>
  </div>
</template>
