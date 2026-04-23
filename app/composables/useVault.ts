import type {
    VaultItem,
    VaultFolder,
    VaultItemResponse,
    VaultFolderDTO,
    CreateVaultItemDTO,
    UpdateVaultItemDTO,
    CreateVaultFolderDTO,
    UpdateVaultFolderDTO,
} from "~/types/vault";
import { calculatePasswordScore } from "~/utils/securityScore";

export const useVault = () => {
    const config = useRuntimeConfig();
    const { encryptData, decryptData } = useCrypto();
    const { masterKey } = useMasterPassword();

    const searchQuery = useState<string>("vault-search", () => "");
    const items = useState<VaultItem[]>("vault-items", () => []);
    const folders = useState<VaultFolder[]>("vault-folders", () => []);

    /**
     * Helper to extract only the sensitive fields for encryption.
     */
    const extractSensitiveData = (
        item: Partial<VaultItem>,
    ): Record<string, unknown> => {
        const {
            id: _id,
            title: _title,
            folder: _folder,
            trashed: _trashed,
            icon: _icon,
            item_type: _item_type,
            encrypted_data: _encrypted_data,
            iv: _iv,
            salt: _salt,
            ...sensitive
        } = item;
        return sensitive as Record<string, unknown>;
    };

    /**
     * Helper for UUID validation
     */
    const isUUID = (str: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            str,
        );

    const fetchFolders = async (): Promise<void> => {
        try {
            const data = await $fetch<VaultFolderDTO[]>(
                `${config.public.apiBase}/api/vault/folders`,
                {
                    credentials: "include",
                },
            );
            folders.value = data.map((dto) => ({
                id: dto.id,
                name: dto.name,
                is_default: dto.is_default,
                created_at: dto.created_at,
            }));
        } catch (error) {
            console.error("Error fetching folders:", error);
        }
    };

    const fetchItems = async (): Promise<void> => {
        if (!masterKey.value) {
            console.warn("Master key not set. Cannot fetch items.");
            return;
        }

        try {
            const [regularItems, trashedItems] = await Promise.all([
                $fetch<VaultItemResponse[]>(
                    `${config.public.apiBase}/api/vault/items`,
                    {
                        credentials: "include",
                    },
                ),
                $fetch<VaultItemResponse[]>(
                    `${config.public.apiBase}/api/vault/trash`,
                    {
                        credentials: "include",
                    },
                ),
            ]);

            const dtos = [...regularItems, ...trashedItems];

            if (!folders.value.length) {
                await fetchFolders();
            }

            const defaultFolderId =
                folders.value.find((f) => f.is_default)?.id || "personal";

            items.value = dtos.map(
                (dto) =>
                    ({
                        id: dto.id,
                        item_type: dto.item_type,
                        title: dto.title,
                        icon: dto.icon,
                        folder: dto.folder_id || defaultFolderId,
                        trashed: dto.trashed,
                        created_at: dto.created_at,
                        updated_at: dto.updated_at,
                        security_score: dto.security_score,
                        encrypted_data: dto.secret?.encrypted_data,
                        iv: dto.secret?.iv,
                        salt: dto.secret?.salt,
                    }) as VaultItem,
            );
        } catch (error) {
            console.error("Error fetching vault items:", error);
        }
    };

    const addFolder = async (name: string): Promise<VaultFolder> => {
        try {
            const body: CreateVaultFolderDTO = { name };
            const dto = await $fetch<VaultFolderDTO>(
                `${config.public.apiBase}/api/vault/folders`,
                {
                    method: "POST",
                    body,
                    credentials: "include",
                },
            );
            const newFolder: VaultFolder = {
                id: dto.id,
                name: dto.name,
                is_default: dto.is_default,
                created_at: dto.created_at,
            };
            folders.value.push(newFolder);
            return newFolder;
        } catch (error) {
            console.error("Error adding folder:", error);
            throw error;
        }
    };

    const updateFolder = async (
        id: string,
        name: string,
    ): Promise<VaultFolder> => {
        try {
            const body: UpdateVaultFolderDTO = { name };
            const dto = await $fetch<VaultFolderDTO>(
                `${config.public.apiBase}/api/vault/folders/${id}`,
                {
                    method: "PUT",
                    body,
                    credentials: "include",
                },
            );
            const updatedFolder: VaultFolder = {
                id: dto.id,
                name: dto.name,
                is_default: dto.is_default,
                created_at: dto.created_at,
            };
            const index = folders.value.findIndex((f) => f.id === id);
            if (index !== -1) {
                folders.value[index] = updatedFolder;
            }
            return updatedFolder;
        } catch (error) {
            console.error("Error updating folder:", error);
            throw error;
        }
    };

    const deleteFolder = async (id: string): Promise<void> => {
        const folder = folders.value.find((f) => f.id === id);
        if (folder?.is_default) {
            throw new Error("Cannot delete default folder");
        }

        try {
            await $fetch(`${config.public.apiBase}/api/vault/folders/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            folders.value = folders.value.filter((f) => f.id !== id);
            await fetchItems();
        } catch (error) {
            console.error("Error deleting folder:", error);
            throw error;
        }
    };

    const getDecryptedItem = async (
        id: string,
    ): Promise<VaultItem | undefined> => {
        const item = items.value.find((i) => i.id === id);
        if (!item) return undefined;

        const isDecrypted =
            (item.item_type === "password" &&
                (item as any).username !== undefined) ||
            (item.item_type === "note" && (item as any).note !== undefined) ||
            (item.item_type === "card" && (item as any).number !== undefined) ||
            (item.item_type === "identity" &&
                (item as any).firstName !== undefined);

        if (isDecrypted) return item;

        if (!item.encrypted_data) {
            try {
                const detail = await $fetch<VaultItemResponse>(
                    `${config.public.apiBase}/api/vault/items/${id}`,
                    {
                        credentials: "include",
                    },
                );

                const secret = detail.secret;
                if (!secret) throw new Error("Item has no secret data");

                item.encrypted_data = secret.encrypted_data;
                item.iv = secret.iv;
                item.salt = secret.salt;
            } catch (e) {
                console.error("Error fetching item details", e);
                throw e;
            }
        }

        if (!masterKey.value) throw new Error("Vault locked");

        try {
            const sensitiveData = await decryptData(
                {
                    blob: item.encrypted_data!,
                    iv: item.iv!,
                    salt: item.salt!,
                },
                masterKey.value,
            );

            Object.assign(item, sensitiveData);

            delete item.encrypted_data;
            delete item.iv;
            delete item.salt;

            return item;
        } catch (error) {
            console.error(`Failed to decrypt item ${id}:`, error);
            throw error;
        }
    };

    const addItem = async (
        item: Omit<VaultItem, "id" | "icon" | "trashed">,
    ): Promise<VaultItem> => {
        if (!masterKey.value) throw new Error("Vault locked");

        try {
            let icon = "i-heroicons-question-mark-circle";
            if (item.item_type === "password") icon = "i-heroicons-key";
            else if (item.item_type === "note")
                icon = "i-heroicons-document-text";
            else if (item.item_type === "card")
                icon = "i-heroicons-credit-card";
            else if (item.item_type === "identity")
                icon = "i-heroicons-user-circle";

            const sensitiveData = extractSensitiveData(item as VaultItem);
            const cryptoResult = await encryptData(
                sensitiveData,
                masterKey.value,
            );

            if (!folders.value.length) {
                await fetchFolders();
            }

            let score = null;
            if (item.item_type === "password" && sensitiveData.password) {
                score = calculatePasswordScore(sensitiveData.password as string);
            }

            const payload: CreateVaultItemDTO = {
                title: item.title,
                type: item.item_type,
                folder_id:
                    item.folder && isUUID(item.folder) ? item.folder : null,
                icon,
                security_score: score,
                secret: {
                    data: cryptoResult.encrypted_data,
                    iv: cryptoResult.iv,
                    salt: cryptoResult.salt,
                },
            };

            const response = await $fetch<VaultItemResponse>(
                `${config.public.apiBase}/api/vault/items`,
                {
                    method: "POST",
                    credentials: "include",
                    body: payload,
                },
            );

            const newItem: VaultItem = {
                ...item,
                id: response.id,
                icon,
                trashed: false,
            } as VaultItem;

            items.value.unshift(newItem);
            return newItem;
        } catch (error) {
            console.error("Error adding item:", error);
            throw error;
        }
    };

    const updateItem = async (
        id: string,
        updatedFields: Partial<VaultItem>,
    ): Promise<void> => {
        if (!masterKey.value) throw new Error("Vault locked");

        try {
            const index = items.value.findIndex((i) => i.id === id);
            if (index === -1) return;

            let currentItem = items.value[index];
            if (!currentItem) return;

            const sensitiveKeys = [
                "username",
                "password",
                "url",
                "note",
                "number",
                "cvv",
                "firstName",
                "lastName",
                "email",
                "phone",
                "address",
                "licenseNumber",
                "passportNumber",
            ];
            const hasSensitiveChanges = Object.keys(updatedFields).some((k) =>
                sensitiveKeys.includes(k),
            );
            const needReEncryption = hasSensitiveChanges || updatedFields.title;

            if (needReEncryption) {
                await getDecryptedItem(id);
                currentItem = items.value[index]!;
            }

            const mergedItem = {
                ...currentItem,
                ...updatedFields,
            } as VaultItem;

            const sensitiveExtracted = extractSensitiveData(mergedItem);

            const cryptoResult = await encryptData(
                sensitiveExtracted,
                masterKey.value,
            );

            let score = mergedItem.security_score || null;
            if (mergedItem.item_type === "password" && sensitiveExtracted.password) {
                score = calculatePasswordScore(sensitiveExtracted.password as string);
            }

            const payload: UpdateVaultItemDTO = {
                title: mergedItem.title,
                type: mergedItem.item_type,
                folder_id:
                    mergedItem.folder && isUUID(mergedItem.folder)
                        ? mergedItem.folder
                        : null,
                icon: mergedItem.icon,
                trashed: mergedItem.trashed,
                security_score: score,
                secret: {
                    data: cryptoResult.encrypted_data,
                    iv: cryptoResult.iv,
                    salt: cryptoResult.salt,
                },
            };

            await $fetch(`${config.public.apiBase}/api/vault/items/${id}`, {
                method: "PUT",
                credentials: "include",
                body: payload,
            });

            Object.assign(items.value[index]!, updatedFields);
        } catch (error) {
            console.error("Error updating item:", error);
            throw error;
        }
    };

    const removeItem = async (id: string) => {
        await $fetch(`${config.public.apiBase}/api/vault/items/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        const index = items.value.findIndex((i) => i.id === id);
        if (index !== -1) {
            items.value[index]!.trashed = true;
        }
    };

    const restoreItem = async (id: string) => {
        await $fetch(`${config.public.apiBase}/api/vault/items/${id}/restore`, {
            method: "POST",
            credentials: "include",
        });
        const index = items.value.findIndex((i) => i.id === id);
        if (index !== -1) {
            items.value[index]!.trashed = false;
        }
    };

    const deleteItemPermanent = async (id: string) => {
        await $fetch(
            `${config.public.apiBase}/api/vault/items/${id}/permanent`,
            {
                method: "DELETE",
                credentials: "include",
            },
        );
        items.value = items.value.filter((i) => i.id !== id);
    };

    const clearVault = () => {
        items.value = [];
        folders.value = [];
        searchQuery.value = "";
    };

    return {
        items,
        searchQuery,
        fetchItems,
        addItem,
        updateItem,
        removeItem,
        restoreItem,
        deleteItemPermanent,
        getDecryptedItem,
        folders,
        fetchFolders,
        addFolder,
        updateFolder,
        deleteFolder,
        clearVault,
    };
};
