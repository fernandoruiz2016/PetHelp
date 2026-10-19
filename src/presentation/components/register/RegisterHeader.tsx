import { Text, View } from 'react-native';

export const RegisterHeader = () => {
    return (
        <View className="items-center mb-8 mt-4">
            <View className="w-20 h-20 bg-indigo-100 rounded-full items-center justify-center mb-4">
                <Text className="text-3xl">🚀</Text>
            </View>
            <Text className="text-3xl font-extrabold text-slate-800 text-center mb-2">
                Crear Cuenta
            </Text>
            <Text className="text-slate-500 text-center text-base">
                Únete a nosotros hoy mismo
            </Text>
        </View>
    );
};
