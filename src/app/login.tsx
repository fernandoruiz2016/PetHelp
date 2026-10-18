import { LoginHeader } from "@/presentation/components/login/LoginHeader";
import { CustomTextInput } from "@/presentation/components/shared/CustomTextInput";
import { PrimaryButton } from "@/presentation/components/shared/PrimaryButton";
import { useLoginForm } from "@/presentation/hooks/useLoginForm";
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function LoginRoute() {
    const { user, setUser, password, setPassword, errors, handleLogin } = useLoginForm();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-slate-100"
        >
            <ScrollView contentContainerClassName="flex-grow">
                <View className="flex-1 px-6 pt-24 pb-12">

                    {/* Tarjeta flotante (Card) */}
                    <View className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-300 elevation-10 mt-10">

                        <LoginHeader/>

                        <CustomTextInput
                            label="Nombre de Usuario"
                            placeholder="usuario"
                            value={user}
                            onChangeText={setUser}
                            keyboardType="default"
                            autoCapitalize="none"
                            autoCorrect={false}
                            error={errors.user}
                        />

                        <CustomTextInput
                            label="Contraseña"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            isPassword={true}
                            error={errors.password}
                        />

                        <PrimaryButton title="Ingresar" onPress={handleLogin} />

                        {/* Navegación al registro */}
                        <TouchableOpacity
                            className="mt-6 p-2"
                            onPress={() => router.push('/register')}
                        >
                            <Text className="text-center text-slate-500 text-base">
                                ¿Aún no tienes cuenta?{' '}
                                <Text className="text-indigo-600 font-bold">Regístrate aquí</Text>
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}