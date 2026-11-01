import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomNavigationProps {
  selectedTab: "home" | "citas" | null;
  onHomePress: () => void;
  onCreatePress: () => void;
  onCitasPress: () => void;
}

export function BottomNavigation({
  selectedTab,
  onHomePress,
  onCreatePress,
  onCitasPress,
}: BottomNavigationProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const homeColor =
    selectedTab === "home" ? theme.navIconActive : theme.navIconInactive;
  const citasColor =
    selectedTab === "citas" ? theme.navIconActive : theme.navIconInactive;

  return (
    <View
      className="flex-row items-end px-6 pt-3"
      style={{
        backgroundColor: "transparent",
        paddingBottom: Math.max(insets.bottom, 12),
        paddingLeft: Math.max(insets.left, 24),
        paddingRight: Math.max(insets.right, 24),
      }}
    >
      <TouchableOpacity
        className="min-h-14 flex-1 items-center justify-center"
        onPress={onHomePress}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityLabel="Inicio"
        aria-selected={selectedTab === "home"}
      >
        <Ionicons
          name={selectedTab === "home" ? "home" : "home-outline"}
          size={26}
          color={homeColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 items-center"
        onPress={onCreatePress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Crear nueva cita"
      >
        <View
          className="h-14 w-14 items-center justify-center rounded-full border-4"
          style={{
            marginTop: -12,
            backgroundColor: theme.primary,
            borderColor: theme.form,
          }}
        >
          <Ionicons name="add" size={32} color={theme.onPrimary} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="min-h-14 flex-1 items-center justify-center"
        onPress={onCitasPress}
        activeOpacity={0.7}
        accessibilityRole="tab"
        accessibilityLabel="Ver todas las citas"
        aria-selected={selectedTab === "citas"}
      >
        <Ionicons
          name={selectedTab === "citas" ? "calendar" : "calendar-outline"}
          size={26}
          color={citasColor}
        />
      </TouchableOpacity>
    </View>
  );
}
