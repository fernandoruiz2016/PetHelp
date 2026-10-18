import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export const useLoginForm = () => {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState<{ user?: string; password?: string }>({});

    const validar = (): boolean => {
        const e: { user?: string; password?: string } = {};

        // Validaciones básicas de negocio
        if (user.length < 3) {
            e.user = 'El usuario debe tener mínimo 3 caracteres';
        }
        if (password.length < 6) {
            e.password = 'La contraseña debe tener mínimo 6 caracteres';
        }

        setErrors(e);
        // Retorna 'true' si no hay errores en el objeto.
        return Object.keys(e).length === 0;
    };

    const handleLogin = () => {
        // 1. Primero validamos. Si falla, detenemos todo con el 'return'.
        if (!validar()) return;

        // 2. Simulación de Login con la Base de Datos
        if (user === 'admin' && password === '123456') {
            // 💡 EXPLICACIÓN :
            // Usamos router.replace('/home') porque vamos a la pantalla '/home' 
            // y destruimos la pantalla de Login del historial para que el usuario 
            // no pueda regresar presionando el botón "Atrás" de Android/iOS.
            router.replace('/home');
        } else {
            Alert.alert('Error de Acceso', 'El usuario o contraseña son incorrectos.');
        }
    };

    return {
        user,
        setUser,
        password,
        setPassword,
        errors,
        handleLogin
    };
};
