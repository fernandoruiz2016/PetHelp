import axios, { AxiosError, type AxiosInstance } from "axios";

const DOG_API_BASE_URL = "https://api.thedogapi.com/v1";
const CAT_API_BASE_URL = "https://api.thecatapi.com/v1";

const DOG_API_KEY = process.env.EXPO_PUBLIC_DOG_API_KEY?.trim();
const CAT_API_KEY = process.env.EXPO_PUBLIC_CAT_API_KEY?.trim();

function crearMensajeError(error: AxiosError): string {
  if (error.code === "ECONNABORTED") {
    return "La consulta de razas tardó demasiado. Intenta de nuevo.";
  }
  if (!error.response) {
    return "Sin conexión para cargar las razas. Puedes continuar o reintentar.";
  }
  return `No se pudieron cargar las razas (error ${error.response.status}).`;
}

function crearClienteRazas(
  baseURL: string,
  apiKey: string | undefined,
): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      Accept: "application/json",
    },
  });

  client.interceptors.request.use((config) => {
    if (apiKey) {
      config.headers.set("x-api-key", apiKey);
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (axios.isAxiosError(error)) {
        return Promise.reject(new Error(crearMensajeError(error)));
      }
      return Promise.reject(
        error instanceof Error
          ? error
          : new Error("No se pudieron cargar las razas."),
      );
    },
  );

  return client;
}

export const dogApiClient = crearClienteRazas(DOG_API_BASE_URL, DOG_API_KEY);
export const catApiClient = crearClienteRazas(CAT_API_BASE_URL, CAT_API_KEY);
