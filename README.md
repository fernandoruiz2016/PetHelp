# PetHelp

Aplicación móvil para organizar las solicitudes de atención de una clínica veterinaria. Permite registrar citas, consultar su información y gestionar su estado. Su estructura se basa en los principios de Clean Architecture, con separación entre dominio, datos y presentación.

Está desarrollado con Expo y React Native. Las solicitudes se gestionan en memoria, sin servidor ni base de datos.

## Funcionalidades

- Inicio de sesión de demostración, prueba y formulario de registro con validaciones.
- Inicio con el resumen de las citas del día y accesos al listado y a una nueva cita.
- Listado con búsqueda por mascota, cliente o código, y filtros por fecha, estado, servicio y prioridad.
- Creación de citas con datos del cliente y la mascota, servicio, descripción, prioridad, fecha y hora. La prioridad inicial es **Normal** y el estado inicial es **Pendiente**.
- Vista de detalle, edición de los datos y del estado, y eliminación con confirmación.
- Tema claro y oscuro: toma el aspecto del sistema al abrir la app y permite cambiarlo desde el **menú de la foto de perfil** en Inicio.

## Tecnologías

- Expo SDK 57, React Native 0.86 y TypeScript.
- Expo Router para la navegación.
- NativeWind y `expo-linear-gradient` para los estilos.
- Context API y `useReducer` para el CRUD en memoria.

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

## Ejecución

Para probar la app con Expo Go, inicia el servidor de desarrollo:

```bash
npx expo start
```

Abre la app con el código QR en un dispositivo o presiona `a` para Android y `i` para el simulador de iOS. También puedes iniciar directamente un destino con `npm run android` o `npm run ios` (`ios` requiere macOS). El proyecto incluye `npm run web`, aunque el flujo principal está pensado para móvil.

Para compilar y ejecutar la aplicación localmente con Expo, utiliza el comando correspondiente a tu plataforma:

```bash
npx expo run:android
npx expo run:ios
```

Ejecuta solo el comando de la plataforma que vas a probar. `run:android` requiere Android Studio y Java/JDK; `run:ios` requiere macOS y Xcode. Para el flujo habitual con Expo Go basta con `npx expo start`.

En PowerShell, si la política de ejecución bloquea los comandos `npm` o `npx`, utiliza `npm.cmd` y `npx.cmd` con los mismos argumentos.

## Cómo probar el flujo CRUD

El acceso es de demostración:

| Campo      | Valor    |
| ---------- | -------- |
| Usuario    | `admin`  |
| Contraseña | `123456` |

1. Inicia sesión y abre **Todas las citas** desde Inicio o desde la barra inferior.
2. Usa la búsqueda y los filtros para localizar una cita. Toca una tarjeta para ver su detalle.
3. Pulsa **Nueva cita**, completa el formulario, elige fecha y hora disponibles y guarda. Si no cambias la prioridad, se guarda como **Normal**.
4. Abre la cita creada y pulsa **Editar cita**. Cambia, por ejemplo, la prioridad, la descripción o el estado a **En atención** o **Finalizado**, y guarda.
5. Vuelve al listado para comprobar el cambio. Para probar la eliminación, abre el detalle, pulsa **Eliminar cita** y confirma la acción.

El formulario muestra los errores bajo los campos correspondientes. Las horas ocupadas para la fecha elegida aparecen desactivadas; al editar, la hora de esa cita permanece seleccionada.

## Organización del proyecto

```text
assets/                         Imágenes, logos e iconos
src/
  app/                          Pantallas y rutas de Expo Router
  data/                         Solicitudes iniciales de demostración
  domain/
    enums/                      Tipos de servicio
    models/                     Modelo y tipos de Solicitud
    services/                   Generación de códigos de cita
  presentation/
    components/                 Componentes de interfaz reutilizables
    context/                    Estado global de solicitudes y tema
    hooks/                      Lógica de formularios y vistas
    reducers/                   Acciones CRUD de solicitudes
    theme/                      Paletas clara y oscura
```

La lista se inicializa con **20 solicitudes de ejemplo** definidas en `src/data/SolicitudesIniciales.ts`. `SolicitudProvider` las carga en memoria y comparte las operaciones de crear, actualizar, buscar y eliminar. El reducer aplica los cambios a la lista en memoria; las pantallas consumen ese contexto. Los cambios se pierden al reiniciar la aplicación.
