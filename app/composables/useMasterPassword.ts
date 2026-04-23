export const useMasterPassword = () => {
    /**
     * masterKey - La llave simétrica principal (desbloqueada) que cifra la bóveda.
     * Se guarda en memoria (useState) y nunca se persiste en disco.
     */
    const masterKey = useState<string | null>("master-key", () => null);

    // Email del usuario en memoria para contexto de UI
    const userEmail = useState<string | null>("user-email", () => null);

    // Password temporal para completar el flujo 2FA
    // Se almacena en memoria durante la transición login → 2FA → bóveda
    const twoFactorPendingPassword = useState<string | null>("2fa-pending-password", () => null);

    const setMasterKey = (key: string) => {
        masterKey.value = key;
    };

    const clearMasterKey = () => {
        masterKey.value = null;
    };

    const setUserEmail = (email: string) => {
        userEmail.value = email;
    };

    const clearUserEmail = () => {
        userEmail.value = null;
    };

    const setTwoFactorPendingPassword = (password: string) => {
        twoFactorPendingPassword.value = password;
    };

    const clearTwoFactorPendingPassword = () => {
        twoFactorPendingPassword.value = null;
    };

    return {
        masterKey,
        userEmail,
        twoFactorPendingPassword,
        setMasterKey,
        clearMasterKey,
        setUserEmail,
        clearUserEmail,
        setTwoFactorPendingPassword,
        clearTwoFactorPendingPassword,
        // Aliases para compatibilidad temporal si fuera necesario
        masterPassword: masterKey,
        setMasterPassword: setMasterKey,
        clearMasterPassword: clearMasterKey,
    };
};
