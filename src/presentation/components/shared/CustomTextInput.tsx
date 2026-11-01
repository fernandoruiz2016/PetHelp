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
  multiline,
  ...props
}: CustomTextInputProps) => {
  const [isSecure, setIsSecure] = useState(isPassword || false);
  const [isFocused, setIsFocused] = useState(false);

  const { theme } = useTheme();

  return (
    <View className="mb-4">
      <Text className="font-semibold mb-2 ml-1" style={{ color: theme.text }}>
        {label}
      </Text>

      <View
        className={`flex-row items-center border-2 rounded-2xl px-4 ${multiline ? "h-32" : "h-14"}`}
        style={{
          backgroundColor: theme.input,
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
          className={
            multiline ? "h-full flex-1 py-3" : "h-full flex-1 pt-1 leading-none"
          }
          style={{ color: theme.text }}
          secureTextEntry={isSecure}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : undefined}
          placeholderTextColor={theme.placeholder}
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
        <Text
          className="text-sm mt-2 ml-2 font-medium"
          style={{ color: theme.error }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
