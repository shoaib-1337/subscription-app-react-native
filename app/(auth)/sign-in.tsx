import { useSignIn } from "@clerk/expo";
import type { Href } from "expo-router";
import { Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const SignIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loading = fetchStatus === "fetching";

  const handleSubmit = async () => {
    setError("");
    try {
      const { error } = await signIn.password({
        emailAddress,
        password,
      });

      if (error) {
        setError(error.longMessage || error.message || "Sign-in failed.");
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl("/");
            router.replace(url as Href);
          },
        });
      } else {
        console.error("SignIn status:", signIn.status);
        setError("Sign-in could not be completed. Please try again.");
      }
    } catch (err: unknown) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="auth-scroll"
          contentContainerClassName="auth-content"
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Brand logo ── */}
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">R</Text>
              </View>
              <View className="gap-1">
                <Text className="auth-wordmark">Recurly</Text>
                <Text className="auth-wordmark-sub">SMART BILLING</Text>
              </View>
            </View>
          </View>

          {/* ── Headline ── */}
          <View className="items-center mb-6">
            <Text className="auth-title">Welcome back</Text>
            <Text className="auth-subtitle">
              Sign in to continue managing your subscriptions
            </Text>
          </View>

          {/* ── Form card ── */}
          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput
                  className={`auth-input ${error || errors?.fields?.identifier ? "auth-input-error" : ""}`}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                  returnKeyType="next"
                />
                {errors?.fields?.identifier && (
                  <Text className="auth-error">{errors.fields.identifier.message}</Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  className={`auth-input ${error || errors?.fields?.password ? "auth-input-error" : ""}`}
                  value={password}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  secureTextEntry
                  onChangeText={setPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                {errors?.fields?.password && (
                  <Text className="auth-error">{errors.fields.password.message}</Text>
                )}
              </View>

              {/* {error ? (
                <Text className="auth-error">{error}</Text>
              ) : null} */}

              <Pressable
                className={`auth-button ${!emailAddress || !password || loading
                  ? "auth-button-disabled"
                  : ""
                  }`}
                onPress={handleSubmit}
                disabled={!emailAddress || !password || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="auth-button-text">Sign in</Text>
                )}
              </Pressable>

              {/* ── Footer link ── */}
              <View className="auth-link-row">
                <Text className="auth-link-copy">New to Recurly?</Text>
                <Link href="/(auth)/sign-up" asChild>
                  <Pressable>
                    <Text className="auth-link">Create an account</Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
