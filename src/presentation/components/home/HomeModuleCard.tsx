import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

interface HomeModuleCardProps {
    title: string;
    iconName: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
}

export const HomeModuleCard = ({ title, iconName, onPress }: HomeModuleCardProps) => {
    return (
        <TouchableOpacity 
            onPress={onPress}
            activeOpacity={0.7}
            className="w-full flex-row bg-white shadow-sm rounded-2xl p-5 items-center border border-primary-color justify-center active:bg-slate-50"
        >
            <Ionicons name={iconName} size={28} color="#b68de3" className="ml-4 mr-1" />
            <Text className="text-dark-text font-bold text-center text-sm flex-1">{title}</Text>
        </TouchableOpacity>
    );
};