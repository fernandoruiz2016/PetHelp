import { useTheme } from "@/presentation/context/ThemeContext";
import { Pressable, Text, View } from "react-native";

export type AuthTab = "login" | "register";

interface AuthTabsProps {
  selectedTab: AuthTab;
  onSelect: (tab: AuthTab) => void;
}

const tabs: { value: AuthTab; label: string }[] = [
  { value: "login", label: "Ingresar" },
  { value: "register", label: "Registrarte" },
];

export function AuthTabs({ selectedTab, onSelect }: AuthTabsProps) {
  const { theme } = useTheme();

  return (
    <View
      className="mb-6 flex-row rounded-full p-1"
      style={{ backgroundColor: theme.tabsBackground }}
      accessibilityRole="tablist"
    >
      {tabs.map(({ value, label }) => (
        <Pressable
          key={value}
          className="min-h-11 flex-1 items-center justify-center rounded-full px-2 py-3"
          style={{
            backgroundColor:
              selectedTab === value ? theme.accentSoft : "transparent",
          }}
          onPress={() => onSelect(value)}
          accessibilityRole="tab"
          accessibilityState={{ selected: selectedTab === value }}
          accessibilityLabel={label}
        >
          <Text
            className="text-base font-semibold"
            style={{ color: theme.text }}
          >
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
