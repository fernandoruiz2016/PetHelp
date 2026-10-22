import { Image, Text, View } from 'react-native';

export const LoginHeader = () => {
    return (
        <View className="items-center mb-10">
            <Image
                source={require('../../../../assets/images/logo.png')}
                className='w-64 h-64 rounded-full'
            />
            <Text className="text-4xl font-extrabold text-dark-text text-center mb-2">
                Bienvenido
            </Text>
            <Text className="text-dark-text text-center text-base">
                Ingresa a tu cuenta para continuar
            </Text>
        </View>
    );
};
