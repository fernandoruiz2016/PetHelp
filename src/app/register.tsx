import { RegisterHeader } from '@/presentation/components/register/RegisterHeader';
import { CustomTextInput } from "@/presentation/components/shared/CustomTextInput";
import { PrimaryButton } from "@/presentation/components/shared/PrimaryButton";
import { useRegisterForm } from '@/presentation/hooks/useRegisterForm';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function RegistroRoute() {
    const {
        nombre, setNombre,
        user, setUser,
        email, setEmail,
        phone, setPhone,
        password, setPassword,
        confirmar, setConfirmar,
        errors, handleRegistro
    } = useRegisterForm();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView contentContainerClassName="flex-grow">

                <View className="flex-1 px-2 pt-4 pb-12">

                    {/* Tarjeta flotante (Card) */}
                    <View className="bg-white rounded-3xl p-8 elevation-10">

                        <RegisterHeader />

                        <CustomTextInput
                            label="Nombre Completo"
                            placeholder="Ej. Juan Pérez"
                            value={nombre}
                            onChangeText={setNombre}
                            autoCapitalize="words"
                            error={errors.nombre}
                        />

                        <CustomTextInput
                            label="Nombre de Usuario"
                            placeholder="Ej. username"
                            value={user}
                            onChangeText={setUser}
                            autoCapitalize="none"
                            autoCorrect={false}
                            error={errors.user}
                        />

                        <CustomTextInput
                            label="Teléfono"
                            placeholder="Número de teléfono"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="numeric"
                            autoCapitalize="none"
                            autoCorrect={false}
                            error={errors.phone}
                        />

                        <CustomTextInput
                            label="Correo Electrónico"
                            placeholder="correo@ejemplo.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={errors.email}
                        />

                        <CustomTextInput
                            label="Crear Contraseña"
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            isPassword={true}
                            error={errors.password}
                        />

                        <CustomTextInput
                            label="Confirmar Contraseña"
                            placeholder="••••••••"
                            value={confirmar}
                            onChangeText={setConfirmar}
                            isPassword={true}
                            error={errors.confirmar}
                        />

                        <PrimaryButton title="Completar Registro" onPress={handleRegistro} />

                        <TouchableOpacity className="mt-8 p-2" onPress={() => router.back()}>
                            <Text className="text-center text-dark-text text-base">
                                ¿Ya estás registrado?{' '}
                                <Text className="text-primary-color font-bold">Inicia Sesión</Text>
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}
