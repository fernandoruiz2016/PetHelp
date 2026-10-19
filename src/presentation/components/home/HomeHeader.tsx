import { Text, TouchableOpacity, View } from "react-native";

interface HomeHeaderProps {
    onPress: () => void;
}

export const HomeHeader = ({onPress}: HomeHeaderProps) => {
    return (
        <View className="flex-row justify-between items-center mb-8">
            <Text className="text-3xl font-extrabold text-indigo-700">Panel 🏠</Text>
            <TouchableOpacity
                className="bg-rose-100 px-5 py-2 rounded-xl"
                onPress={onPress}
            >
                <Text className="text-rose-600 font-bold">Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    )
}