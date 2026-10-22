import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface HomeSummaryCardProps {
    title: string;
    value: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    color: string;
    backgroundColor: string;
}

export const HomeSumaryCard = ({ title, value, icon, color, backgroundColor }: HomeSummaryCardProps) => {
    return (
        <View
            className="flex-col items-center justify-center rounded-2xl py-2 px-4 gap-0 w-[48%]"
            style={{ backgroundColor }}>
            <View
                className="mb-3 h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: color }}
            >
                <Ionicons
                    name={icon}
                    size={28}
                    color="#FFFFFF"
                />
            </View>

            <Text className="text-3xl font-bold text-dark-text text-center">{value}</Text>
            <Text className="text-sm text-dark-text text-center">{title}</Text>
        </View>


    )
}