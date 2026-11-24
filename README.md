# PetHelp

Aplicación móvil para organizar las solicitudes de atención de una clínica veterinaria. Permite registrar citas, gestionar veterinarios, consultar información de pacientes y administrar su estado. Su estructura se basa en los principios de Clean Architecture, con separación entre dominio, infraestructura y presentación.

Está desarrollada con Expo y React Native. Las solicitudes (citas) y los veterinarios se guardan localmente en SQLite, mientras que las razas de mascotas se consultan desde dos APIs externas REST mediante Axios.

## Funcionalidades

- Registro de clientes e inicio de sesión con correo y contraseña mediante Firebase Authentication.
- Sesiones persistentes y acceso a pantallas según el rol (`cliente` y `admin`). El cliente tiene su propio inicio, historial de citas y edición de perfil; el administrador gestiona la agenda y el personal.
- Inicio con el resumen de las citas del día y accesos rápidos a citas, nueva cita y veterinarios.
- **CRUD completo de citas (SQLite):** creación con datos del cliente y mascota, especie, raza opcional, servicio, descripción, prioridad, fecha y hora (validando horarios ocupados), búsqueda por mascota, cliente o código, filtros por fecha/estado/servicio/prioridad, edición con asignación de veterinario y eliminación con confirmación.
- **CRUD completo de veterinarios (SQLite):** creación, listado, edición, activación/desactivación y eliminación.
- **Consumo de dos APIs externas REST (`TheDogAPI` y `TheCatAPI`):** selector buscable de razas de perros y gatos en el formulario de citas, implementado con `axios` e interceptors (`x-api-key`), caché en memoria y manejo de estados de carga, error y reintento sin bloquear el uso offline.
- Tema claro y oscuro: toma el aspecto del sistema al abrir la app y permite cambiarlo desde el **menú de la foto de perfil** en Inicio.

## Tecnologías

- Expo SDK 57, React Native 0.86 y TypeScript.
- Expo Router para la navegación y protección de rutas por rol.
- NativeWind y `expo-linear-gradient` para los estilos.
- `expo-sqlite` para persistencia local de citas y veterinarios, y Context API con `useReducer` para el estado global.
- `axios` con clientes dedicados e interceptors para el consumo de las dos APIs externas REST (**TheDogAPI** y **TheCatAPI**).
- Firebase Authentication para las cuentas y Firestore para perfiles y permisos de administrador.

## Requisitos

- Node.js y npm.
- Para Android: un dispositivo compatible con Expo Go o un emulador configurado en Android Studio. Para compilar localmente, también se necesitan el SDK de Android y Java/JDK.
- Para iOS: un dispositivo compatible con Expo Go o, en macOS, un simulador configurado con Xcode. Xcode es necesario para compilar localmente.

## Instalación

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/fernandoruiz2016/PetHelp.git
cd PetHelp
npm install
```

También puedes usar `npm ci` para instalar exactamente las versiones registradas en `package-lock.json`.

## Configuración de variables de entorno

Antes de iniciar la app, crea un archivo `.env` en la raíz del proyecto tomando como plantilla `.env.example`:

- **Firebase:** `EXPO_PUBLIC_FIREBASE_API_KEY`, `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`, `EXPO_PUBLIC_FIREBASE_PROJECT_ID`, `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`, `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `EXPO_PUBLIC_FIREBASE_APP_ID`.
- **APIs externas de razas:**
  - `EXPO_PUBLIC_DOG_API_KEY` (clave gratuita de [TheDogAPI](https://thedogapi.com/))
  - `EXPO_PUBLIC_CAT_API_KEY` (clave gratuita de [TheCatAPI](https://thecatapi.com/))

## Credenciales de prueba

Para revisar los flujos de ambos roles, se encuentran registradas las siguientes cuentas de prueba:

| Rol               | Correo               | Contraseña |
| :---------------- | :------------------- | :--------- |
| **Administrador** | `admin@pethelp.test` | `123456`   |
| **Cliente**       | `fran@pethelp.test`  | `123456`   |

## Ejecución

Para probar la app con Expo Go, inicia el servidor de desarrollo (usa `-c` la primera vez o tras modificar `.env`):

```bash
npx expo start -c
```

Abre la app con el código QR en un dispositivo o presiona `a` para Android y `i` para el simulador de iOS. También puedes iniciar directamente un destino con `npm run android` o `npm run ios` (`ios` requiere macOS). El proyecto incluye `npm run web`, aunque el flujo principal está pensado para móvil.

Para compilar y ejecutar la aplicación localmente con Expo, utiliza el comando correspondiente a tu plataforma:

```bash
npx expo run:android
npx expo run:ios
```

Ejecuta solo el comando de la plataforma que vas a probar. `run:android` requiere Android Studio y Java/JDK; `run:ios` requiere macOS y Xcode. Para el flujo habitual con Expo Go basta con `npx expo start`.

En PowerShell, si la política de ejecución bloquea los comandos `npm` o `npx`, utiliza `npm.cmd` y `npx.cmd` con los mismos argumentos.

## Cómo probar los flujos principales

### Citas y selector de razas (APIs externas)

1. Inicia sesión con la cuenta de administrador (`admin@pethelp.test`) o cliente (`fran@pethelp.test`).
2. Pulsa **Nueva cita** (o **Reservar cita** como cliente), elige **Perro** o **Gato** y abre **Raza de mascota (opcional)** para buscar entre las razas cargadas desde **TheDogAPI** y **TheCatAPI**.
3. Completa el formulario, elige fecha y hora disponibles y guarda.
4. En **Todas las citas**, usa la búsqueda y los filtros para localizar una cita, toca una tarjeta para ver su detalle (incluida la raza) y prueba **Editar cita** (incluida la asignación de veterinario) o **Eliminar cita**.

### Veterinarios (CRUD local en SQLite)

1. Con la cuenta de administrador, abre **Veterinarios** desde Inicio.
2. Pulsa **Nuevo veterinario**, registra sus datos y guarda.
3. Toca cualquier veterinario del listado para editar sus datos, cambiar su estado **Activo/Inactivo** o eliminarlo (si tiene citas asignadas, la app bloquea el borrado y avisa al usuario).

El formulario de citas muestra los errores bajo los campos correspondientes. Las horas ocupadas para la fecha elegida aparecen desactivadas; al editar, la hora de esa cita permanece seleccionada.

## Organización del proyecto

```text
assets/                         Imágenes, logos e iconos
src/
  app/                          Pantallas y rutas de Expo Router (admin y cliente)
  domain/
    enums/                      Tipos de servicio
    models/                     Modelos de Solicitud, Usuario, Veterinario y Raza
    repositories/               Contratos de repositorios
    services/                   Generación de códigos y reglas de horarios
  infraestructure/
    api/                        Clientes Axios con interceptors (TheDogAPI y TheCatAPI)
    database/                   Inicialización y esquema SQLite
    firebase/                   Configuración de Firebase Auth y perfiles
    repositories/               Implementaciones SQLite de citas y veterinarios
  presentation/
    components/                 Componentes de interfaz reutilizables
    context/                    Estado global (Auth, Solicitudes, Veterinarios y Tema)
    hooks/                      Lógica de formularios, vistas y consumo de APIs
    reducers/                   Acciones CRUD de solicitudes y veterinarios
    theme/                      Paletas clara y oscura
    utils/                      Validaciones y utilidades de presentación
```

`SolicitudProvider` y `VeterinariosProvider` cargan sus registros desde SQLite. Al crear, actualizar o eliminar, primero guardan el cambio en la base de datos local y luego actualizan el estado que consumen las pantallas.

## Integrantes del grupo

- Fernando Ruiz
- Miler Flores
- Laura Ruiz
