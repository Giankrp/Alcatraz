import { argon2id } from "hash-wasm";

export const useCrypto = () => {
    // Configuración de seguridad estándar militar (Argon2id + AES-256-GCM)
    const ALGORITHM = { name: "AES-GCM", length: 256 };

    // Parámetros de Argon2id que coinciden con Go y Flutter
    const ARGON2_PARAMS = {
        iterations: 3,
        memorySize: 64 * 1024, // 64 MB
        parallelism: 2,
        hashLength: 32, // 256 bits para la llave AES
        outputType: "binary",
    } as const;

    // Utilidades para convertir ArrayBuffer a Base64 y viceversa
    const bufferToBase64 = (buffer: ArrayBuffer): string => {
        return btoa(String.fromCharCode(...new Uint8Array(buffer)));
    };

    const base64ToBuffer = (base64: string): Uint8Array => {
        try {
            let cleanBase64 = base64.replace(/[\n\r\s]/g, "");
            cleanBase64 = cleanBase64.replace(/-/g, "+").replace(/_/g, "/");
            while (cleanBase64.length % 4) {
                cleanBase64 += "=";
            }
            const binaryString = atob(cleanBase64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes;
        } catch (e) {
            console.error("base64ToBuffer failed:", e);
            throw e;
        }
    };

    /**
     * Importa una llave en bruto (Uint8Array) como una llave AES-GCM nativa
     */
    const importRawKey = async (rawKey: Uint8Array): Promise<CryptoKey> => {
        return window.crypto.subtle.importKey(
            "raw",
            rawKey as any,
            ALGORITHM,
            false,
            ["encrypt", "decrypt"],
        );
    };

    /**
     * Deriva una clave KEK (Key Encryption Key) a partir de la contraseña maestra usando Argon2id
     */
    const deriveKEK = async (
        password: string,
        salt: Uint8Array,
    ): Promise<CryptoKey> => {
        const derivedHash = (await argon2id({
            password,
            salt: salt as any,
            ...ARGON2_PARAMS,
        })) as unknown as Uint8Array;

        return importRawKey(derivedHash);
    };

    /**
     * Genera una Master Key aleatoria de 256 bits (32 bytes)
     */
    const generateMasterKey = (): string => {
        const key = window.crypto.getRandomValues(new Uint8Array(32));
        return bufferToBase64(key.buffer);
    };

    /**
     * Cifra la Master Key con una KEK derivada de la contraseña del usuario
     */
    const encryptMasterKey = async (
        masterKeyBase64: string,
        password: string,
    ) => {
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        const kek = await deriveKEK(password, salt);
        const masterKeyBuffer = base64ToBuffer(masterKeyBase64);

        const encryptedMasterKey = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv as any },
            kek,
            masterKeyBuffer as any,
        );

        return {
            protected_master_key: bufferToBase64(encryptedMasterKey),
            master_key_iv: bufferToBase64(iv.buffer),
            master_key_salt: bufferToBase64(salt.buffer),
        };
    };

    /**
     * Descifra la Master Key usando la contraseña del usuario y los metadatos guardados
     */
    const decryptMasterKey = async (
        protectedKey: string,
        password: string,
        salt: string,
        iv: string,
    ): Promise<string> => {
        const saltBuffer = base64ToBuffer(salt);
        const ivBuffer = base64ToBuffer(iv);
        const ciphertext = base64ToBuffer(protectedKey);

        const kek = await deriveKEK(password, saltBuffer);

        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: ivBuffer as any },
            kek,
            ciphertext as any,
        );

        return bufferToBase64(decryptedBuffer);
    };

    /**
     * Cifra datos usando la Master Key
     */
    const encryptData = async (data: any, masterKeyBase64: string) => {
        try {
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const masterKey = await importRawKey(
                base64ToBuffer(masterKeyBase64),
            );

            const enc = new TextEncoder();
            const encodedData = enc.encode(JSON.stringify(data));

            const encryptedContent = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv as any },
                masterKey,
                encodedData as any,
            );

            return {
                salt: "static", // El backend lo requiere, pero usamos MK directamente
                iv: bufferToBase64(iv.buffer),
                encrypted_data: bufferToBase64(encryptedContent),
            };
        } catch (error) {
            console.error("Encryption error:", error);
            throw new Error("Encryption failed");
        }
    };

    /**
     * Descifra el blob recibido usando la Master Key
     */
    const decryptData = async (
        encryptedPackage: { blob: string; iv: string; salt: string },
        masterKeyBase64: string,
    ) => {
        try {
            const iv = base64ToBuffer(encryptedPackage.iv);
            const ciphertext = base64ToBuffer(encryptedPackage.blob);
            const masterKey = await importRawKey(
                base64ToBuffer(masterKeyBase64),
            );

            const decryptedBuffer = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv as any },
                masterKey,
                ciphertext as any,
            );

            const dec = new TextDecoder();
            return JSON.parse(dec.decode(decryptedBuffer));
        } catch (error) {
            console.error("Decryption error:", error);
            throw new Error("Decryption failed");
        }
    };

    /**
     * Genera un hash determinista de la contraseña maestra para autenticación (Login/Registro).
     */
    const hashMasterPassword = async (
        password: string,
        email: string,
    ): Promise<string> => {
        const enc = new TextEncoder();
        const emailSalt = enc.encode(email.toLowerCase().trim());

        const authHash = (await argon2id({
            password,
            salt: emailSalt as any,
            ...ARGON2_PARAMS,
            outputType: "hex",
        })) as unknown as string;

        return authHash;
    };

    return {
        generateMasterKey,
        encryptMasterKey,
        decryptMasterKey,
        encryptData,
        decryptData,
        hashMasterPassword,
    };
};
