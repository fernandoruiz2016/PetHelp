import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
  iconName?: ComponentProps<typeof Ionicons>["name"];
}

export const CustomTextInput = ({
  label,
  error,
  isPassword,
  iconName,
  onFocus,
  onBlur,
  ...props
}: CustomTextInputProps) => {
  const [isSecure, setIsSecure] = useState(isPassword || false);
  const [isFocused, setIsFocused] = useState(false);

  const { theme } = useTheme();

  return (
    <View className="mb-4">
      <Text className="text-dark-text font-semibold mb-2 ml-1">{label}</Text>

      <View
        className={`flex-row items-center border-2 rounded-2xl bg-slate-50 px-4 h-14 ${
          error ? "bg-red-50" : "bg-white"
        }`}
        style={{
          borderColor: error
            ? theme.error
            : isFocused
              ? theme.primary
              : theme.inputBorder,
        }}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={22}
            color={isFocused ? theme.primary : theme.inputBorder}
            style={{ marginRight: 12 }}
          />
        )}

        <TextInput
          className="flex-1 text-dark-text h-full pt-1 leading-none"
          secureTextEntry={isSecure}
          placeholderTextColor="#94a3b8"
          onFocus={(e) => {
            setIsFocused(true);
            onFocus && onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsSecure(!isSecure)}
            className="p-2"
          >
            <Ionicons
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={isFocused ? theme.primary : theme.inputBorder}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text className="text-red-500 text-sm mt-2 ml-2 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
};
