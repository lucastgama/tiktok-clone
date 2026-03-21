import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  console.log(isSignedIn)

  if (!isSignedIn) {
    return <Redirect href={"/login"} />;
  }

  return <Stack />;
}
