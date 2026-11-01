import { Text, View } from "react-native";

export function HomeDate({
  fechaActual,
  textColor,
}: {
  fechaActual: Date;
  textColor: string;
}) {
  const fecha = new Intl.DateTimeFormat("es-PE", { dateStyle: "full" }).format(
    fechaActual,
  );

  return (
    <View className="mb-5 mt-5 w-full">
      <Text
        className="text-center text-xl font-normal"
        style={{ color: textColor }}
      >
        {fecha.charAt(0).toUpperCase() + fecha.slice(1)}
      </Text>
    </View>
  );
}
