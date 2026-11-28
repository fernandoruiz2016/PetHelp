import * as Network from "expo-network";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";

export function useSincronizacionAutomatica(
  onSincronizar: () => void | Promise<void>,
  habilitado = true,
) {
  const networkState = Network.useNetworkState();
  const conectado =
    networkState.isConnected === undefined
      ? true
      : Boolean(networkState.isConnected) &&
        networkState.isInternetReachable !== false;

  const callbackRef = useRef(onSincronizar);
  callbackRef.current = onSincronizar;

  const estabaConectado = useRef<boolean | null>(null);

  useEffect(() => {
    if (!habilitado) return;
    if (conectado && estabaConectado.current === false) {
      void callbackRef.current();
    }
    estabaConectado.current = conectado;
  }, [conectado, habilitado]);

  useEffect(() => {
    if (!habilitado) return;

    const appSub = AppState.addEventListener("change", (estado) => {
      if (estado === "active") {
        void callbackRef.current();
      }
    });

    return () => {
      appSub.remove();
    };
  }, [habilitado]);

  return { conectado };
}
