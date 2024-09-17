import { Stack } from "expo-router/stack";
import { useFonts } from "expo-font";
import { Text } from "react-native";
export default function Layout() {
  const [fontsLoaded] = useFonts({
    inter: require("../assets/fonts/Inter.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <>
        <Text>Loading...</Text>
      </>
    );
  }
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
