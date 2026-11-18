import { create } from 'axios';
import type { Veterinario } from '../../domain/models/Veterinario';
import type { VeterinarioRepository } from '../../domain/repositories/VeterinarioRepository';

const CRUD_BASE_URL = process.env.EXPO_PUBLIC_CRUD_BASE_URL ?? 'REEMPLAZA_TU_TOKEN';

const api = create({
    baseURL: CRUD_BASE_URL,
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const method = config.method?.toUpperCase();
    console.log(`[API REQUEST] ${method} ${config.baseURL}${config.url}`);
    if (config.data) console.log('[API BODY]', config.data);
    return config;
});

api.interceptors.response.use(
    (response) => {
        console.log(`[API RESPONSE] ${response.status} ${response.config.url}`);
        console.log('[API DATA]', response.data);
        return response;
    },
    (error) => {
        console.log('[API ERROR]', error.response?.status, error.message);
        return Promise.reject(error);
    },
);

function validarBaseUrl() {
    if (CRUD_BASE_URL.includes('REEMPLAZA_TU_TOKEN')) {
        throw new Error('Falta reemplazar la URL del endpoint');
    }
}

export async function listar(): Promise<Veterinario[]> {
    validarBaseUrl();
    const response = await api.get<Veterinario[]>('/users');
    return response.data;
}

export const veterinarioRepository: VeterinarioRepository = {
    listar,
};
