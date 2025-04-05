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
import { api } from "@/api";

const Chat = () => {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      const userMessage = input;
      setInput("");
      try {
        const requestBody = { user_prompt: userMessage }; // Updated field name
        console.log("Request Body:", requestBody); // Debugging: Print the request body
        const response = await api.post(
          "/chat/user123",
          requestBody,
          { headers: { "Content-Type": "application/json" } } // Explicitly set Content-Type
        );
        const botResponse = response.data?.response || "No response from bot.";
        setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [
          ...prev,
          { text: "Failed to get a response from the bot.", sender: "bot" },
        ]);
      }
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
