import { Image, Text, View } from "react-native";

export const LoginHeader = () => {
  return (
    <View className="items-center mb-10">
      <View className="w-32 h-32 rounded-full bg-white shadow-lg shadow-black/50 elevation-8">
        <Image
          source={require("../../../../assets/images/logo/logo.png")}
          className="h-full w-full rounded-full"
        />
      </View>
      <Text className="text-4xl font-extrabold text-dark-text text-center mb-2">
        Bienvenido
      </Text>
      {/* <Text className="text-dark-text text-center text-base">
        Ingresa a tu cuenta para continuar
      </Text> */}
    </View>
  );
};
