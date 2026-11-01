import { Redirect } from "expo-router";

export default function RegistroRoute() {
  return (
    <Redirect href={{ pathname: "/login", params: { modo: "register" } }} />
  );
}
