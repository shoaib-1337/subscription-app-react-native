import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useClerk, useUser } from "@clerk/expo";
import { Image } from "react-native";
import { images } from "@/constants/images";

const SafeAreaView = styled(RNSafeAreaView)

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-2xl font-sans-bold text-primary mb-6">Settings</Text>

      {/* ── Profile card ── */}
      <View className="rounded-2xl border border-border bg-card p-4 flex-row items-center gap-4 mb-6">
        <Image source={images.avatar} className="size-14 rounded-full" />
        <View className="flex-1 min-w-0">
          <Text className="text-lg font-sans-bold text-primary" numberOfLines={1}>
            {user?.fullName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || "User"}
          </Text>
          <Text className="text-sm font-sans-medium text-muted-foreground" numberOfLines={1}>
            {user?.emailAddresses?.[0]?.emailAddress || ""}
          </Text>
        </View>
      </View>

      {/* ── Logout button ── */}
      <Pressable
        onPress={() => signOut()}
        className="items-center rounded-full bg-destructive py-4"
      >
        <Text className="text-base font-sans-bold text-white">Log out</Text>
      </Pressable>
    </SafeAreaView>
  )
}

export default Settings