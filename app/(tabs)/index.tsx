import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import dayjs from "dayjs";

import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import "@/global.css";
import { formatCurrency } from "@/lib/utils";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView)

export default function App() {

  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [subscriptions, setSubscriptions] = useState(HOME_SUBSCRIPTIONS);

  const handleCreateSubscription = (newSubscription: Subscription) => {
    // Mutate the original array so it reflects in the subscriptions tab as well
    HOME_SUBSCRIPTIONS.unshift(newSubscription);
    // Update local state to trigger a re-render here
    setSubscriptions([...HOME_SUBSCRIPTIONS]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">




      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image source={images.avatar} className="home-avatar" />
                <Text className="home-user-name">{HOME_USER.name}</Text>
              </View>

              <Pressable onPress={() => setIsModalVisible(true)}>
                <Image source={icons.add} className="home-add-icon" />
              </Pressable>

            </View>


            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>
              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MMM DD, YYYY")}
                </Text>

              </View>

            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" />
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => <UpcomingSubscriptionCard data={item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-2"
                ListEmptyComponent={<Text className="home-empty-state">No Upcoming renewls yet</Text>}

              />
            </View>
            <ListHeading title="All Subscriptions" />
          </>
        )}
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SubscriptionCard {...item}
          expanded={expandedSubscriptionId === item.id}
          onPress={() => setExpandedSubscriptionId(currentId => currentId === item.id ? null : item.id)}
        />}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-30"
        ListEmptyComponent={<Text className="home-empty-state">No Subscriptions yet</Text>}
      />


      <CreateSubscriptionModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onCreate={handleCreateSubscription}
      />

    </SafeAreaView>
  );
}
