# PetHelp

Aplicación móvil en desarrollo para organizar solicitudes de atención veterinaria y citas de mascotas. El proyecto incluye una interfaz para el administrador, una lista de solicitudes de ejemplo y la base de la gestión de solicitudes. Su estructura se basa en los principios de Clean Architecture, con separación entre dominio, datos y presentación.

> **Estado:** prototipo en desarrollo.

## Funcionalidades actuales

| Área                     | Estado actual                                                                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Inicio de sesión         | Formulario con validaciones básicas y acceso de demostración con credenciales definidas en el código.                        |
| Registro                 | Formulario con validaciones; muestra una confirmación, pero todavía no almacena usuarios.                                    |
| Inicio del administrador | Pantalla con tarjetas de resumen y accesos a solicitudes. Las cifras todavía requieren integración con el estado compartido. |
| Lista de solicitudes     | Muestra tarjetas con mascota, servicio, descripción, fecha y avatar según la especie (`PERRO`, `GATO` u `OTRO`).             |
| Tema visual              | Paletas clara y oscura mediante `ThemeContext`, NativeWind y fondos degradados.                                              |
| Gestión de solicitudes   | El contexto y el reducer definen operaciones para crear, actualizar y eliminar; falta completar y conectar el formulario.    |

## Tecnologías

- **Expo SDK 57** y **React Native 0.86** para la aplicación.
- **TypeScript** para los modelos y componentes.
- **Expo Router** para las rutas en `src/app/`.
- **NativeWind** para estilos y **expo-linear-gradient** para fondos.
- **Context API** y `useReducer` para el estado de las solicitudes.

## Ejecutar el proyecto

Necesitas Node.js, npm y un entorno donde abrir la aplicación Expo. Desde la raíz del proyecto:

```bash
npm ci
npm run start
```

Scripts para iniciar directamente las plataformas:

```bash
npm run android
npm run ios
npm run web
```

El inicio de sesión actual es **solo una simulación local**. Para probar el recorrido disponible, usa el usuario `admin` y la contraseña `123456`.

## Recorrido y estructura

La ruta inicial (`/`) redirige a `/login`. El acceso de demostración abre `/home`, desde donde se puede navegar a `/solicitudes`. El registro está en `/register`.

```text
assets/                 Imágenes, logos y avatares de mascotas
src/
  app/                  Pantallas y navegación con Expo Router
  data/                 Solicitudes de ejemplo
  domain/
    enums/              Tipos de servicio
    models/             Modelo Solicitud y tipos relacionados
  presentation/
    components/         Componentes de pantallas y elementos compartidos
    context/            Estado de solicitudes y tema visual
    hooks/              Lógica de formularios y resumen
    reducers/           Operaciones sobre la lista de solicitudes
    theme/              Colores para modo claro y oscuro
```

La lista se inicializa con **10 solicitudes de ejemplo** definidas en `src/data/SolicitudesIniciales.ts`. `SolicitudProvider` las carga en memoria y expone `crear`, `actualizar` y `eliminar`. Los cambios se pierden al reiniciar la aplicación.

Este README describe el contenido del archivo compartido y se actualizará conforme avance la implementación.
