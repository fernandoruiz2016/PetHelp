import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image, Text, View } from "react-native";

interface HomeWelcomeProps {
    mensaje: string;
}

export const HomeWelcome = ({ mensaje }: HomeWelcomeProps) => {
    return (
        <View className="bg-violet-100 rounded-3xl p-6 items-center w-full mb-8">
            <View className='flex-row gap-4'>
                <MaterialCommunityIcons
                    name="hand-wave"
                    size={40}
                    color="#b68de3"
                />
                <Text className="text-2xl font-black text-dark-text text-center">
                    {mensaje}
                </Text>
            </View>

            <View className='flex-row gap-2 justify-center items-center'>
                <Text className="text-dark-text text-center mt-3 text-base w-3/5">
                    En el panel de control puedes acceder ver y crear solicitudes
                </Text>
                <Image
                    source={require('../../../../assets/images/home.png')}
                    className='w-2/5 h-28'
                />
            </View>

        </View>


    )
}