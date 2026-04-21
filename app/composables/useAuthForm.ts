import { ref, computed } from "vue";
import { navigateTo } from "#app";
import { z } from "zod";
import type { AuthFormField, ButtonProps, FormSubmitEvent } from "@nuxt/ui";

export function useAuthForm() {
    const { t } = useI18n();

    const schema = computed(() =>
        z.object({
            email: z.email(t("auth.validation.email")),
            password: z.string().min(8, t("auth.validation.passwordMin")),
            remember: z.boolean().optional(),
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
            name: "remember",
            type: "checkbox",
            label: t("auth.fields.remember"),
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
                signIn("google", { callbackUrl: "/login/unlock" });
            },
            ui: {
                base: "hover:cursor-pointer",
            },
        },
        {
            label: "Apple",
            icon: "i-material-icon-theme:applescript",
            color: "neutral",
            variant: "solid",
            class: "provider-glass text-white",
        },
        {
            label: "GitHub",
            icon: "i-logos-github-icon",
            color: "neutral",
            variant: "solid",
            class: "provider-glass text-white",
            onClick: () => {
                signIn("github", { callbackUrl: "/login/unlock" });
            },
            ui: {
                base: "hover:cursor-pointer",
            },
        },
    ]);

    const { setMasterKey, setUserEmail } = useMasterPassword();
    const { hashMasterPassword, decryptMasterKey } = useCrypto();
    const { clearVault } = useVault();
    const user = useState("user-data");
    const profile = useState("user-profile");
    const { twoFactorTempToken, twoFactorEmail } = useUser();

    const submitted = ref(false);
    const error = ref(false);

    const onSubmit = async (event: FormSubmitEvent<any>): Promise<void> => {
        submitted.value = false;
        try {
            clearVault();
            user.value = null;
            profile.value = null;

            const { email, password } = event.data;
            const config = useRuntimeConfig();

            // 1. Hash determinista para Login
            const authHash = await hashMasterPassword(password, email);

            const response = await $fetch<any>(
                `${config.public.apiBase}/api/auth/login`,
                {
                    method: "POST",
                    body: { email, password: authHash },
                    credentials: "include",
                },
            );

            setUserEmail(email);

            if (response.require_2fa) {
                twoFactorTempToken.value = response.temp_token;
                twoFactorEmail.value = email;
                // En 2FA el masterKey se descifrará después del segundo paso o se guarda temporalmente
                // Por ahora lo guardamos en un estado temporal si fuera necesario,
                // pero lo más seguro es pedir el password de nuevo o mantenerlo en memoria volátil.
                // Para simplificar esta transición, asumimos que el usuario no tiene 2FA o que el 2FA
                // redirigirá a una pantalla que tiene acceso al password.
                submitted.value = true;
                await navigateTo("/login/2fa");
            } else {
                // 2. Desciframos la Master Key usando el password y la data del server
                const masterKey = await decryptMasterKey(
                    response.protected_master_key,
                    password,
                    response.master_key_salt,
                    response.master_key_iv,
                );

                // 3. Guardamos la Master Key REAL en memoria
                setMasterKey(masterKey);

                submitted.value = true;
                await navigateTo("/boveda");
            }
        } catch (e) {
            console.error("Login failed:", e);
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
