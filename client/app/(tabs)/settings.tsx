import React, { useState } from "react";
import { ScrollView } from "react-native"; // Import ScrollView
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Switch } from "@/components/ui/switch";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import colors from "tailwindcss/colors";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient

export default function SettingsScreen() {
  const [isRoundOffEnabled, setRoundOffEnabled] = useState(false);
  const [isPercentageEnabled, setPercentageEnabled] = useState(false);
  const [isFixedAmountEnabled, setFixedAmountEnabled] = useState(false);
  const [fixedAmount, setFixedAmount] = useState<number | null>(null);

  return (
    <Box className="flex-1 bg-background">
      
     
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <VStack space="lg">
          
        <Box className=" flex-1 bg-background items-center justify-center mt-10 sticky ">
            <Text className="text-primary text-4xl font-bold">Settings</Text>
          </Box>
          <Box className="border-accent border p-6 rounded-lg w-11/12 self-center">
            <Text className="text-primary  text-xl font-semibold mb-4">Roundoff</Text>
            <Text className="text-gray-400  text-md mb-4">
              Every time you pay, the amount will be rounded off to the nearest value and used for investing.
            </Text>
            <Box className="flex-row items-center justify-between">
              <Text className="text-gray-400 text-md">Enable Roundoff</Text>
              <Switch
                size="lg"
                isDisabled={false}
                trackColor={{ false: colors.neutral[300], true: colors.neutral[600] }}
                thumbColor={colors.neutral[50]}
                ios_backgroundColor={colors.neutral[300]}
                value={isRoundOffEnabled}
                onValueChange={setRoundOffEnabled}
              />
            </Box>
          </Box>

          {/* Percentage-Based Box */}
          <Box className="border-accent border p-6 rounded-lg w-11/12 self-center ">
            <Text className="text-primary text-xl font-semibold mb-4">Percentage-Based</Text>
            <Text className="text-gray-400 text-md mb-4">
              A fixed percentage of the amount will be pushed to achieve your goals.
            </Text>
            <Box className="flex-row items-center justify-between">
              <Text className="text-gray-400 text-md">Enable Percentage</Text>
              <Switch
                size="lg"
                isDisabled={false}
                trackColor={{ false: colors.neutral[300], true: colors.neutral[600] }}
                thumbColor={colors.neutral[50]}
                ios_backgroundColor={colors.neutral[300]}
                value={isPercentageEnabled}
                onValueChange={setPercentageEnabled}
              />
            </Box>
          </Box>

          {/* Fixed Amount-Based Box */}
          <Box className="border-accent border p-6 rounded-lg w-11/12 self-center">
            <Text className="text-primary text-xl font-semibold mb-4">Fixed Amount-Based</Text>
            <Text className="text-gray-400 text-md mb-4">
              Every time you pay, a fixed amount will be moved to achieve your goals.
            </Text>
            <Input
              variant="outline"
              size="lg"
              className={`w-full border border-accent rounded-lg ${
                !isFixedAmountEnabled ? "opacity-50" : ""
              }`}
              isDisabled={!isFixedAmountEnabled}
            >
              <InputField
                placeholder="Enter Fixed Amount"
                keyboardType="numeric"
                value={fixedAmount ? fixedAmount.toString() : ""}
                onChangeText={(value) => setFixedAmount(Number(value))}
                className="placeholder:text-gray-400 text-white"
              />
            </Input>
            <Box className="flex-row items-center justify-between mt-4">
              <Text className="text-gray-400 text-md">Enable Fixed Amount</Text>
              <Switch
                size="lg"
                isDisabled={false}
                trackColor={{ false: colors.neutral[300], true: colors.neutral[600] }}
                thumbColor={colors.neutral[50]}
                ios_backgroundColor={colors.neutral[300]}
                value={isFixedAmountEnabled}
                onValueChange={setFixedAmountEnabled}
              />
            </Box>
          </Box>

          {/* Account Balance Card */}
          <Box className=" p-6 rounded-lg w-11/12 self-center">
            <Text className="text-primary text-3xl font-semibold mb-4">Account Balance</Text>
            <Text className="text-text text-7xl font-bold">₹25,000</Text>
          </Box>

          {/* Wallet Balance Section */}
          <Box className="w-11/12 self-center rounded-lg overflow-hidden">
  <LinearGradient
    colors={["#37a0f6", "#165c95"]} // Gradient colors (bottom to top)
    start={{ x: 0.5, y: 1 }} // Start from bottom
    end={{ x: 0.5, y: 0 }} // End at top
    style={{ flex: 1, padding: 24, borderRadius: 12 }}
  >
    <Text className="text-primary text-3xl font-semibold mb-4">Wallet Balance</Text>
    <Box className="flex-1">
      <Box className="bg-gray-800 p-4 rounded-lg mb-4 drop-shadow-2xl">
        <Text className="text-gray-400 text-md">Amount Used for Goals</Text>
        <Text className="text-white text-xl font-bold">₹10,000</Text>
      </Box>
      <Box className="bg-gray-800 p-4 rounded-lg">
        <Text className="text-gray-400 text-md">Amount Used for Stocks</Text>
        <Text className="text-white text-xl font-bold">₹5,000</Text>
      </Box>
    </Box>
  </LinearGradient>
</Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}