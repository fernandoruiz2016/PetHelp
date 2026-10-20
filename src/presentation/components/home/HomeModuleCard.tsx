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
            className="w-full flex-row bg-white shadow-sm rounded-2xl p-5 items-center border border-slate-100 justify-center active:bg-slate-50"
        >
            <Ionicons name={iconName} size={28} color="#4f46e5" className="ml-4 mr-1" />
            <Text className="text-slate-700 font-bold text-center text-sm flex-1">{title}</Text>
        </TouchableOpacity>
    );
};