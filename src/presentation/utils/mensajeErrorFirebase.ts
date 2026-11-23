import { FirebaseError } from "firebase/app";

const mensajes: Record<string, string> = {
  "auth/invalid-credential": "El correo o la contraseña son incorrectos.",
  "auth/user-not-found": "El correo o la contraseña son incorrectos.",
  "auth/wrong-password": "El correo o la contraseña son incorrectos.",
  "auth/invalid-email": "Ingresa un correo electrónico válido.",
  "auth/email-already-in-use": "Ya existe una cuenta con este correo. Puedes iniciar sesión.",
  "auth/weak-password": "Elige una contraseña que cumpla los requisitos de seguridad.",
  "auth/password-does-not-meet-requirements": "Elige una contraseña que cumpla los requisitos de seguridad.",
  "auth/network-request-failed": "Comprueba tu conexión e intenta de nuevo.",
  "auth/too-many-requests": "Espera unos minutos e intenta de nuevo.",
  "auth/user-disabled": "Esta cuenta está desactivada.",
  "auth/operation-not-allowed": "El acceso por correo todavía no está habilitado.",
  "permission-denied": "El servicio no permite guardar el perfil en este momento.",
  unavailable: "Comprueba tu conexión e intenta de nuevo.",
};

export function mensajeErrorFirebase(error: unknown, fallback: string) {
  return error instanceof FirebaseError ? mensajes[error.code] ?? fallback : fallback;
}
