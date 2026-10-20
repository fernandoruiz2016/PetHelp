import { HomeHeader } from '@/presentation/components/home/HomeHeader';
import { HomeModuleCard } from '@/presentation/components/home/HomeModuleCard';
import { HomeWaiting } from '@/presentation/components/home/HomeWaiting';
import { HomeWelcome } from '@/presentation/components/home/HomeWelcome';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function HomeRoute() {
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState('');

    // Efecto que simula traer datos de internet
    useEffect(() => {
        setTimeout(() => {
            setMensaje('Bienvenido a PetHelp');
            setCargando(false);
        }, 1500);
    }, []);

    const handleLogout = () => {
        router.replace('/login');
    };

    return (
        <View className="flex-1 bg-slate-50 px-6 pt-16">
            {/* Header del Home */}
            <HomeHeader onPress={handleLogout} ></HomeHeader>

            {cargando ? (
                <HomeWaiting />
            ) : (
                <View className="flex-1 items-center justify-center">

                    <HomeWelcome mensaje={mensaje} ></HomeWelcome>

                    <View className="flex-col gap-3 w-full px-6">
                        <HomeModuleCard 
                        title="Ver Solicitudes" 
                        iconName="document-text-outline" 
                        onPress={() => router.push('/solicitudes')} 
                        ></HomeModuleCard>
                        
                        <HomeModuleCard 
                        title="Realizar una solicitud" 
                        iconName="add-circle-outline" 
                        onPress={() => router.push('/solicitudes')} 
                        ></HomeModuleCard>
                    </View>

                </View>
            )}
        </View>
    );
}
