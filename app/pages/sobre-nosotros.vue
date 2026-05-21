<script setup lang="ts">
const { t } = useI18n();

useHead(() => ({
    title: t("legal.about.title") + " · Alcatraz",
    meta: [{ name: "description", content: t("legal.about.project.description") }],
}));
</script>

<template>
    <div class="relative min-h-screen bg-black text-white pt-24 pb-16">
        <UContainer class="max-w-3xl">
            <div class="mb-12">
                <h1 class="text-4xl font-extrabold mb-4">
                    {{ $t("legal.about.title") }}
                </h1>
                <p class="text-zinc-500 text-sm">
                    {{ $t("legal.about.author.name") }} · {{ $t("legal.about.author.title") }}
                </p>
            </div>

            <div class="prose prose-invert max-w-none space-y-12">
                <section class="space-y-4">
                    <h2 class="text-2xl font-bold text-white border-b border-zinc-800 pb-2">
                        {{ $t("legal.about.project.title") }}
                    </h2>
                    <p class="text-lg text-zinc-300 leading-relaxed">
                        {{ $t("legal.about.project.description") }}
                    </p>
                    <p class="text-zinc-400 leading-relaxed">
                        {{ $t("legal.about.project.technologies") }}
                    </p>
                    <p class="text-zinc-400 leading-relaxed">
                        {{ $t("legal.about.project.objective") }}
                    </p>
                    <p class="text-zinc-400 leading-relaxed italic border-l-2 border-zinc-700 pl-4 py-2">
                        {{ $t("legal.about.project.vision") }}
                    </p>
                </section>

                <section class="space-y-4">
                    <h2 class="text-2xl font-bold text-white border-b border-zinc-800 pb-2">
                        {{ $t("legal.about.importance.title") }}
                    </h2>
                    <p class="text-zinc-400 leading-relaxed">
                        {{ $t("legal.about.importance.context") }}
                    </p>
                    <p class="text-zinc-400 leading-relaxed">
                        {{ $t("legal.about.importance.risks") }}
                    </p>
                    <div class="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 my-6">
                        <p class="text-zinc-300 leading-relaxed font-medium">
                            {{ $t("legal.about.importance.solution") }}
                        </p>
                    </div>
                    <p class="text-zinc-400 leading-relaxed">
                        {{ $t("legal.about.importance.educational") }}
                    </p>
                    <p class="text-zinc-400 leading-relaxed">
                        {{ $t("legal.about.importance.conclusion") }}
                    </p>
                </section>

                <section class="space-y-4">
                    <h2 class="text-2xl font-bold text-white border-b border-zinc-800 pb-2">
                        {{ $t("legal.about.author.title") }}
                    </h2>
                    <div class="flex flex-col md:flex-row gap-8 items-center md:items-start p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                        <div class="size-24 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-700">
                           <UIcon name="i-heroicons-user" class="size-12 text-zinc-500" />
                        </div>
                        <div class="space-y-2 text-center md:text-left">
                            <h3 class="text-xl font-bold text-white">
                                {{ $t("legal.about.author.name") }}
                            </h3>
                            <p class="text-zinc-400 leading-relaxed">
                                {{ $t("legal.about.author.bio") }}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <div class="mt-16 p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-center">
                <p class="text-zinc-400 mb-6">{{ $t("legal.contact.desc") }}</p>
                <div class="flex flex-wrap justify-center gap-4">
                    <UButton to="/contacto" color="neutral" variant="solid" size="lg">
                        {{ $t("legal.contact.title") }}
                    </UButton>
                    <UButton to="/" color="neutral" variant="outline" size="lg">
                        {{ $t("nav.getStarted") }}
                    </UButton>
                </div>
            </div>
        </UContainer>
    </div>
</template>
