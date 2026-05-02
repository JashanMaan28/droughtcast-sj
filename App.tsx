import "./global.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-2xl font-bold text-sky-700">
          DroughtCast SJ
        </Text>
        <Text className="mt-2 text-stone-600">NativeWind smoke test ✓</Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
