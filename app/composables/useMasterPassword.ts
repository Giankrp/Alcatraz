export const useMasterPassword = () => {
    /**
     * masterKey - La llave simétrica principal (desbloqueada) que cifra la bóveda.
     * Se guarda en memoria (useState) y nunca se persiste en disco.
     */
    const masterKey = useState<string | null>("master-key", () => null);

    // Email del usuario en memoria para contexto de UI
    const userEmail = useState<string | null>("user-email", () => null);

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

    return {
        masterKey,
        userEmail,
        setMasterKey,
        clearMasterKey,
        setUserEmail,
        clearUserEmail,
        // Aliases para compatibilidad temporal si fuera necesario
        masterPassword: masterKey,
        setMasterPassword: setMasterKey,
        clearMasterPassword: clearMasterKey,
    };
};
