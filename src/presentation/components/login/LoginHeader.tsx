import { Image, View } from "react-native";

export const LoginHeader = () => {
  return (
    <View className="items-center mb-10">
      <View className="w-24 h-24 rounded-full bg-white shadow-lg shadow-black/50 elevation-8">
        <Image
          source={require("../../../../assets/images/logo/logo.png")}
          className="h-full w-full rounded-full"
        />
      </View>
      <Image
        source={require("../../../../assets/images/logo/logo-letras.png")}
        style={{ width: 192, height: 64, marginTop: 1 }}
        resizeMode="contain"
        accessibilityLabel="PetHelp"
      />
      {/* <Text className="text-dark-text text-center text-base">
        Ingresa a tu cuenta para continuar
      </Text> */}
    </View>
  );
};
