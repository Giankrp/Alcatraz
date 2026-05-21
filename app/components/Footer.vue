<script setup lang="ts">
// ... existing code ...
</script>

<template>
    <footer class="border-t border-white/10 bg-(--surface-1) text-white">
        <UContainer
            class="py-8 md:py-14 grid gap-8 md:gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
        >
            <!-- Brand -->
            <div class="sm:col-span-2 md:col-span-1">
                <div class="flex items-center gap-3">
                    <div
                        class="size-8 rounded-full bg-green-500/10 grid place-items-center text-green-400"
                    >
                        <UIcon name="i-heroicons-lock-closed" class="size-4" />
                    </div>
                    <span class="font-semibold">Alcatraz</span>
                </div>
                <p class="mt-4 text-sm opacity-70">
                    {{ $t("landing.hero.desc").split(".")[0] }}.
                </p>
            </div>

            <div>
                <div class="font-semibold">{{ $t("footer.product") }}</div>
                <ul class="mt-3 space-y-2 text-sm opacity-90">
                    <li>
                        <ULink to="/#caracteristicas">{{
                            $t("nav.features")
                        }}</ULink>
                    </li>
                    <li>
                        <ULink to="/#seguridad">{{ $t("nav.security") }}</ULink>
                    </li>
                    <li>
                        <ULink to="/pricing">{{ $t("nav.pricing") }}</ULink>
                    </li>
                    <li>
                        <ULink to="/descargas">{{
                            $t("footer.downloads")
                        }}</ULink>
                    </li>
                </ul>
            </div>

            <!-- Empresa -->
            <div>
                <div class="font-semibold">{{ $t("footer.company") }}</div>
                <ul class="mt-3 space-y-2 text-sm opacity-90">
                    <li>
                        <ULink to="/sobre-nosotros">{{
                            $t("footer.about")
                        }}</ULink>
                    </li>
                    <li>
                        <ULink to="/blog">{{ $t("footer.blog") }}</ULink>
                    </li>
                    <li>
                        <ULink to="/careras">{{ $t("footer.careers") }}</ULink>
                    </li>
                    <li>
                        <ULink to="/contacto">{{ $t("footer.contact") }}</ULink>
                    </li>
                </ul>
            </div>

            <!-- Legal -->
            <div>
                <div class="font-semibold">{{ $t("footer.legal") }}</div>
                <ul class="mt-3 space-y-2 text-sm opacity-90">
                    <li>
                        <ULink to="/privacidad">{{
                            $t("footer.privacy")
                        }}</ULink>
                    </li>
                    <li>
                        <ULink to="/terminos">{{ $t("footer.terms") }}</ULink>
                    </li>
                    <li>
                        <ULink to="/cookies">{{ $t("footer.cookies") }}</ULink>
                    </li>
                    <li>
                        <ULink to="/licencias">{{
                            $t("footer.licenses")
                        }}</ULink>
                    </li>
                </ul>
            </div>
        </UContainer>

        <div class="border-t border-white/10">
            <UContainer class="py-6 text-center text-sm opacity-70">
                {{ $t("footer.rights", { year: new Date().getFullYear() }) }}
            </UContainer>
        </div>
    </footer>
</template>
