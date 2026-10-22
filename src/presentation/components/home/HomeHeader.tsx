import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface HomeHeaderProps {
    onPress: () => void;
}

export const HomeHeader = ({ onPress }: HomeHeaderProps) => {
    return (
        <View className="flex-row justify-between items-center mb-12">
            <View className="flex-row gap-4 pl-2">
                <Text className="text-3xl font-extrabold text-primary-color">PetHelp</Text>
                <Ionicons
                    name="home"
                    size={36}
                    color='#b68de3'
                />
            </View>

            <TouchableOpacity
                className="bg-rose-100 px-2 py-2 rounded-xl"
                onPress={onPress}
            >
                <Text className="text-rose-600 font-bold text-sm">Cerrar Sesión</Text>
            </TouchableOpacity>
        </View>
    )
}