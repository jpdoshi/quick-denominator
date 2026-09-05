import { Text, View, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900 px-6">
      <StatusBar style="light" />
      <View className="w-full max-w-sm rounded-3xl bg-slate-800/80 p-8 shadow-2xl border border-slate-700/60 backdrop-blur-md items-center">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-500/30 mb-4 shadow-inner">
          <Text className="text-3xl font-bold text-cyan-400">⚡</Text>
        </View>

        <Text className="text-2xl font-extrabold text-white text-center mb-2 tracking-tight">
          Tailwind CSS
        </Text>
        <Text className="text-sm font-medium text-cyan-400 mb-4 tracking-wide uppercase">
          Configured with NativeWind
        </Text>

        <Text className="text-slate-400 text-center text-sm leading-relaxed mb-6">
          Expo SDK 57 is ready with Tailwind styling across iOS, Android, and Web.
        </Text>

        <Pressable className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r bg-cyan-500 active:bg-cyan-600 shadow-lg shadow-cyan-500/30 items-center justify-center">
          <Text className="text-slate-950 font-bold text-base">
            Get Started
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

