# Informe de Analytics y Rastreo — Devint Web

> Generado como referencia técnica del estado de medición del sitio `devint.cl`.

---

## ✅ Estado actual (post-configuración)

| Canal | Estado | Detalle |
|-------|--------|---------|
| Google Analytics 4 | ✅ Activo | ID: `G-YLEKSPRT2V` |
| Google Tag Manager | ⏳ Listo para activar | Requiere añadir `PUBLIC_GTM_ID` en `.env` |
| Google Search Console | ✅ Verificado | Archivo `/public/googlea9b879b187c4789c.html` |
| UTM en share buttons | ✅ Configurado | WhatsApp + LinkedIn |
| UTM en artículos relacionados | ✅ Configurado | `utm_source=internal` |
| Sitemap | ✅ Activo | `/sitemap-index.xml` (vía Astro) |

---

## 1. Google Analytics 4 (GA4)

### Configuración
- **Measurement ID**: `G-YLEKSPRT2V`
- **Archivo**: `src/components/analytics/GoogleAnalytics.astro`
- **Carga**: Incluido en `src/layouts/BaseLayout.astro` → se carga en **todas las páginas**

### Configuración gtag
```js
gtag("config", "G-YLEKSPRT2V", {
  send_page_view: true,
  anonymize_ip: true,       // Cumplimiento GDPR
  allow_google_signals: true,
  allow_ad_personalization_signals: false,
});
```

### Eventos configurados

| Evento | Categoría | Trigger | Páginas |
|--------|-----------|---------|---------|
| `cta_click` | engagement | Click en `a[href="/contacto"]`, botones CTA | Todas |
| `navigation_click` | navigation | Click en `nav a`, `header a` | Todas |
| `click` (outbound) | outbound | Click en links externos | Todas |
| `scroll` | engagement | Al llegar a 25%, 50%, 75%, 100% del scroll | Todas |
| `form_submit` | engagement | Submit de cualquier formulario | Contacto |
| `file_download` | engagement | Click en `.pdf`, `.zip`, `.doc` | Todas |
| `timing_complete` | engagement | Al salir de la página (tiempo total) | Todas |
| `page_visibility` | engagement | Al cambiar de pestaña | Todas |
| `service_view` | engagement | Click en tarjetas de servicios | Servicios |
| `exception` | — | Errores JS no capturados | Todas |
| `utm_captured` | acquisition | Al detectar UTMs en URL | Todas |
| `article_view` | blog_engagement | Al cargar artículo del blog | Blog |
| `article_read_complete` | blog_engagement | Al leer el 95% del artículo | Blog |
| `related_article_click` | blog_engagement | Click en artículo relacionado | Blog |
| `share` (whatsapp) | — | Click en botón WhatsApp | Blog |
| `share` (linkedin) | — | Click en botón LinkedIn | Blog |
| `toc_click` | blog_engagement | Click en tabla de contenidos | Blog |

---

## 2. Google Tag Manager (GTM)

### Estado: Listo para activar

GTM está implementado pero desactivado hasta que se proporcione un Container ID.

### Cómo activarlo

**Paso 1**: Crear una cuenta en [tagmanager.google.com](https://tagmanager.google.com)

**Paso 2**: Crear un contenedor web nuevo para `devint.cl`

**Paso 3**: Copiar el Container ID (formato: `GTM-XXXXXXX`)

**Paso 4**: Agregar al archivo `.env` en la raíz del proyecto:
```env
PUBLIC_GTM_ID=GTM-XXXXXXX
```

**Paso 5**: Hacer deploy. GTM cargará automáticamente en `<head>` y con `<noscript>` en `<body>`.

### ¿Por qué usar GTM además de GA4 directo?

Con GTM puedes:
- Agregar/modificar tags **sin tocar código** (solo desde la UI de GTM)
- Instalar píxeles de Meta Ads, LinkedIn Ads, etc.
- Crear triggers personalizados (clicks en botones específicos, formularios, etc.)
- Tener versionado de cambios en tags
- Compartir acceso con el equipo de marketing sin exposición del código

### Configuración recomendada en GTM

Una vez activado, configurar en GTM:
1. **Tag GA4**: Configuration Tag apuntando a `G-YLEKSPRT2V`
2. **Trigger All Pages**: Para disparar GA4 en toda navegación
3. **Tag LinkedIn Insight** (si se hace campañas en LinkedIn)
4. **Tag Meta Pixel** (si se hace campañas en Facebook/Instagram)

---

## 3. Google Search Console

### Estado: ✅ Verificado

- **Método de verificación**: Archivo HTML en `/public/googlea9b879b187c4789c.html`
- **URL de verificación**: `https://devint.cl/googlea9b879b187c4789c.html`

### Acciones pendientes en Search Console

1. **Enviar Sitemap** (si no está enviado):
   - Ir a Search Console → Sitemaps
   - Agregar URL: `https://devint.cl/sitemap-index.xml`

2. **Verificar cobertura de URLs**:
   - Confirmar que todos los artículos del blog aparecen indexados
   - Revisar la sección "Cobertura" en busca de errores 404

3. **Vincular GA4 con Search Console**:
   - En GA4: Administrar → Vínculos de Search Console
   - Conectar la propiedad de Search Console para ver datos de búsqueda orgánica en GA4

### Artículos del blog a verificar en Search Console

| Artículo | URL | Estado esperado |
|----------|-----|----------------|
| ¿Cuánto cuesta desarrollar software en Chile? | `/blog/cuanto-cuesta-desarrollar-software-chile` | Indexado |
| Cómo elegir empresa de desarrollo | `/blog/como-elegir-empresa-desarrollo-software-chile` | Indexado |
| Cómo digitalizar tu PYME | `/blog/como-digitalizar-tu-pyme-chile` | Indexado |
| Software a medida vs. genérico | `/blog/software-a-medida-vs-software-generico` | Indexado |
| Transformación digital 2025 | `/blog/transformacion-digital-2025` | Indexado |
| Observabilidad para productos digitales | `/blog/observabilidad-para-productos` | Indexado |

---

## 4. Estrategia de Parámetros UTM

Los parámetros UTM permiten identificar el origen exacto del tráfico en GA4.

### Schema de UTMs configurado

| Canal | `utm_source` | `utm_medium` | `utm_campaign` | `utm_content` |
|-------|-------------|--------------|----------------|---------------|
| Compartir por WhatsApp | `whatsapp` | `social` | `article_share` | `{id-del-articulo}` |
| Compartir por LinkedIn | `linkedin` | `social` | `article_share` | `{id-del-articulo}` |
| Artículos relacionados | `internal` | `related_articles` | `blog_engagement` | `{id-del-articulo}` |
| CTA en artículo | `blog` | `cta` | `article_cta` | `{id-del-articulo}` |

### Cómo ver UTMs en GA4

1. Ir a GA4 → Informes → Adquisición → Adquisición de tráfico
2. Usar la dimensión "Origen / Medio" (`utm_source / utm_medium`)
3. Crear un informe personalizado con dimensión "Campaña" para ver `utm_campaign`

### UTM Builder para campañas externas

Para crear links rastreados para campañas de email, redes sociales o ads:
- Usar: [ga-dev-tools.google.com/campaign-url-builder](https://ga-dev-tools.google.com/campaign-url-builder/)
- **Dominio base**: `https://devint.cl`
- **Convención**: snake_case, en minúsculas, sin espacios

---

## 5. DataLayer para GTM

Cuando se carga un artículo del blog, se hace un push automático al `dataLayer`:

```js
window.dataLayer.push({
  event: "article_view",
  article_title: "Título del artículo",
  article_path: "/blog/slug-del-articulo",
  article_id: "slug-del-articulo"
});
```

Cuando se detectan UTMs en la URL:
```js
window.dataLayer.push({
  event: "utm_captured",
  utm_source: "...",
  utm_medium: "...",
  utm_campaign: "...",
  utm_content: "..."  // si presente
});
```

Estos eventos pueden usarse como triggers en GTM para disparar tags específicos.

---

## 6. Bugs corregidos en esta sesión

| Bug | Causa raíz | Fix aplicado |
|-----|------------|-------------|
| Artículos relacionados redirigen a `/blog` | `blog.astro` usaba `p.slug` (API v4 eliminada en Astro v5) en vez de `p.id` | Reemplazado `slug` → `id` en `blog.astro` |
| Botones compartir no tenían tracking de origen | URLs de sharing sin parámetros UTM | Añadidos UTM a WhatsApp y LinkedIn en `[slug].astro` |
| SITE_URL apuntaba a proyecto incorrecto | `middleware.ts` tenía URL de Render de otro proyecto | Corregido a `https://devint.cl` |

---

## 7. Verificación post-deploy

### Lista de verificación

- [ ] Hacer deploy en Vercel (push a rama `main`)
- [ ] Verificar en GA4 → Informes en tiempo real → ver sesión activa al navegar
- [ ] Navegar desde `/blog` a un artículo → verificar que llega al artículo correcto
- [ ] Hacer click en artículo relacionado → verificar que navega correctamente
- [ ] Hacer click en "Compartir por WhatsApp" → verificar que el link tiene `utm_source=whatsapp`
- [ ] En GA4 → Informes en tiempo real → Eventos → verificar que `share` aparece al hacer click
- [ ] Verificar `utm_captured` en GA4 al visitar una URL con UTMs
- [ ] (Cuando se agregue GTM ID) Verificar en GTM Preview que el contenedor se carga

### Cómo activar el debug de GA4

1. Instalar extensión [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger) en Chrome
2. Activarla y navegar por el sitio
3. Abrir DevTools → Console → ver eventos enviados en tiempo real

### Verificar dataLayer

En la consola del navegador:
```js
window.dataLayer  // Ver todos los eventos empujados
```

---

## 8. Estructura de archivos de analytics

```
src/
  components/
    analytics/
      GoogleAnalytics.astro   ← GA4 directo (siempre activo)
      GTM.astro               ← Google Tag Manager (activo si PUBLIC_GTM_ID está en .env)
  layouts/
    BaseLayout.astro          ← Incluye ambos componentes en <head>
public/
  googlea9b879b187c4789c.html ← Verificación de Google Search Console
```

---

## 9. Configuración de `.env`

Ejemplo de archivo `.env` completo para este proyecto:

```env
# Google Tag Manager (obtener en tagmanager.google.com)
PUBLIC_GTM_ID=GTM-XXXXXXX

# Formspree (formulario de contacto)
FORMSPREE_FORM_ID=xanprgdl
```

---

*Informe generado: Junio 2025 — Devint Web Analytics Setup*
