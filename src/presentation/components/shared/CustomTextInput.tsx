import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

interface CustomTextInputProps extends TextInputProps {
    label: string;
    error?: string;
    isPassword?: boolean;
}

export const CustomTextInput = ({ label, error, isPassword, onFocus, onBlur, ...props }: CustomTextInputProps) => {
    const [isSecure, setIsSecure] = useState(isPassword || false);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className="mb-4">
            <Text className="text-dark-text font-semibold mb-2 ml-1">{label}</Text>

            <View
                className={`flex-row items-center border-2 rounded-2xl bg-slate-50 px-4 h-14 ${error
                        ? 'border-red-400 bg-red-50'
                        : isFocused
                            ? 'border-primary-color bg-white'
                            : 'border-slate-300 bg-white'
                    }`}
            >
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
                            color={isFocused ? "#b68de3" : "#94a3b8"}
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
