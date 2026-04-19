import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { icons } from '@/constants/icons';

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
}

const CATEGORIES = [
  "Entertainment", "AI Tools", "Developer Tools", "Design", 
  "Productivity", "Cloud", "Music", "Other"
];

const CATEGORY_COLORS: Record<string, string> = {
  "Entertainment": "#f5c542",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  "Design": "#b8e8d0",
  "Productivity": "#f5a6c4",
  "Cloud": "#a9c2f0",
  "Music": "#f0b4a8",
  "Other": "#d1d5db"
};

const CreateSubscriptionModal = ({ visible, onClose, onCreate }: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [category, setCategory] = useState("Other");

  const isFormValid = name.trim().length > 0 && !isNaN(Number(price)) && Number(price) > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;

    const startDate = dayjs().toISOString();
    const renewalDate = dayjs().add(1, frequency === "Monthly" ? 'month' : 'year').toISOString();

    const newSubscription: Subscription = {
      id: Date.now().toString(),
      name: name.trim(),
      price: Number(price),
      currency: "USD",
      billing: frequency,
      category,
      status: "active",
      startDate,
      renewalDate,
      icon: icons.wallet,
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS["Other"]
    };

    onCreate(newSubscription);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Other");
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="modal-overlay">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <View className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable onPress={() => { resetForm(); onClose(); }} className="modal-close">
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            <ScrollView className="modal-body" contentContainerClassName="pb-10" showsVerticalScrollIndicator={false}>
              
              <View className="auth-field mb-4">
                <Text className="auth-label">Name</Text>
                <TextInput
                  className="auth-input"
                  placeholder="e.g. Netflix"
                  placeholderTextColor="#9ca3af"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View className="auth-field mb-4">
                <Text className="auth-label">Price</Text>
                <TextInput
                  className="auth-input"
                  placeholder="0.00"
                  placeholderTextColor="#9ca3af"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>

              <View className="auth-field mb-4">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  <Pressable 
                    onPress={() => setFrequency("Monthly")}
                    className={clsx("picker-option", frequency === "Monthly" && "picker-option-active")}
                  >
                    <Text className={clsx("picker-option-text", frequency === "Monthly" && "picker-option-text-active")}>Monthly</Text>
                  </Pressable>
                  <Pressable 
                    onPress={() => setFrequency("Yearly")}
                    className={clsx("picker-option", frequency === "Yearly" && "picker-option-active")}
                  >
                    <Text className={clsx("picker-option-text", frequency === "Yearly" && "picker-option-text-active")}>Yearly</Text>
                  </Pressable>
                </View>
              </View>

              <View className="auth-field mb-6">
                <Text className="auth-label mb-2">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={clsx("category-chip", category === cat && "category-chip-active")}
                    >
                      <Text className={clsx("category-chip-text", category === cat && "category-chip-text-active")}>{cat}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable 
                onPress={handleSubmit}
                disabled={!isFormValid}
                className={clsx("auth-button", !isFormValid && "auth-button-disabled")}
              >
                <Text className="auth-button-text">Create Subscription</Text>
              </Pressable>

            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CreateSubscriptionModal;
