import { Text, View } from "react-native";
import RegisterImage from "../../../../assets/images/register2.svg";

export const RegisterHeader = () => {
  return (
    <View className="items-center mb-8 mt-12">
      <View className="h-32 w-32 items-center justify-center rounded-full bg-primary-color mb-4">
        <RegisterImage width={110} height={110} />
      </View>
      <Text className="text-3xl font-extrabold text-dark-text text-center mb-2">
        Crear Cuenta
      </Text>
      <Text className="text-dark-text text-center text-base">
        Únete a nosotros hoy mismo
      </Text>
    </View>
  );
};
