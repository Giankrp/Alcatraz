# app/composables/

Composables de Vue que encapsulan la lógica de negocio de Alcatraz. Cada composable es una función que retorna estado reactivo y métodos.

## Resumen

| Composable             | Descripción                                                      |
| ---------------------- | ---------------------------------------------------------------- |
| `useAuthForm`          | Formulario de login (campos, validación, OAuth, submit)          |
| `useRegisterForm`      | Formulario de registro (campos, validación, OAuth, submit)       |
| `useCrypto`            | Cifrado/descifrado AES-256-GCM con Argon2id                      |
| `useVault`             | CRUD completo de ítems de la bóveda                              |
| `useMasterPassword`    | Estado en memoria de la contraseña maestra                       |
| `useUser`              | Datos del usuario autenticado (email, avatar, fecha)             |
| `useAutoLock`          | Bloqueo automático de la bóveda por inactividad                  |
| `usePasswordGenerator` | Generador seguro de contraseñas aleatorias usando Web Crypto API |

---

## `useAuthForm()`

Gestiona el formulario de inicio de sesión.

**Retorna:**
| Propiedad | Tipo | Descripción |
|-----------|------|------------|
| `schema` | Zod schema | Validación: email, password (min 8), remember (optional) |
| `fields` | `AuthFormField[]` | Configuración de campos para `UAuthForm` |
| `providers` | `ButtonProps[]` | Botones OAuth: Google, Apple, GitHub |
| `submitted` | `Ref<boolean>` | `true` tras login exitoso |
| `error` | `Ref<boolean>` | `true` si falla el login |
| `onSubmit()` | Function | Envía `POST /api/auth/login` al backend Go, guarda master password en memoria, navega a `/boveda` |
| `resetFeedback()` | Function | Resetea `submitted` y `error` |

**Flujo de `onSubmit`:**

1. Llama a `$fetch(config.public.apiBase + '/api/auth/login')` con `credentials: 'include'`
2. Guarda la contraseña como master password via `useMasterPassword`
3. Navega a `/boveda`

---

## `useRegisterForm()`

Gestiona el formulario de registro. Estructura similar a `useAuthForm` con campo extra `password_confirmation`.

**Validación adicional:** `.refine()` verifica que `password` === `password_confirmation`.

**OAuth callbacks:** Redirigen a `/login/unlock?mode=register` (el modo register usa la master password para crear la bóveda).

**`onSubmit`:** Envía `POST /api/auth/register` al backend Go y navega a `/login`.

---

## `useCrypto()`

Motor criptográfico del lado del cliente. **Este es el corazón de la arquitectura zero-knowledge.**

**Configuración:**

- Algoritmo: `AES-GCM` (256 bits)
- KDF: `Argon2id` (3 iteraciones, 64 MB memoria, paralelismo 2, hash 32 bytes)

**Métodos disponibles:**

### `encryptData(data: any, masterKeyBase64: string)`

1. Genera IV aleatorio (12 bytes)
2. Cifra `JSON.stringify(data)` con AES-GCM usando la Master Key

**Retorna:** `{ salt: string, iv: string, encrypted_data: string }` (todo en Base64)

### `decryptData(encryptedPackage, masterKeyBase64: string)`

1. Decodifica IV y ciphertext de Base64
2. Descifra con AES-GCM usando la Master Key

**Retorna:** Objeto JSON original.

**Utilidades internas:** `bufferToBase64()`, `base64ToBuffer()` (con soporte URL-safe Base64).

---

## `useVault()`

CRUD completo de ítems de la bóveda. Integra `useCrypto` y `useMasterPassword`.

**Estado:**
| Propiedad | Tipo | Descripción |
|-----------|------|------------|
| `items` | `Ref<VaultItem[]>` | Lista de ítems (metadatos + datos cifrados) |
| `loading` | `Ref<boolean>` | Estado de carga |

**Métodos:**
| Método | Descripción |
|--------|------------|
| `fetchItems()` | Obtiene ítems del backend, descifra títulos |
| `getDecryptedItem(id)` | Descarga y descifra completamente un ítem |
| `addItem(item)` | Cifra datos sensibles y los envía al backend |
| `updateItem(id, fields)` | Re-cifra los datos actualizados |
| `removeItem(id)` | Mueve a papelera (soft delete) |
| `restoreItem(id)` | Restaura de papelera |
| `deleteItemPermanent(id)` | Eliminación definitiva |

**Separación de datos:** `extractSensitiveData()` separa campos sensibles (password, note, card data) de metadatos (title, type, icon) antes de cifrar.

---

## `useMasterPassword()`

Almacena la contraseña maestra **exclusivamente en memoria** usando `useState`.

```ts
const masterPassword = useState<string | null>("master-password", () => null)
```

**Métodos:**

- `setMasterPassword(password)` — se llama tras login exitoso
- `clearMasterPassword()` — se llama al cerrar sesión

> ⚠️ **Seguridad:** La master password **nunca** se persiste en disco, cookies ni `localStorage`.

---

## `useUser()`

Obtiene y cachea datos del usuario autenticado.

**Fuente:** `GET /api/auth/me` (decodifica JWT del lado del servidor).

**Propiedades computadas:**
| Propiedad | Descripción |
|-----------|------------|
| `email` | Email del usuario |
| `initials` | Primeras 2 letras del email (para avatar) |
| `avatarColor` | Color HSL generado desde hash del email |
| `createdAt` | Fecha de creación de la cuenta |
| `loading` | Estado de carga |

**Método:** `fetchUser()` — solo hace fetch una vez (cacheado en `useState`).

---

## `useAutoLock()`

Gestiona el temporizador de inactividad de la bóveda.

**Propósito:** Si el usuario no interactúa con la aplicación durante un tiempo (por defecto 5 minutos), se elimina la contraseña maestra de la memoria y se redirige a `/login/unlock` para asegurar que nadie más pueda acceder.

**Eventos de inactividad:** Escucha `mousemove`, `keydown`, `wheel`, `touchstart`, `pointerdown` y cambios de visibilidad de la pestaña (`visibilitychange`).

---

## `usePasswordGenerator()`

Utilidad para generar contraseñas seguras y fuertes aleatoriamente desde el lado del cliente utilizando `window.crypto.getRandomValues()` en lugar del débil `Math.random()`.

**Propiedades:**

- `password` (Ref)
- `length` (Ref)
- `includeUppercase`, `includeNumbers`, `includeSymbols` (Refs booleanos)

**Métodos:**

- `generatePassword()`: Genera una nueva contraseña y actualiza el estado.
- `copyToClipboard()`: Copia la contraseña generada al portapapeles.
