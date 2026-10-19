import { Text, View } from "react-native";

interface HomeWelcomeProps {
    mensaje: string;
}

export const HomeWelcome = ({mensaje}: HomeWelcomeProps) => {
    return (
        <View className="bg-white rounded-3xl p-10 shadow-lg shadow-indigo-100 items-center w-full mb-8">
            <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
                <Text className="text-4xl">✅</Text>
            </View>
            <Text className="text-2xl font-black text-slate-800 text-center">
                {mensaje}
            </Text>
            <Text className="text-slate-500 text-center mt-3 text-base">
                Bienvenido al panel de control.
            </Text>
        </View>
    )
}