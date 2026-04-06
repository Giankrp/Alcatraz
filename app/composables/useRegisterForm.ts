import { navigateTo } from "#app";
import { z } from "zod";
import type { AuthFormField, ButtonProps, FormSubmitEvent } from "@nuxt/ui";

const schema = z
    .object({
        email: z.email("Introduce un email válido"),
        password: z.string().min(8, "Mínimo 8 caracteres"),
        password_confirmation: z.string().min(8, "Mínimo 8 caracteres"),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Las contraseñas no coinciden",
        path: ["password_confirmation"],
    });
type Schema = z.infer<typeof schema>;

export function useRegisterForm() {
    const fields = ref<AuthFormField[]>([
        {
            name: "email",
            type: "email",
            label: "Email",
            placeholder: "tu@correo.com",
            required: true,
            icon: "i-heroicons-envelope",
        },
        {
            name: "password",
            type: "password",
            label: "Contraseña",
            placeholder: "••••••••",
            required: true,
            icon: "i-heroicons-lock-closed",
        },
        {
            name: "password_confirmation",
            type: "password",
            label: "Confirmar contraseña",
            placeholder: "••••••••",
            required: true,
            icon: "i-heroicons-lock-closed",
        },
    ]);

    const { signIn } = useAuth();

    const providers = ref<ButtonProps[]>([
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

    const { clearVault } = useVault();
    const user = useState("user-data");
    const profile = useState("user-profile");

    const submitted = ref(false);
    const error = ref(false);

    const onSubmit = async (event: FormSubmitEvent<Schema>) => {
        // Limpiar datos previos por seguridad
        clearVault();
        user.value = null;
        profile.value = null;

        const { email, password } = event.data;
        const config = useRuntimeConfig();

        submitted.value = false;
        try {
            await $fetch(`${config.public.apiBase}/api/auth/register`, {
                method: "POST",
                body: { email, password },
                credentials: "include",
            });
            console.log("Registering with:", email, password);

            submitted.value = true;
            // Navigate instantly or maybe wait a bit to show the success alert
            navigateTo("/login");
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
        schema,
        fields,
        providers,
        submitted,
        error,
        onSubmit,
        resetFeedback,
    };
}
