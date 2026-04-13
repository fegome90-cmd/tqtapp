# TQTApp

TQTApp es una interfaz frontend orientada a comunicación asistida para pacientes. La app prioriza accesibilidad táctil, frases frecuentes, favoritos y un módulo de texto libre con reproducción simulada.

Hoy el proyecto funciona como prototipo de interfaz: la navegación, las categorías y las frases están implementadas en frontend con datos locales, y la reproducción de audio está mockeada.

## Qué incluye hoy

- Botón principal de emergencia con feedback visual.
- Categorías frecuentes como dolor, respiración, aspiración, posición, familia, necesidades y emociones.
- Frases predefinidas por categoría.
- Sistema local de favoritos.
- Vista de texto libre con sugerencias rápidas.
- Vista de perfil clínico y módulo visual de preparación quirúrgica.
- Diseño mobile-first montado sobre Vite, React 19 y Tailwind CSS 4.

## Estado actual

- Los datos viven en `src/data/mock.ts`.
- La reproducción de frases es simulada en frontend.
- No hay integración activa con backend ni con Gemini en la UI actual.
- El proyecto ya tiene dependencias y variables preparadas para futuras integraciones, pero no forman parte del flujo principal implementado hoy.

## Stack técnico

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Biome
- Lucide React

## Requisitos

- Node.js 20 o superior recomendado.
- npm

## Instalación

```bash
npm install
```

## Desarrollo local

Inicia el servidor de desarrollo:

```bash
npm run dev
```

La configuración actual expone Vite en el puerto `3000` con host abierto, útil para Codespaces y entornos remotos.

## Scripts disponibles

```bash
npm run dev                       # servidor de desarrollo
npm run build                     # build de producción
npm run preview                   # preview local del build
npm run lint                      # biome lint + typecheck de TypeScript
npm run format                    # formateo con Biome
npm run check                     # check/fix amplio con Biome
npm run test:frontend:install     # descarga Chrome para agent-browser
npm run test:frontend:install-deps # instala dependencias Linux para Chrome si hacen falta
npm run test:frontend             # smoke test de UI con agent-browser
npm run test:frontend:headed      # mismo smoke test con navegador visible
```

## Variables de entorno

El repositorio incluye [.env.example](.env.example) como referencia.

Variables disponibles hoy:

- `GEMINI_API_KEY`: preparada en la configuración de Vite para futuras integraciones. La interfaz actual no hace llamadas activas a Gemini.
- `APP_URL`: pensada para despliegues o integraciones futuras.

Si necesitas probar una futura integración local, crea un archivo `.env.local` con los valores necesarios a partir de `.env.example`.

## Estructura del proyecto

```text
src/
   App.tsx          UI principal y navegación por tabs
   main.tsx         bootstrap de React
   index.css        estilos globales y utilidades CSS
   data/mock.ts     categorías y frases mockeadas
   lib/utils.ts     helpers compartidos
   types/index.ts   tipos compartidos
```

## Validación recomendada

Para cambios en UI o TypeScript:

```bash
npm run lint
```

Para cambios de configuración o bundling:

```bash
npm run build
```

Para validar la interfaz con browser automation:

```bash
npm run test:frontend:install
npm run test:frontend
```

Qué hace el smoke test actual:

- levanta `vite` si la app no está corriendo,
- abre la home con `agent-browser`,
- verifica textos clave de la pantalla principal,
- navega a `Escribir` y `Perfil`,
- valida contenido visible en ambas vistas,
- guarda una captura en `test-results/agent-browser/`.

La configuración del navegador vive en [agent-browser.json](agent-browser.json) y el script principal en [scripts/test-frontend-agent-browser.sh](scripts/test-frontend-agent-browser.sh).

## Notas de implementación

- La app está diseñada con foco mobile-first, aunque funciona también en escritorio.
- El alias `@` está configurado en Vite apuntando a la raíz del proyecto.
- El proyecto incluye un agente personalizado para tareas de implementación en [.github/agents/tqtapp.agent.md](.github/agents/tqtapp.agent.md) y reglas globales en [AGENTS.md](AGENTS.md).

## Próximos pasos naturales

- Sustituir la reproducción mock por síntesis o audio real.
- Persistir favoritos y perfil clínico.
- Conectar texto libre y banco de voz con servicios reales.
- Añadir pruebas para componentes y flujos principales.
