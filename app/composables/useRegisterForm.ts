import { ref, computed } from "vue";
import { navigateTo } from "#app";
import { z } from "zod";
import type { AuthFormField, ButtonProps, FormSubmitEvent } from "@nuxt/ui";

export function useRegisterForm() {
    const { t } = useI18n();

    const schema = computed(() =>
        z
            .object({
                email: z.string().email(t("auth.validation.email")),
                password: z.string().min(8, t("auth.validation.passwordMin")),
                password_confirmation: z
                    .string()
                    .min(8, t("auth.validation.passwordMin")),
            })
            .refine((data) => data.password === data.password_confirmation, {
                message: t("auth.validation.passwordMatch"),
                path: ["password_confirmation"],
            }),
    );

    const fields = computed<AuthFormField[]>(() => [
        {
            name: "email",
            type: "email",
            label: t("auth.fields.email"),
            placeholder: "tu@correo.com",
            required: true,
            icon: "i-heroicons-envelope",
        },
        {
            name: "password",
            type: "password",
            label: t("auth.fields.password"),
            placeholder: "••••••••",
            required: true,
            icon: "i-heroicons-lock-closed",
        },
        {
            name: "password_confirmation",
            type: "password",
            label: t("profile.modals.passwordConfirm"),
            placeholder: "••••••••",
            required: true,
            icon: "i-heroicons-lock-closed",
        },
    ]);

    const { signIn } = useAuth();

    const providers = computed<ButtonProps[]>(() => [
        {
            label: "Google",
            icon: "i-logos-google-icon",
            color: "neutral",
            variant: "solid",
            class: "provider-glass text-white",
            onClick: () => {
                signIn("google", {
                    callbackUrl: "/login/unlock?mode=register",
                });
            },
            ui: { base: "hover:cursor-pointer" },
        },
        {
            label: "GitHub",
            icon: "i-logos-github-icon",
            color: "neutral",
            variant: "solid",
            class: "provider-glass text-white",
            onClick: () => {
                signIn("github", {
                    callbackUrl: "/login/unlock?mode=register",
                });
            },
            ui: { base: "hover:cursor-pointer" },
        },
        {
            label: "Apple",
            icon: "i-material-icon-theme:applescript",
            color: "neutral",
            variant: "solid",
            class: "provider-glass text-white",
        },
    ]);

    const { generateMasterKey, encryptMasterKey, hashMasterPassword } =
        useCrypto();
    const { clearVault } = useVault();
    const user = useState("user-data");
    const profile = useState("user-profile");

    const submitted = ref(false);
    const error = ref(false);

    const onSubmit = async (event: FormSubmitEvent<any>): Promise<void> => {
        clearVault();
        user.value = null;
        profile.value = null;

        const { email, password } = event.data;
        const config = useRuntimeConfig();

        submitted.value = false;
        try {
            // 1. Generamos el hash determinista para el Login
            const authHash = await hashMasterPassword(password, email);

            // 2. Generamos una Master Key aleatoria para este usuario
            const masterKey = generateMasterKey();

            // 3. Ciframos la Master Key con el password del usuario
            const protectedKeyData = await encryptMasterKey(
                masterKey,
                password,
            );

            // 4. Enviamos todo al backend
            await $fetch(`${config.public.apiBase}/api/auth/register`, {
                method: "POST",
                body: {
                    email,
                    password: authHash,
                    protected_master_key: protectedKeyData.protected_master_key,
                    master_key_iv: protectedKeyData.master_key_iv,
                    master_key_salt: protectedKeyData.master_key_salt,
                },
                credentials: "include",
            });

            console.log("Registered successfully with Protected Master Key.");

            submitted.value = true;
            await navigateTo("/login");
        } catch (e) {
            console.error("Error registering:", e);
            error.value = true;
            submitted.value = false;
        }
    };

    function resetFeedback() {
        submitted.value = false;
        error.value = false;
    }

    return {
        t,
        schema,
        fields,
        providers,
        submitted,
        error,
        onSubmit,
        resetFeedback,
    };
}
