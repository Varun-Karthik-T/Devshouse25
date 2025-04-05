import {
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { SendHorizontal } from "lucide-react-native";
const Chat = () => {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "This is a bot response.", sender: "bot" },
        ]);
      }, 1000);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View className="flex-1 bg-black">
        <ScrollView contentContainerStyle={{ padding: 16 }} className="flex-1">
          {messages.map((message, index) => (
            <HStack
              key={index}
              className={`mb-4 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <Box
                className={`p-4 rounded-lg ${
                  message.sender === "user" ? "bg-secondary" : "bg-primary"
                }`}
              >
                <Text
                  className={`${
                    message.sender === "user" ? "text-white" : "text-black"
                  }`}
                >
                  {message.text}
                </Text>
              </Box>
            </HStack>
          ))}
        </ScrollView>
        <HStack className="p-4 bg-black items-center">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor="#888"
            className="flex-1 bg-secondary text-white p-4 rounded-lg mr-2"
          />
          <Pressable onPress={handleSend}>
            <Icon as={SendHorizontal} className="text-primary" />
          </Pressable>
        </HStack>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;
