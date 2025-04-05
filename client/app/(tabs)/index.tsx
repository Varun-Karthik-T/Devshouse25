import React, { useState } from "react";
import { Alert } from "react-native"; // Import Alert
import { useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import Axios from "axios";
import { api } from "@/api";

export default function GoalScreen() {
  const router = useRouter();

  const userId = "user123"; // Simulated user ID
  const [targetName, setTargetName] = useState(""); // Target name
  const [goalCost, setGoalCost] = useState<number | null>(null); // Goal cost
  const [totalMonths, setTotalMonths] = useState<number | null>(null); // Total months to achieve the goal

  const handleSetGoal = async () => {
    if (targetName && goalCost && totalMonths) {
      const monthlyContribution = goalCost / totalMonths;

      const newGoal = {
        user_id: userId, // Include user ID
        goal_name: targetName,
        goal_cost: goalCost,
        total_months: totalMonths,
        monthly_requirement: monthlyContribution,
        savings: 0,
        status: "notmet",
      };

      console.log("New Goal Data:", newGoal); // Log the goal data

      try {
        // Send the goal to the backend
        const response = await api.post("/api/goals", newGoal); // Corrected backend URL
        console.log("Goal added successfully:", response.data);

        // Show success alert
        Alert.alert(
          "Goal Submitted",
          "Better start saving! See you at the month-end.",
          [{ text: "OK" }]
        );

        // Reset input fields
        setTargetName("");
        setGoalCost(null);
        setTotalMonths(null);
      } catch (error: unknown) {
        console.error("Error adding goal:", error); // Log the error
        if (Axios.isAxiosError(error) && error.response) {
          console.log("Response Data:", error.response.data); // Log response data if available
          console.log("Response Status:", error.response.status); // Log response status
          console.log("Response Headers:", error.response.headers); // Log response headers
        } else if (Axios.isAxiosError(error) && error.request) {
          console.log("Request Data:", error.request); // Log request data if no response
        } else if (error instanceof Error) {
          console.log("Error Message:", error.message); // Log general error message
        }
      }
    } else {
      console.error("Please fill in all fields before submitting.");
    }
  };

  const handleViewGoals = () => {
    // Navigate to the View Goals page
    router.push("/ViewGoals");
  };

  return (
    <Box className="flex-1 bg-background p-6">
      <Center className="flex-1">
        <VStack space="xl" className="items-center w-4/5">
          <Text className="text-primary text-2xl font-bold">Set Your Goal</Text>
          <Input variant="outline" size="lg" className="w-full border border-accent rounded-lg">
            <InputField
              placeholder="Target Name"
              value={targetName}
              onChangeText={setTargetName}
              className="placeholder:text-gray-400 text-white"
            />
          </Input>
          <Input variant="outline" size="lg" className="w-full border border-accent rounded-lg">
            <InputField
              placeholder="Goal Cost"
              keyboardType="numeric"
              value={goalCost ? goalCost.toString() : ""}
              onChangeText={(value) => setGoalCost(Number(value))}
              className="placeholder:text-gray-400 text-white"
            />
          </Input>
          <Input variant="outline" size="lg" className="w-full border border-accent rounded-lg">
            <InputField
              placeholder="Total Months"
              keyboardType="numeric"
              value={totalMonths ? totalMonths.toString() : ""}
              onChangeText={(value) => setTotalMonths(Number(value))}
              className="placeholder:text-gray-400 text-white"
            />
          </Input>
          <Button
            size="lg"
            variant="solid"
            action="primary"
            className="w-full bg-primary rounded-lg"
            onPress={handleSetGoal}
          >
            <ButtonText className="text-background text-lg font-semibold">Set Goal</ButtonText>
          </Button>
          <Button
            size="lg"
            variant="outline"
            action="secondary"
            className="w-full rounded-lg mt-4"
            onPress={handleViewGoals}
          >
            <ButtonText className="text-primary">View Goals</ButtonText>
          </Button>
        </VStack>
      </Center>
    </Box>
  );
}