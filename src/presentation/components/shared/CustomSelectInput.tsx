import { useTheme } from "@/presentation/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';

interface SelectOption {
    label: string;
    value: string;
}

interface CustomSelectInputProps {
    label: string;
    value: string;
    options: SelectOption[];
    onValueChange: (value: string) => void;
    error?: string;
}

export const CustomSelectInput = ({
    label,
    value,
    options,
    onValueChange,
    error,
}: CustomSelectInputProps) => {
    const [open, setOpen] = useState(false);

    const { theme } = useTheme();

    return (
        <View className="mb-4">
            <Text className="text-dark-text font-semibold mb-2 ml-1">{label}</Text>

            <View className="flex-row items-center">

                <View className="flex-1">
                    <DropDownPicker<string>
                        open={open}
                        value={value || null}
                        items={options}
                        setOpen={setOpen}
                        setValue={(callback) => {
                            const nextValue =
                                typeof callback === "function"
                                    ? callback(value || null)
                                    : callback;

                            onValueChange(nextValue ?? "");
                        }}
                        listMode="SCROLLVIEW"
                        style={{
                            minHeight: 56,
                            borderWidth: 2,
                            borderRadius: 16,
                            borderColor: error ? theme.error : theme.inputBorder,
                            backgroundColor: error ? theme.form : theme.input,
                            paddingLeft: 16,
                        }}
                        dropDownContainerStyle={{
                            borderWidth: 2,
                            borderColor: theme.inputBorder,
                            borderRadius: 16,
                            backgroundColor: theme.form,
                        }}
                        textStyle={{
                            fontSize: 15,
                            color: theme.text,
                        }}
                        placeholderStyle={{
                            color: theme.placeholder,
                        }}
                        listItemLabelStyle={{
                            color: theme.text,
                        }}
                        selectedItemContainerStyle={{
                            backgroundColor: theme.primarySoft,
                        }}
                        selectedItemLabelStyle={{
                            fontWeight: "bold",
                            color: theme.primary,
                        }}
                        ArrowDownIconComponent={() => (
                            <Ionicons
                                name="chevron-down"
                                size={20}
                                color={theme.textMuted}
                            />
                        )}
                        ArrowUpIconComponent={() => (
                            <Ionicons
                                name="chevron-up"
                                size={20}
                                color={theme.textMuted}
                            />
                        )}
                        zIndex={open ? 3000 : 1}
                        zIndexInverse={1}
                    />
                </View>
            </View>

        </View >
    );
};
