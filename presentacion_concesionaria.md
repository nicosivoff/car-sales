# 🚗 Plataforma Web de Concesionaria LUXEMOTORS

Esta presentación detalla la experiencia del usuario y las funcionalidades clave de la plataforma web de la concesionaria, incluyendo la navegación del cliente, la búsqueda filtrada y la carga de inventario desde el panel de administración.

---

## 📽️ Video Demostrativo del Funcionamiento Completo

A continuación puedes ver un recorrido continuo que muestra el flujo completo: desde la llegada de un cliente al inicio, la navegación por el catálogo interactivo con filtros, la consulta de detalles de un auto y, finalmente, el acceso al panel de administración para agregar y editar un vehículo.

![Recorrido interactivo por la web](file:///C:/Users/solsi/.gemini/antigravity-ide/brain/4577d16f-9458-42cf-ba98-75088c144bd3/concesionaria_demo_1782742512545.webp)

---

## 📂 Arquitectura de Navegación

```mermaid
graph TD
    A["🌐 Cliente - Página de Inicio"] --> B["🔍 Catálogo General"]
    A --> C["💰 Planes de Financiación"]
    B --> D["📄 Ficha de Detalle de Vehículo"]
    D --> E["⚡ Comparador de Vehículos"]
    D --> F["💬 Consulta Directa por WhatsApp"]
    
    G["🔑 Operador - Panel de Admin"] --> H["📊 Listado de Inventario Activo"]
    H --> I["🔄 Ordenamiento Asc/Desc (Año, Km, Precio)"]
    H --> J["➕ Creación de Publicación (Drag & Drop)"]
    H --> K["✏️ Modificación/Baja de Publicación"]
```

---

## 📂 Secciones de la Plataforma

### 1. Página de Inicio (Landing Page)
La pantalla de bienvenida presenta la identidad de la concesionaria con un diseño limpio, moderno y orientado a la conversión.

> [!NOTE]
> **Detalles de la Sección:**
> * **Hero Section:** Banner principal con eslogan de marca llamativo y botón de acción directa.
> * **Nuestros Autos (Destacados):** Galería con carrusel deslizable infinito en celulares y grilla responsive en computadoras.
> * **Planes de Financiación:** Tarjetas reorganizadas verticalmente en celulares (`h-[72px]`) para encajar en una sola pantalla.

![Página de Inicio](file:///C:/Users/solsi/.gemini/antigravity-ide/brain/4577d16f-9458-42cf-ba98-75088c144bd3/home_page_1782742590953.png)

---

### 2. Catálogo e Interacción con Filtros
La sección de catálogo permite a los usuarios buscar eficientemente entre los vehículos disponibles.

> [!TIP]
> **Filtros Avanzados:**
> * **Barra de Búsqueda:** Búsqueda en tiempo real por texto (por ejemplo, "Volkswagen").
> * **Rango de Precios Desplazable:** Deslizador de precio máximo ajustado dinámicamente según el inventario.
> * **Filtros Colapsables en Mobile:** Menú de filtros tipo acordeón para no sobrecargar el espacio en pantallas pequeñas.

![Catálogo Inicial](file:///C:/Users/solsi/.gemini/antigravity-ide/brain/4577d16f-9458-42cf-ba98-75088c144bd3/catalog_page_initial_1782742628701.png)

---

### 3. Ficha de Detalle del Vehículo
Al hacer clic en "Ver detalles" de cualquier vehículo en el catálogo, se abre una vista dedicada.

> [!IMPORTANT]
> **Características Destacadas:**
> * **Galería:** Visor de imágenes interactivo.
> * **Comparador Integrado:** Sugiere vehículos similares para contrastar especificaciones en una tarjeta compacta de doble columna.
> * **Contacto Rápido:** Enlace directo a Google Maps, correo electrónico y WhatsApp sin formularios de por medio en móvil.

![Detalle de Vehículo](file:///C:/Users/solsi/.gemini/antigravity-ide/brain/4577d16f-9458-42cf-ba98-75088c144bd3/vehicle_details_1782742674853.png)

---

### 4. Panel de Administración
El área de administración permite gestionar el catálogo en tiempo real.

| Característica | Detalle Técnico |
| :--- | :--- |
| **Acciones Rápidas** | Botones de edición y borrado apilados verticalmente a la izquierda para mayor comodidad. |
| **Ordenamiento de Lista** | Ordenación ascendente/descendente directa al pulsar Año, Kilómetros o Precio en la cabecera. |
| **Carga de Archivos** | Selector local y zona de **Drag & Drop** que genera vistas previas de imágenes en Base64. |
| **Botón FAB** | Botón flotante animado de creación de publicación abajo a la derecha de la pantalla. |

![Panel de Administración](file:///C:/Users/solsi/.gemini/antigravity-ide/brain/4577d16f-9458-42cf-ba98-75088c144bd3/admin_dashboard_1782742692925.png)
