# 📝 NoteStack – React Native & Firebase Task Manager

**NoteStack** es una aplicación profesional de gestión de tareas construida con **React Native** y **Expo**. Ha evolucionado de un prototipo local a una plataforma **Cloud-Native** segura, con sincronización en tiempo real y una arquitectura blindada contra vulnerabilidades comunes.

---

## ✨ Características Principales

* **☁️ Sincronización en Tiempo Real:** Integración nativa con **Firebase Firestore**. Los cambios se reflejan instantáneamente en todos tus dispositivos sincronizados.
* **🛡️ Seguridad Blindada (Anti-IDOR):** Implementación de reglas de seguridad en el servidor que impiden el acceso no autorizado a notas ajenas, incluso manipulando manualmente los parámetros de la URL.
* **🎨 UI Adaptativa (Modo Claro/Oscuro):** Sistema de temas dinámico mediante Context API que garantiza una experiencia visual coherente y profesional.
* **🌐 Resiliencia Web:** Configuración optimizada con `experimentalForceLongPolling` para evadir bloqueos de conexión causados por AdBlockers o Firewalls restrictivos.
* **📂 Gestión Inteligente:** Categorización por Trabajo, Personal, Salud e Ideas con iconos y colores personalizados y filtrado dinámico.
* **🧹 Protección de Datos Efímera:** Limpieza automática del estado (`setTask(null)`) ante pérdida de permisos o cierre de sesión para evitar fugas visuales de información confidencial.

---

## 🛠️ Stack Tecnológico

* **Framework:** [Expo](https://expo.dev/) (React Native)
* **Backend:** [Firebase 10+](https://firebase.google.com/) (Auth & Firestore)
* **Lenguaje:** TypeScript (Tipado estricto para mayor robustez)
* **Navegación:** Expo Router (File-based routing)
* **Persistencia Local:** Async Storage (Gestión de persistencia de sesión)

---

## 🚀 Instalación y Uso

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/CandidoAg/app-notas.git](https://github.com/CandidoAg/app-notas.git)
   cd app-notas
2. **Variables de entorno:**
   ```text EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=<tu_auth_domain>
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=<tu_project_id>
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=<tu_storage_bucket>
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<tu_sender_id>
   EXPO_PUBLIC_FIREBASE_APP_ID=<tu_app_id>
2. **Instalar dependencias:**
   ```bash
   npm install
3. **Iniciar el proyecto:**
   ```bash
   npx expo start
## 📂 Estructura del Proyecto
```text
app-notas/
├── app/                  # Rutas y Pantallas (Auth, Notas, Detalles)
├── components/           # Componentes Atómicos y UI (TaskItem, Header)
├── context/              # Gestión de Estado Global (Theme, Auth)
├── lib/                  # Configuración de Firebase y servicios
├── constants/            # Configuración de Temas, Colores y Categorías
└── README.md             # DocumentaciónDME.md             # Documentación
```

---
## 🛡️ Reglas de Seguridad
```bash
service cloud.firestore {
   match /databases/{database}/documents {
      match /tasks/{taskId} {
         allow read, update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      }
   }
}
```

---
## 🚧 Roadmap Actualizado

- [x] 🔐 **Firebase Auth:** Implementado (Registro/Login).
- [x] ☁️ **Cloud Firestore:** Persistencia en tiempo real configurada.
- [x] 🛡️ **Security Hardening:** Protección contra IDOR y AdBlockers exitosa.
- [ ] 🔔 **Push Notifications:** Recordatorios inteligentes de tareas.
- [ ] 🧪 **Unit Testing:** Implementación de pruebas con Jest.

---
Desarrollado por **CandidoAg** – 2026.
