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
            <Text className="text-slate-700 font-semibold mb-2 ml-1">{label}</Text>

            <View
                className={`flex-row items-center border-2 rounded-2xl bg-slate-50 px-4 h-14 ${error
                        ? 'border-red-400 bg-red-50'
                        : isFocused
                            ? 'border-indigo-500 bg-white'
                            : 'border-slate-200'
                    }`}
            >
                <TextInput
                    className="flex-1 text-base text-slate-800 h-full"
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
                            color={isFocused ? "#4f46e5" : "#94a3b8"}
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
