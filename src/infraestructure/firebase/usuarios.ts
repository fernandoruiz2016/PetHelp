import type { DatosPerfil, Usuario } from "@/domain/models/Usuario";
import { doc, getDoc, setDoc } from "firebase/firestore/lite";
import { firestore } from "./firebase";

function baseDeDatos() {
  if (!firestore) throw new Error("Firebase no está configurado.");
  return firestore;
}

function leerCampo(valor: unknown) {
  return typeof valor === "string" ? valor.trim() || undefined : undefined;
}

export async function obtenerUsuario(uid: string, email: string): Promise<Usuario> {
  const db = baseDeDatos();
  const permiso = await getDoc(doc(db, "administradores", uid));
  if (permiso.exists()) return { uid, email, rol: "admin" };

  const perfil = (await getDoc(doc(db, "usuarios", uid))).data();
  return {
    uid,
    email,
    rol: "cliente",
    nombre: leerCampo(perfil?.nombre),
    apellidos: leerCampo(perfil?.apellidos),
    telefono: leerCampo(perfil?.telefono),
  };
}

export async function guardarPerfil(uid: string, { nombre, apellidos, telefono }: DatosPerfil) {
  await setDoc(doc(baseDeDatos(), "usuarios", uid), { nombre, apellidos, telefono }, { merge: true });
}
