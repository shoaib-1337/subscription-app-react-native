import SubscriptionCard from '@/components/SubscriptionCard';
import { HOME_SUBSCRIPTIONS } from '@/constants/data';
import { styled } from "nativewind";
import React, { useState } from 'react';
import { FlatList, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);

const subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

  const filteredSubscriptions = HOME_SUBSCRIPTIONS.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sub.category && sub.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View className="mb-6 mt-4">
          <Text className="text-2xl font-sans-bold text-black mb-4">Subscriptions</Text>
          <TextInput
            className="bg-card text-black p-4 rounded-xl border border-gray-800"
            placeholder="Search subscriptions..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          data={filteredSubscriptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SubscriptionCard
              {...item}
              expanded={expandedSubscriptionId === item.id}
              onPress={() => setExpandedSubscriptionId(currentId => currentId === item.id ? null : item.id)}
            />
          )}
          extraData={expandedSubscriptionId}
          ItemSeparatorComponent={() => <View className="h-4" />}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-30"
          ListEmptyComponent={<Text className="text-gray-400 text-center mt-10">No matching subscriptions found</Text>}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default subscriptions