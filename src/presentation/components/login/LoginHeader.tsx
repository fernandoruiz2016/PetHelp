import { Text, View } from 'react-native';

export const LoginHeader = () => {
    return (
        <View className="items-center mb-10">
            <View className="w-24 h-24 bg-indigo-100 rounded-full items-center justify-center mb-6">
                <Text className="text-4xl">🔐</Text>
            </View>
            <Text className="text-4xl font-extrabold text-slate-800 text-center mb-2">
                Bienvenido
            </Text>
            <Text className="text-slate-500 text-center text-base">
                Ingresa a tu cuenta para continuar 👋
            </Text>
        </View>
    );
};
