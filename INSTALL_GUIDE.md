# 🎨 Guía de Instalación: Zasly Kitchen Pro (Desktop)

¡Bienvenido al panel de cocina de próxima generación! Esta guía te llevará paso a paso para tener tu aplicación de escritorio funcionando con la calidad y fluidez de **Canva**.

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
*   **Node.js** (Versión 18 o superior)
*   **NPM** (Viene con Node.js)

---

## 🚀 Pasos para la Instalación

### 1. Clonar y Preparar
Si acabas de descargar el proyecto, abre una terminal en la carpeta `kitchen-desktop` y ejecuta:
```powershell
npm install
```
*Esto instalará todos los motores de diseño y el núcleo de la aplicación.*

### 2. Configurar la "Magia" (Supabase)
Asegúrate de que tu archivo `.env` tenga las credenciales correctas. Ya lo hemos dejado listo con las del proyecto principal para que no tengas que hacer nada.

### 3. Modo Diseñador (Desarrollo)
Para ver la aplicación en tiempo real mientras trabajas, como si estuvieras en el editor de Canva:
```powershell
npm run electron:dev
```
*Esto abrirá una ventana de escritorio profesional conectada a tu código.*

---

## 📦 Cómo Crear el Ejecutable (.exe)

Cuando estés listo para lanzar la aplicación final como un profesional:

### Paso A: Construir los activos
```powershell
npm run build
```

### Paso B: Generar el instalador
```powershell
npx electron-builder --config electron-builder.json
```

---

## ✨ Características Pro (Estilo Canva)

*   **Interfaz Inmersiva:** Sin barras de menú innecesarias para máxima concentración en los pedidos.
*   **Shadows & Glows:** Efectos visuales de alta calidad en cada comanda.
*   **Real-time Sync:** Tus pedidos aparecen al instante, sin recargar, como por arte de magia.
*   **Performance Extremo:** Optimizado para PC para que la cocina nunca se detenga.

---

## 🆘 ¿Algo no va bien?

*   **Error de Puertos:** Si ves un mensaje de "Port in use", no te preocupes. La app es inteligente e intentará buscar otro puerto disponible automáticamente.
*   **Pantalla Blanca:** Verifica tu conexión a internet. La app necesita comunicarse con Supabase para traer tus deliciosos pedidos.

---

¡Disfruta de la experiencia **Zasly Kitchen Pro**! 🚀👨‍🍳
