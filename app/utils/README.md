# app/utils/

Directorio para funciones de utilidad, helpers puros y lógica auxiliar que no necesita acceso al contexto de Vue o Nuxt (como ocurre con los `composables/`). Las utilidades aquí son auto-importadas por Nuxt.

## Funciones Disponibles

### `securityScore.ts`

Proporciona utilidades para evaluar la seguridad y robustez de información criptográfica o contraseñas.

**`calculatePasswordScore(password: string): number`**

Toma una cadena de texto (contraseña) y devuelve una puntuación numérica (de 0 a 100) que representa su fortaleza de acuerdo a heurísticas locales.

- **Penalizaciones:** Si la contraseña tiene menos de 8 caracteres, su puntuación final se reduce a la mitad.
- **Bonificaciones:** Se otorgan puntos adicionales por mezclar letras minúsculas (+10), mayúsculas (+15), números (+15) y símbolos (+20).
- **Escala de base:** Suma 4 puntos por cada carácter (hasta un máximo de 40 puntos base).

**Uso general:** Se utiliza típicamente en los medidores de fuerza visuales (barras de progreso) al registrar una nueva cuenta o crear una contraseña para la bóveda.
