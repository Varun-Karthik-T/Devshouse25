import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";

export default function GoalScreen() {
  const router = useRouter();

  const initialWallet = 5000; // Simulate fetching wallet money from the database
  const initialGoals = [
    {
      targetName: "Buy a Car",
      goalCost: 120000,
      totalMonths: 12,
      monthlyContribution: 10000,
      savings: 0,
      missedMonths: 0, // Track missed months
    },
    {
      targetName: "Vacation",
      goalCost: 60000,
      totalMonths: 6,
      monthlyContribution: 10000,
      savings: 0,
      missedMonths: 0, // Track missed months
    },
  ];

  const [walletAmount, setWalletAmount] = useState(initialWallet); // Wallet money
  const [goals, setGoals] = useState(initialGoals); // Goals array
  const [targetName, setTargetName] = useState(""); // Target name
  const [goalCost, setGoalCost] = useState<number | null>(null); // Goal cost
  const [totalMonths, setTotalMonths] = useState<number | null>(null); // Total months to achieve the goal

  useEffect(() => {
    redistributeWalletAmount();
  }, []);

  const calculateProgress = (goal: any) =>
    goal.savings ? Math.min((goal.savings / goal.goalCost) * 100, 100) : 0;

  const handleSetGoal = () => {
    if (targetName && goalCost && totalMonths) {
      const monthlyContribution = goalCost / totalMonths;

      const newGoal = {
        targetName,
        goalCost,
        totalMonths,
        monthlyContribution,
        savings: 0,
        missedMonths: 0,
      };

      setGoals((prevGoals) => [...prevGoals, newGoal]);
      setTargetName("");
      setGoalCost(null);
      setTotalMonths(null);

      // Redistribute wallet after adding a new goal
      redistributeWalletAmount([...goals, newGoal]);
    }
  };

  const redistributeWalletAmount = (updatedGoals = goals) => {
    let remainingWallet = walletAmount; // Use a copy of the wallet amount

    // Filter goals that still need savings
    const goalsNeedingSavings = updatedGoals.filter(
      (goal) => goal.savings < goal.goalCost
    );

    const redistributedGoals = updatedGoals.map((goal) => {
      if (remainingWallet <= 0 || goal.savings >= goal.goalCost) {
        return goal; // Skip if no wallet left or goal is already fulfilled
      }

      // Calculate the equal share for this goal
      const equalShare = Math.min(
        remainingWallet / goalsNeedingSavings.length,
        goal.goalCost - goal.savings
      );

      // Deduct the distributed amount from the remaining wallet (local copy)
      remainingWallet -= equalShare;

      return {
        ...goal,
        savings: goal.savings + equalShare, // Update savings
      };
    });

    // Update the state with the redistributed goals
    setGoals(redistributedGoals);
  };

  const handleViewGoals = () => {
    // Navigate to the ViewGoals page and pass data via query parameters
    router.push({
      pathname: "/ViewGoals",
      //remove topbar
      //remove bottom tab bar



      params: {
        goals: JSON.stringify(goals),
        walletAmount: walletAmount.toString(),
        initialWallet: initialWallet.toString(),
      },
    });
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