import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const useRegisterForm = () => {
    const [nombre, setNombre] = useState('');
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [errors, setErrors] = useState<{
        nombre?: string;
        user?: string;
        email?: string;
        phone?: string,
        password?: string;
        confirmar?: string;
    }>({});

    // 💡 EXPLICACIÓN : EFECTO EN TIEMPO REAL
    // useEffect "escucha" los cambios. Al poner [email] al final (array de dependencias),
    // le decimos a React: "Cada vez que el usuario teclee algo en el email, ejecuta esta función".
    useEffect(() => {
        if (email.length > 0 && !email.includes('@')) {
            // Usamos ...prev para no borrar otros errores (como los del password)
            setErrors((prev) => ({ ...prev, email: 'Formato de correo inválido' }));
        } else {
            setErrors((prev) => ({ ...prev, email: undefined }));
        }
    }, [email]);

    const validar = (): boolean => {
        const e: typeof errors = {};

        if (nombre.trim().length === 0) e.nombre = 'Tu nombre es requerido';
        if (user.trim().length === 0) e.user = 'Tu nombre de usuario es requerido';
        if (!email.includes('@')) e.email = 'Formato de correo inválido';
        if (phone.trim().length === 0) e.user = 'Tu número de teléfono es requerido';
        if (password.length < 6) e.password = 'La contraseña requiere mínimo 6 caracteres';
        if (password !== confirmar) e.confirmar = 'Las contraseñas no coinciden';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleRegistro = () => {
        if (!validar()) return;

        // esto se cambiará cuando se tenga listo la lógica para usuarios
        Alert.alert(
            '¡Registro completado!',
            `Bienvenido a PetHelp, ${nombre}`,
            [
                {
                    text: 'Ir al Login',
                    // 💡 EXPLICACIÓN :
                    // Tras registrar, regresamos al login usando replace o push dependiendo de la navegación deseada.
                    onPress: () => router.replace('/login')
                }
            ]
        );
    };

    return {
        nombre, setNombre,
        user, setUser,
        email, setEmail,
        phone, setPhone,
        password, setPassword,
        confirmar, setConfirmar,
        errors, handleRegistro
    };
};
