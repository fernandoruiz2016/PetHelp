import { LoginForm } from "@/presentation/components/login/LoginForm";
import { LoginHeader } from "@/presentation/components/login/LoginHeader";
import { RegisterForm } from "@/presentation/components/register/RegisterForm";
import { ScreenLayout } from "@/presentation/components/shared/ScreenLayout";
import { useTheme } from "@/presentation/context/ThemeContext";
import { useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { AuthTabs, type AuthTab } from "./AuthTabs";

interface AuthScreenProps {
  initialTab?: AuthTab;
}

export function AuthScreen({ initialTab = "login" }: AuthScreenProps) {
  const [selectedTab, setSelectedTab] = useState<AuthTab>(initialTab);
  const scrollRef = useRef<ScrollView>(null);
  const { theme } = useTheme();

  const seleccionarTab = (tab: AuthTab) => {
    if (tab === selectedTab) return;
    Keyboard.dismiss();
    setSelectedTab(tab);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: theme.background }}
    >
      <ScreenLayout style={{ justifyContent: "center" }}>
        <ScrollView
          ref={scrollRef}
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-2 pt-4 pb-12">
            <View
              className={`rounded-3xl p-4 elevation-10 ${selectedTab === "login" ? "mt-10" : ""}`}
            >
              <LoginHeader />
              <Text
                className="mb-4 text-center text-xl font-medium"
                style={{ color: theme.text }}
              >
                {selectedTab === "login"
                  ? "Ingresa a tu cuenta para continuar"
                  : "Crea una cuenta"}
              </Text>

              <View
                className="pt-5 pb-5 px-6 py-6 rounded-[30] shadow-lg shadow-black/50 elevation-8"
                style={{ backgroundColor: theme.background }}
              >
                <AuthTabs selectedTab={selectedTab} onSelect={seleccionarTab} />
                <View
                  style={{ display: selectedTab === "login" ? "flex" : "none" }}
                >
                  <LoginForm
                    onShowRegister={() => seleccionarTab("register")}
                  />
                </View>
                <View
                  style={{
                    display: selectedTab === "register" ? "flex" : "none",
                  }}
                >
                  <RegisterForm onShowLogin={() => seleccionarTab("login")} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}
