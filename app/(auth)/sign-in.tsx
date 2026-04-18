import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SignIn = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>SignIn</Text>
      <Link href="/(auth)/sign-up">New? Create Account</Link>
    </View>
  );
};

export default SignIn;
