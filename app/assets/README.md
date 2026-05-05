# app/assets/

Directorio para recursos estáticos sin compilar que requieren ser procesados por los empaquetadores (Vite/Webpack) de Nuxt. Principalmente gestiona el sistema de diseño visual a través de CSS puro, Tailwind, y convenciones de UI.

## Estructura

```text
assets/
└── css/
    └── main.css    # Definición principal del Design System
```

## Sistema de Diseño (`main.css`)

El archivo `main.css` centraliza todos los estilos globales de la aplicación Alcatraz y funciona en conjunción con Tailwind CSS y `@nuxt/ui`.

### Características y Convenciones

1. **Tokens de Color (Variables CSS):** 
   - Define variables como `--accent`, `--surface-0`, `--surface-1`, `--border-light`, etc.
   - Estos tokens promueven la consistencia de color (especialmente el tema oscuro `dark mode`) y el efecto visual de "Glassmorphism" a través de transparencias.
   
2. **Componentes Globales:**
   - Define clases utilitarias agnósticas a componentes que se repiten en todo el sitio, como `.btn`, `.btn-accent`, `.btn-ghost`, `.landing-card`, y contenedores con glows y decoraciones espaciales (`.hero-glow`).

3. **Animaciones y Micro-interacciones:**
   - Define `@keyframes` globales, notablemente animaciones para revelar la interfaz (`fadeUp`).
   - Existen clases como `.animate-fade-up` junto con múltiples pasos de retardo (`.animate-delay-100`, `.animate-delay-200`, etc.) para crear orquestaciones fluidas en las transiciones de las páginas.

4. **Accesibilidad y Estándares de Navegación:**
   - Aplica modificadores base sobre la pseudo-clase `:focus-visible` a lo largo de toda la UI para mejorar el resaltado al navegar con teclado y evitar dobles bordes estáticos en clicks.

Para modificar el *feeling* general del sitio (ej. cambiar el color de acento esmeralda principal), se recomienda ajustar las variables CSS `--accent` y demás configuraciones relacionadas alojadas dentro de `main.css` antes de modificar los componentes individualmente.
