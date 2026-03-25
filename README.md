# Panel de Cocina Desktop

Aplicación de escritorio para el panel de cocina del sistema de restaurantes Zasly Menu.

## 🚀 Configuración Rápida

### 1. Instalar dependencias
```bash
npm install
```

### 2. Variables de entorno
El archivo `.env` ya está configurado con las credenciales de Supabase del proyecto principal:
- `VITE_SUPABASE_URL`: URL del proyecto Supabase
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Clave pública de Supabase
- `VITE_SUPABASE_PROJECT_ID`: ID del proyecto

### 3. Iniciar desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── kitchen/          # Componentes del panel de cocina
│   │   ├── KitchenLayout.tsx
│   │   └── KitchenSidebar.tsx
│   └── ui/               # Componentes UI reutilizables
│       ├── button.tsx
│       ├── card.tsx
│       └── badge.tsx
├── contexts/
│   └── RestaurantContext.tsx  # Contexto del restaurante
├── hooks/
│   └── use-orders.ts     # Hooks para gestionar pedidos
├── lib/
│   ├── utils.ts          # Utilidades
│   └── supabase.ts       # Cliente de Supabase
├── pages/
│   ├── KitchenOrders.tsx # Página de pedidos activos
│   └── KitchenHistory.tsx # Página de historial
└── App.tsx               # Aplicación principal
```

## 🔧 Funcionalidades

### Panel de Cocina
- **Pedidos Activos**: Muestra pedidos en tiempo real con estados:
  - `pendiente` → `preparando` → `listo` → `entregado`
- **Historial**: Consulta de pedidos completados
- **Actualizaciones en Vivo**: Conexión real-time con Supabase

### Estados de Pedidos
- 🟡 **Pendiente**: Nuevo pedido recibido
- 🔵 **Preparando**: Pedido en cocina
- 🟢 **Listo**: Pedido listo para entrega
- ⚪ **Entregado**: Pedido completado

## 🗄️ Base de Datos

La aplicación se conecta a la base de datos Supabase del proyecto principal:

### Tablas utilizadas:
- `orders`: Pedidos del restaurante
- `order_items`: Items de cada pedido

### Schema relevante:
```sql
orders (
  id, restaurant_id, order_number, table_name,
  status, customer_name, customer_phone, customer_address,
  priority, delivery_driver_id, delivery_status,
  estimated_delivery_time, subtotal, total, notes,
  created_at, updated_at
)

order_items (
  id, order_id, menu_item_id, name, quantity,
  unit_price, notes, created_at
)
```

## 🎨 Tecnologías

- **Frontend**: React 18 + TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Radix UI + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📱 Próximos Pasos

### Para crear versión desktop (.exe):
1. Instalar Electron:
```bash
npm install --save-dev electron electron-builder
```

2. Configurar archivo `electron.js`
3. Actualizar `package.json` con scripts de build
4. Generar instalador con `npm run build:exe`

### Personalización recomendada:
- Agregar logo del restaurante
- Configurar colores de marca
- Agregar notificaciones de escritorio
- Implementar sonido para nuevos pedidos

## 🐛 Solución de Problemas

### Errores comunes:
1. **Error de conexión a Supabase**: Verificar variables de entorno en `.env`
2. **No se muestran pedidos**: Asegurar que el `restaurant_id` sea correcto
3. **Error de TypeScript**: Revisar rutas de importación relativas

### Logs útiles:
- La aplicación muestra errores en consola para depuración
- Los cambios de estado se registran en tiempo real

## 📞 Soporte

Este proyecto es parte del sistema Zasly Menu. Para dudas técnicas:
- Revisar consola del navegador para errores específicos
- Verificar conexión a Supabase en Network tab
- Validar estructura de datos en la base de datos
