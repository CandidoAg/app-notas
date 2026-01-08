# 📝 NoteStack – React Native Task Manager

**NoteStack** es una aplicación moderna de gestión de tareas construida con **React Native** y **Expo**. Diseñada con un enfoque en la experiencia de usuario (UX), minimalismo y una arquitectura de componentes profesional totalmente tipada con **TypeScript**.

---

## ✨ Características Principales

* **🎨 UI Adaptativa (Modo Claro/Oscuro):** Sincronización inteligente de tema entre pantallas que respeta las preferencias del usuario.
* **📂 Categorización Dinámica:** Organiza tus tareas por Trabajo, Personal, Salud e Ideas con iconos y colores personalizados.
* **💡 Frases Inspiradoras:** Integración con API externa (ZenQuotes) para mostrar una dosis diaria de motivación.
* **📊 Filtros de Estado:** Visualiza rápidamente tus notas: Todas, Pendientes o Completadas.
* **📱 Diseño Cross-Platform:** Optimizado tanto para dispositivos móviles (iOS/Android) como para Web.
* **⚡ Arquitectura de Componentes:** Código modular y escalable con interfaces estrictas de TypeScript.

---

## 🛠️ Stack Tecnológico

* **Framework:** Expo (React Native)
* **Lenguaje:** TypeScript
* **Navegación:** Expo Router (Navegación basada en archivos)
* **Almacenamiento:** Async Storage
* **Iconos:** Expo Vector Icons (Ionicons)

---

## 🚀 Instalación y Uso

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/CandidoAg/app-notas.git
   cd app-notas
   ```
2. **Instalar dependencias:**
   ```bash
   npm install
   ```
3. **Iniciar el proyecto:**
   ```bash
   npx expo start
   ```
## 📂 Estructura del Proyecto

```text
app-notas/
├── app/                  # Rutas y Pantallas (Index, Details)
├── components/           # Componentes Atómicos (TaskItem, Header, Input...)
├── constants/            # Configuración de Temas, Colores y Categorías
├── assets/               # Recursos estáticos (Imágenes, Fuentes)
└── README.md             # Documentación
```

---

## 🚧 Roadmap (Próximos Pasos)

- [ ] 🔐 **Firebase Auth:** Implementación de Login (Email/Password).
- [ ] ☁️ **Cloud Firestore:** Persistencia de datos en la nube en tiempo real.
- [ ] 🔔 **Push Notifications:** Recordatorios inteligentes de tareas.
- [ ] 🧪 **Unit Testing:** Pruebas de componentes con Jest.

---
Desarrollado por **CandidoAg** – 2026.
