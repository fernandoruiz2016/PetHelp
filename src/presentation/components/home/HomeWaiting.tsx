import { ActivityIndicator, Text, View } from "react-native"

export const HomeWaiting = () => {
    return (
        <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="text-slate-400 mt-4 text-lg">Sincronizando datos...</Text>
        </View>
    )
}