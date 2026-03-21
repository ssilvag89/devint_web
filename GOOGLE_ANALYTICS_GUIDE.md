# Google Analytics - Guía de Implementación

## 📊 Resumen

Este proyecto incluye una implementación completa de Google Analytics 4 (GA4) con tracking avanzado de eventos y conversiones.

**ID de Medición**: `G-YLEKSPRT2V`

## ✨ Características Implementadas

### 1. **Tracking Automático**
El componente `GoogleAnalytics.astro` incluye tracking automático de:

- ✅ **Vistas de página** - Cada vez que se carga una página
- ✅ **Clics en CTAs** - Botones de llamado a la acción
- ✅ **Navegación** - Clics en menús y enlaces
- ✅ **Enlaces externos** - Salida del sitio
- ✅ **Profundidad de scroll** - 25%, 50%, 75%, 100%
- ✅ **Envío de formularios** - Especialmente el formulario de contacto
- ✅ **Selección de servicios** - Cuando el usuario selecciona un servicio de interés
- ✅ **Reproducción de videos** - Si agregas videos más adelante
- ✅ **Descargas de archivos** - PDFs, ZIPs, etc.
- ✅ **Tiempo en página** - Cuánto tiempo permanece el usuario
- ✅ **Cambios de visibilidad** - Cuando el usuario cambia de pestaña
- ✅ **Errores de JavaScript** - Para debugging
- ✅ **Conversiones** - Leads generados (formulario de contacto)

### 2. **Eventos de Conversión**
Los siguientes eventos se trackean como conversiones importantes:

#### `generate_lead`
Se dispara cuando un usuario envía el formulario de contacto exitosamente.
```javascript
gtag('event', 'generate_lead', {
  event_category: 'conversion',
  event_label: 'desarrollo-software',
  service_interest: 'desarrollo-software',
  value: 1,
  currency: 'USD'
});
```

#### `form_submit`
Se dispara en cualquier envío de formulario.

#### `service_inquiry`
Para tracking de interés en servicios específicos.

## 🎯 Cómo Usar el Tracking Personalizado

### Opción 1: Usar el archivo de utilidades
Importa las funciones desde `src/utils/analytics.ts`:

```typescript
import { 
  trackCTAClick, 
  trackServiceInquiry,
  trackContactForm,
  trackConversion 
} from '@/utils/analytics';

// En un componente o script
trackCTAClick('Solicitar Cotización', '/contacto');
trackServiceInquiry('desarrollo-software');
trackContactForm('newsletter');
trackConversion('lead', 1);
```

### Opción 2: Usar data attributes (Recomendado para HTML)
Agrega atributos `data-cta` a tus botones:

```html
<a href="/contacto" data-cta="true">
  Contactar
</a>

<button data-cta="true">
  Solicitar Cotización
</button>
```

El componente GoogleAnalytics detectará automáticamente estos atributos.

### Opción 3: Llamar a gtag directamente
```html
<script>
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'nombre_evento', {
      event_category: 'categoria',
      event_label: 'etiqueta',
      value: 1
    });
  }
</script>
```

## 📈 Eventos Personalizados Disponibles

### Funciones de Analytics Utils

| Función | Descripción | Uso |
|---------|-------------|-----|
| `trackEvent()` | Evento genérico | `trackEvent('click', { event_label: 'botón' })` |
| `trackCTAClick()` | Clics en CTAs | `trackCTAClick('Cotizar', '/contacto')` |
| `trackContactForm()` | Formulario enviado | `trackContactForm('contact')` |
| `trackServiceInquiry()` | Interés en servicio | `trackServiceInquiry('cloud')` |
| `trackQuoteRequest()` | Solicitud de cotización | `trackQuoteRequest('webapp')` |
| `trackPhoneClick()` | Clic en teléfono | `trackPhoneClick('+56912345678')` |
| `trackEmailClick()` | Clic en email | `trackEmailClick('hola@devint.cl')` |
| `trackSocialClick()` | Clic en redes sociales | `trackSocialClick('LinkedIn', url)` |
| `trackBlogRead()` | Lectura de blog | `trackBlogRead('Título', 75)` |
| `trackSearch()` | Búsqueda | `trackSearch('desarrollo web', 10)` |
| `trackConversion()` | Conversión | `trackConversion('lead', 1)` |

## 🎨 Mejores Prácticas

### 1. Nombra tus eventos consistentemente
Usa snake_case para nombres de eventos:
- ✅ `service_inquiry`
- ✅ `cta_click`
- ❌ `serviceInquiry`
- ❌ `CTA-Click`

### 2. Agrupa eventos por categorías
```javascript
event_category: 'engagement'  // Para interacciones
event_category: 'conversion'  // Para conversiones
event_category: 'navigation'  // Para navegación
event_category: 'outbound'    // Para enlaces externos
```

### 3. Usa event_label para contexto
```javascript
event_label: 'desarrollo-software'  // Específico
event_label: 'header-cta'           // Ubicación
event_label: 'homepage'             // Página
```

### 4. Asigna valores monetarios a conversiones
```javascript
value: 1,           // Para contar
currency: 'USD'     // Opcional pero recomendado
```

## 🔧 Configuración en Google Analytics

### Paso 1: Verificar que GA4 esté recibiendo datos
1. Ve a Google Analytics
2. Abre **Informes en tiempo real**
3. Navega por tu sitio web
4. Verifica que aparezcan eventos en tiempo real

### Paso 2: Configurar Conversiones
1. Ve a **Configuración** → **Eventos**
2. Marca como conversión:
   - `generate_lead`
   - `form_submit`
   - `quote_request`
   - `service_inquiry`

### Paso 3: Crear Audiencias (Opcional)
Crea audiencias personalizadas basadas en:
- Usuarios que vieron servicios específicos
- Usuarios que scrollearon 75%+
- Usuarios que vieron la página de contacto pero no enviaron formulario

### Paso 4: Configurar Embudos (Funnels)
Ejemplo de embudo de conversión:
1. Vista de página de inicio
2. Vista de página de servicios
3. Vista de página de contacto
4. Envío de formulario (`generate_lead`)

## 🛡️ Privacidad y GDPR

El tracking está configurado con:
- ✅ `anonymize_ip: true` - Anonimización de IPs
- ✅ `allow_ad_personalization_signals: false` - Sin personalización de anuncios
- ✅ `cookie_flags: 'SameSite=None;Secure'` - Cookies seguras

### Agregar Banner de Cookies (Recomendado)
Si operas en Europa o con clientes europeos, considera agregar un banner de consentimiento de cookies.

## 📊 Informes Útiles en GA4

### 1. **Rendimiento de CTAs**
- Ve a **Exploración** → Crear nuevo
- Dimensión: `event_label`
- Métrica: `event_count`
- Filtro: `event_name = 'cta_click'`

### 2. **Interés por Servicios**
- Dimensión: `event_label` (servicios)
- Métrica: `event_count`
- Filtro: `event_name = 'service_inquiry' OR 'service_view'`

### 3. **Tasa de Conversión**
- Métrica: Eventos de `generate_lead`
- vs. Sesiones totales

### 4. **Engagement por Página**
- Dimensión: `page_path`
- Métricas: `scroll` (75%+), `time_on_page`, `cta_click`

## 🚀 Próximos Pasos Sugeridos

### 1. Integrar con Google Tag Manager (Opcional)
Para gestión más flexible de tags sin modificar código.

### 2. Configurar Meta Pixel / LinkedIn Insight Tag
Para remarketing en redes sociales.

### 3. Configurar Google Search Console
Para SEO y datos de búsqueda orgánica.

### 4. Implementar Hotjar o Clarity
Para mapas de calor y grabaciones de sesión.

### 5. Crear Dashboards en Google Data Studio
Para visualizaciones personalizadas.

## 🐛 Debugging

### Verificar que GA está cargado:
```javascript
console.log(window.gtag);  // Debe mostrar una función
console.log(window.dataLayer);  // Debe mostrar un array
```

### Activar modo debug:
```javascript
gtag('config', 'G-YLEKSPRT2V', {
  debug_mode: true
});
```

### Ver eventos en consola:
Instala la extensión **Google Analytics Debugger** en Chrome.

## 📞 Soporte

Para preguntas sobre la implementación, contacta al equipo de desarrollo.

## 📝 Notas Importantes

- Los eventos pueden tardar hasta 24-48 horas en aparecer en informes estándar de GA4
- Los informes en tiempo real muestran datos con ~segundos de retraso
- Las conversiones deben configurarse manualmente en GA4
- Los datos históricos no se pueden modificar retroactivamente

---

**Última actualización**: Marzo 2026
**Versión**: 1.0
**Mantenido por**: Equipo Devint
