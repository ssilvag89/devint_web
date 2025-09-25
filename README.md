# Devint.cl

Sitio corporativo estático construido con [Astro](https://astro.build) para mostrar la oferta de servicios de Devint, contenidos y canales de contacto. El proyecto usa Tailwind CSS y el sistema de collections de Astro para mantener el contenido en archivos Markdown.

## 🧱 Estructura principal

```
src/
├── components/       # Header, footer y secciones reutilizables
├── content/          # Collections (services, blog, etc.)
├── layouts/          # Layouts base que inyectan SEO y estilos globales
├── pages/            # Rutas del sitio (estáticas y dinámicas)
└── utils/            # Utilidades de formato, SEO y validaciones
```

El contenido dinámico para servicios y blog se gestiona desde `src/content`. Cada archivo Markdown se valida contra esquemas Zod y se expone en las páginas a través de `getCollection`.

## 🚀 Scripts disponibles

| Comando        | Descripción                              |
| -------------- | ---------------------------------------- |
| `npm install`  | Instala las dependencias                 |
| `npm run dev`  | Inicia el entorno local en `localhost:4321` |
| `npm run build`| Genera la salida estática en `./dist`    |
| `npm run preview` | Sirve la build generada para validación |
| `npm run check`| Ejecuta `astro check` (tipos y accesibilidad básica) |

## 🛠️ Buenas prácticas

- **Contenido**: crea nuevos servicios o artículos en `src/content/<collection>`. Los campos se autovalidan al ejecutar `npm run build` o `npm run check`.
- **SEO**: usa el `BaseLayout` y pasa las props `seo` para personalizar título, descripción, canonical y metadatos sociales.
- **Estilos**: Tailwind está configurado en `tailwind.config.mjs`. Usa `@apply` sólo para componentes reutilizables en `src/styles/tailwind.css`.

## 📦 Despliegue

El proyecto está preparado para Vercel (`@astrojs/vercel`) con salida estática. Asegúrate de definir `VERCEL_URL` o `site` para generar canónicas correctas y de limpiar el caché cuando actualices contenido.

## ✅ Próximos pasos sugeridos

- Conectar el formulario de contacto con el servicio de envío definitivo (API o plataforma transactional).
- Añadir pruebas de interfaz o auditorías automáticas (Lighthouse/Playwright) previas al despliegue.
- Documentar tu pipeline de CI/CD si el proyecto usa revisiones automáticas antes de publicar.
