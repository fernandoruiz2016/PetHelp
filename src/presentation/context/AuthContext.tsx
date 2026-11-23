import type { DatosPerfil, Usuario } from "@/domain/models/Usuario";
import { auth } from "@/infraestructure/firebase/firebase";
import { guardarPerfil, obtenerUsuario } from "@/infraestructure/firebase/usuarios";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from "react";

type ResultadoSesion =
  | { estado: "error" }
  | { estado: "perfilPendiente"; usuario: Usuario }
  | { estado: "lista"; usuario: Usuario };

type Sesion = ResultadoSesion | { estado: "sinConfig" | "cargando" | "sinSesion" };
type Operacion = "login" | "registro" | "perfil" | "salida";

interface AuthContextValue {
  sesion: Sesion;
  ocupado: boolean;
  borradorPerfil?: DatosPerfil;
  iniciarSesion: (email: string, password: string) => Promise<void>;
  registrar: (email: string, password: string, perfil: DatosPerfil) => Promise<void>;
  guardarMiPerfil: (perfil: DatosPerfil) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  reintentar: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [usuarioFirebase, setUsuarioFirebase] = useState<User | null>();
  const [intento, setIntento] = useState(0);
  const [verificacion, setVerificacion] = useState<{
    user: User;
    intento: number;
    resultado: ResultadoSesion;
  }>();
  const [operacion, setOperacion] = useState<Operacion | null>(null);
  const ocupacion = useRef(false);
  const [datosRegistro, setDatosRegistro] = useState<{ uid: string; perfil: DatosPerfil }>();

  useEffect(() => {
    if (auth) return onAuthStateChanged(auth, setUsuarioFirebase);
  }, []);

  const registrando = operacion === "registro";
  useEffect(() => {
    if (!usuarioFirebase || registrando) return;
    const user = usuarioFirebase;
    let vigente = true;

    async function verificar() {
      let resultado: ResultadoSesion;
      try {
        if (!user.email) throw new Error("La cuenta no tiene correo.");
        const usuario = await obtenerUsuario(user.uid, user.email);
        const necesitaPerfil = usuario.rol === "cliente" &&
          (!usuario.nombre || !usuario.apellidos || !usuario.telefono);
        resultado = { estado: necesitaPerfil ? "perfilPendiente" : "lista", usuario };
      } catch {
        resultado = { estado: "error" };
      }

      if (vigente) setVerificacion({ user, intento, resultado });
    }

    void verificar();
    return () => { vigente = false; };
  }, [intento, registrando, usuarioFirebase]);

  let sesion: Sesion = { estado: "cargando" };
  if (!auth) sesion = { estado: "sinConfig" };
  else if (usuarioFirebase === null) sesion = { estado: "sinSesion" };
  else if (!registrando && verificacion?.user === usuarioFirebase && verificacion?.intento === intento) {
    sesion = verificacion.resultado;
  }

  const reintentar = () => setIntento((actual) => actual + 1);

  async function ejecutar(tipo: Operacion, accion: (instancia: Auth) => Promise<void>) {
    if (!auth) throw new Error("Firebase no está configurado.");
    if (ocupacion.current) return;
    ocupacion.current = true;
    setOperacion(tipo);
    try {
      await accion(auth);
    } finally {
      ocupacion.current = false;
      setOperacion(null);
    }
  }

  const iniciarSesion = (email: string, password: string) =>
    ejecutar("login", async (instancia) => {
      await signInWithEmailAndPassword(instancia, email, password);
    });

  const registrar = (email: string, password: string, perfil: DatosPerfil) =>
    ejecutar("registro", async (instancia) => {
      const { user } = await createUserWithEmailAndPassword(instancia, email, password);
      try {
        await guardarPerfil(user.uid, perfil);
      } catch {
        // La cuenta ya existe. La pantalla de perfil permite reintentar el guardado.
        setDatosRegistro({ uid: user.uid, perfil });
      }
    });

  async function guardarMiPerfil(perfil: DatosPerfil) {
    if (ocupacion.current) throw new Error("Hay otra operación en curso.");

    await ejecutar("perfil", async (instancia) => {
      const user = instancia.currentUser;
      if (
        !user ||
        (sesion.estado !== "lista" && sesion.estado !== "perfilPendiente") ||
        sesion.usuario.rol !== "cliente" ||
        sesion.usuario.uid !== user.uid
      ) {
        throw new Error("No hay una sesión de cliente activa.");
      }

      await guardarPerfil(user.uid, perfil);
      if (instancia.currentUser !== user) throw new Error("La sesión ha cambiado.");

      setDatosRegistro(undefined);
      if (sesion.estado === "perfilPendiente") {
        reintentar();
        return;
      }

      setVerificacion((actual) => {
        if (actual?.user !== user || actual.intento !== intento || actual.resultado.estado !== "lista") {
          return actual;
        }

        return {
          ...actual,
          resultado: { estado: "lista", usuario: { ...actual.resultado.usuario, ...perfil } },
        };
      });
    });
  }

  const cerrarSesion = () => ejecutar("salida", async (instancia) => {
    await signOut(instancia);
    setDatosRegistro(undefined);
  });

  return (
    <AuthContext.Provider value={{
      sesion,
      ocupado: operacion !== null,
      borradorPerfil: datosRegistro?.uid === usuarioFirebase?.uid ? datosRegistro?.perfil : undefined,
      iniciarSesion,
      registrar,
      guardarMiPerfil,
      cerrarSesion,
      reintentar,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe utilizarse dentro de AuthProvider.");
  return contexto;
}
