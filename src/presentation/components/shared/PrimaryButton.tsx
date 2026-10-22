import { Text, TouchableOpacity } from 'react-native';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    className?: string;
}

export const PrimaryButton = ({ title, onPress, className = '' }: PrimaryButtonProps) => {
    return (
        <TouchableOpacity
            className={`bg-primary-color rounded-2xl h-14 mt-2 shadow-sm justify-center items-center active:bg-purple-400 ${className}`}
            onPress={onPress}
        >
            <Text className="text-white font-bold text-lg tracking-wide">
                {title}
            </Text>
        </TouchableOpacity>
    );
};
