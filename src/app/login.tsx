import { AuthScreen } from "@/presentation/components/auth/AuthScreen";
import { useLocalSearchParams } from "expo-router";

export default function LoginRoute() {
  const { modo } = useLocalSearchParams<{ modo?: string }>();
  const initialTab = modo === "register" ? "register" : "login";

  return <AuthScreen key={initialTab} initialTab={initialTab} />;
}
