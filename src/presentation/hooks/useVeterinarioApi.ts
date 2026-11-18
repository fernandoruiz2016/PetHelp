import { useCallback, useEffect, useState } from 'react';
import type { Veterinario } from '../../domain/models/Veterinario';
import type { VeterinarioRepository } from '../../domain/repositories/VeterinarioRepository';

export function useVeterinarioApi(repository: VeterinarioRepository) {
    const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
    const [veterinarioFirstName, setVeterinarioFirstName] = useState('');
    const [veterinarioLastName, setVeterinarioLastName] = useState('');
    const [veterinarioEmail, setVeterinarioEmail] = useState('');
    const [veterinarioPhone, setVeterinarioPhone] = useState('');
    const [veterinarioImage, setVeterinarioImage] = useState('');
    const [veterinarioId, setVeterinarioId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadVeterinarios = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await repository.listar();
            setVeterinarios(data);
        } catch {
            setError('No se pudo cargar veterinarios.');
        } finally {
            setLoading(false);
        }
    }, [repository]);

    useEffect(() => {
        void Promise.resolve().then(loadVeterinarios);
    }, [loadVeterinarios]);

    return {
        veterinarios,
        veterinarioFirstName,
        veterinarioLastName,
        veterinarioEmail,
        veterinarioPhone,
        veterinarioImage,
        veterinarioId,
        setVeterinarioFirstName,
        setVeterinarioLastName,
        setVeterinarioEmail,
        setVeterinarioPhone,
        setVeterinarioImage,
        loading,
        error,
        loadVeterinarios,
    };
}
