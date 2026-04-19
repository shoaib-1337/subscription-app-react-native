import { useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
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
import { styled } from "nativewind";
import type { Href } from "expo-router";

const SafeAreaView = styled(RNSafeAreaView);

const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const loading = fetchStatus === "fetching";

  // Check if we're in verification state
  const pendingVerification =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields?.includes("email_address") &&
    signUp.missingFields?.length === 0;

  const onSignUpPress = async () => {
    setError("");
    try {
      const { error } = await signUp.password({
        emailAddress,
        password,
      });

      if (error) {
        setError(error.longMessage || error.message || "Sign-up failed.");
        return;
      }

      // Send email verification code
      if (!error) {
        await signUp.verifications.sendEmailCode();
      }
    } catch (err: unknown) {
      setError("Something went wrong. Please try again.");
    }
  };

  const onPressVerify = async () => {
    setError("");
    try {
      await signUp.verifications.verifyEmailCode({ code });

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: ({ decorateUrl }) => {
            const url = decorateUrl("/");
            router.replace(url as Href);
          },
        });
      } else {
        console.error("Sign-up not complete:", signUp.status);
        setError("Verification could not be completed. Please try again.");
      }
    } catch (err: unknown) {
      setError("Invalid verification code. Please try again.");
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
              <View>
                <Text className="auth-wordmark">Recurly</Text>
                <Text className="auth-wordmark-sub">SMART BILLING</Text>
              </View>
            </View>
          </View>

          {!pendingVerification ? (
            <>
              {/* ── Headline ── */}
              <View className="items-center mb-6">
                <Text className="auth-title">Create an account</Text>
                <Text className="auth-subtitle">
                  Sign up to start managing your subscriptions
                </Text>
              </View>

              {/* ── Form card ── */}
              <View className="auth-card">
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Email</Text>
                    <TextInput
                      className={`auth-input ${error || errors?.fields?.emailAddress ? "auth-input-error" : ""}`}
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={emailAddress}
                      placeholder="Enter your email"
                      placeholderTextColor="#999"
                      onChangeText={setEmailAddress}
                      keyboardType="email-address"
                      returnKeyType="next"
                    />
                    {errors?.fields?.emailAddress && (
                      <Text className="auth-error">{errors.fields.emailAddress.message}</Text>
                    )}
                  </View>

                  <View className="auth-field">
                    <Text className="auth-label">Password</Text>
                    <TextInput
                      className={`auth-input ${error || errors?.fields?.password ? "auth-input-error" : ""}`}
                      value={password}
                      placeholder="Create a password"
                      placeholderTextColor="#999"
                      secureTextEntry
                      onChangeText={setPassword}
                      returnKeyType="done"
                      onSubmitEditing={onSignUpPress}
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
                    onPress={onSignUpPress}
                    disabled={!emailAddress || !password || loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text className="auth-button-text">Sign up</Text>
                    )}
                  </Pressable>

                  {/* ── Footer link ── */}
                  <View className="auth-link-row">
                    <Text className="auth-link-copy">Already have an account?</Text>
                    <Link href="/(auth)/sign-in" asChild>
                      <Pressable>
                        <Text className="auth-link">Sign in</Text>
                      </Pressable>
                    </Link>
                  </View>
                </View>
              </View>
            </>
          ) : (
            <>
              {/* ── Verify headline ── */}
              <View className="items-center mb-6">
                <Text className="auth-title">Verify your email</Text>
                <Text className="auth-subtitle">
                  We sent a verification code to {emailAddress}
                </Text>
              </View>

              {/* ── Verify card ── */}
              <View className="auth-card">
                <View className="auth-form">
                  <View className="auth-field">
                    <Text className="auth-label">Verification Code</Text>
                    <TextInput
                      className={`auth-input ${error || errors?.fields?.code ? "auth-input-error" : ""}`}
                      value={code}
                      placeholder="Enter the 6-digit code"
                      placeholderTextColor="#999"
                      onChangeText={setCode}
                      keyboardType="numeric"
                      returnKeyType="done"
                      onSubmitEditing={onPressVerify}
                    />
                    {errors?.fields?.code && (
                      <Text className="auth-error">{errors.fields.code.message}</Text>
                    )}
                  </View>

                  {error ? (
                    <Text className="auth-error">{error}</Text>
                  ) : null}

                  <Pressable
                    className={`auth-button ${!code || loading ? "auth-button-disabled" : ""
                      }`}
                    onPress={onPressVerify}
                    disabled={!code || loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text className="auth-button-text">Verify email</Text>
                    )}
                  </Pressable>

                  <Pressable
                    className="auth-secondary-button"
                    onPress={() => signUp.verifications.sendEmailCode()}
                  >
                    <Text className="auth-secondary-button-text">
                      Resend code
                    </Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
