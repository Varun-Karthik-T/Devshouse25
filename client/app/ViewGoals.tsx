import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";

const ViewGoals = () => {
  const [walletAmount, setWalletAmount] = useState(10000); // Hardcoded wallet balance
  const [distributedGoals, setDistributedGoals] = useState([]); // Goals after distribution
  const [goals, setGoals] = useState([
    /* { targetName: "Goal 1", goalCost: 11000, monthlyContribution: 11000, savings: 0 },
    { targetName: "Goal 2", goalCost: 12000, monthlyContribution: 12000, savings: 0 },
    { targetName: "Goal 3", goalCost: 25000, monthlyContribution: 30000, savings: 0 } */
     /* { targetName: "Goal 1", goalCost: 11000, monthlyContribution: 11000, savings: 0 },
    { targetName: "Goal 2", goalCost: 12000, monthlyContribution: 12000, savings: 0 },
    { targetName: "Goal 3", goalCost: 25000, monthlyContribution: 2500, savings: 0 },  */
    /* { targetName: "Goal 1", goalCost: 11000, monthlyContribution: 1000, savings: 0 },
  { targetName: "Goal 2", goalCost: 12000, monthlyContribution: 2000, savings: 0 },
  { targetName: "Goal 3", goalCost: 25000, monthlyContribution: 3000, savings: 0 }, */

  /* { targetName: "Goal 1", goalCost: 11000, monthlyContribution: 10000, savings: 0 }, */


  { targetName: "Goal 1", goalCost: 11000, monthlyContribution: 11000, savings: 0 },
  { targetName: "Goal 2", goalCost: 12000, monthlyContribution: 12000, savings: 0 },
  { targetName: "Goal 3", goalCost: 25000, monthlyContribution: 2500, savings: 0 },
  ]);

  useEffect(() => {
    distributeWallet();
  }, []);

  const distributeWallet = () => {
    let remainingWallet = walletAmount;
  
    // First pass: Satisfy the minimum monthly contribution for each goal
    const updatedGoals = goals.map((goal) => {
      if (remainingWallet >= goal.monthlyContribution) {
        const allocated = goal.monthlyContribution;
        remainingWallet -= allocated;
        return { ...goal, savings: allocated };
      } else {
        const allocated = remainingWallet;
        remainingWallet = 0;
        return { ...goal, savings: allocated };
      }
    });
  
    // Check if only the first goal exists and is fully satisfied
    if (goals.length === 1 && updatedGoals[0].savings === updatedGoals[0].monthlyContribution) {
      setDistributedGoals(updatedGoals);
      return;
    }
  
    // If there are multiple goals and the wallet is used up by the first goal
    if (remainingWallet === 0 && updatedGoals[0].savings === walletAmount) {
      const evenShare = walletAmount / goals.length;
  
      const finalGoals = goals.map((goal) => ({
        ...goal,
        savings: evenShare,
      }));
  
      setDistributedGoals(finalGoals);
      return;
    }
  
    // Second pass: Evenly distribute the remaining wallet across all goals
    if (remainingWallet > 0) {
      const evenShare = remainingWallet / goals.length;
  
      const finalGoals = updatedGoals.map((goal) => ({
        ...goal,
        savings: goal.savings + evenShare,
      }));
  
      setDistributedGoals(finalGoals);
    } else {
      setDistributedGoals(updatedGoals);
    }
  };
  const calculateProgress = (goal: any) =>
    goal.savings ? Math.min((goal.savings / goal.goalCost) * 100, 100) : 0;

  const renderProgressLines = (monthlyContribution: number) => {
    const lines = [];
    for (let i = 1; i <= 10; i++) {
      lines.push(
        <Box
          key={i}
          className="absolute h-full border-l border-gray-500"
          style={{
            left: `${(i / 10) * 100}%`,
          }}
        />
      );
    }
    return lines;
  };

  return (
    <ScrollView className="flex-1">
      <VStack space="xl" className="items-center flex-1">
        <HStack className="w-full justify-between px-4">
          <Button
            size="md"
            variant="outline"
            action="secondary"
            className="rounded-lg"
            onPress={() => console.log("Navigate back")} // Replace with navigation logic
          >
            <ButtonText className="text-primary">Back</ButtonText>
          </Button>
        </HStack>
        <Text className="text-white text-lg">{`Total Money in Wallet: ${walletAmount.toFixed(
          2
        )}`}</Text>
        {distributedGoals.map((goal: any, index: number) => (
          <VStack key={index} space="lg" className="items-center w-4/5">
            <Box className="w-40 h-40 bg-secondary rounded-lg" />
            <Text className="text-primary text-2xl font-bold">{goal.targetName}</Text>
            <Center className="w-full relative">
              <Progress
                value={calculateProgress(goal)}
                size="lg"
                orientation="horizontal"
                className="bg-gray-700 relative"
              >
                {renderProgressLines(goal.monthlyContribution)}
                <ProgressFilledTrack className="bg-accent" />
              </Progress>
            </Center>
            <Text className="text-white text-lg">
              {`Savings: ${goal.savings?.toFixed(2) || "0.00"} / ${goal.goalCost?.toFixed(2) || "0.00"}`}
            </Text>
            <Text className="text-accent text-md">
              {`Monthly Contribution: ${goal.monthlyContribution?.toFixed(2) || "0.00"}`}
            </Text>
          </VStack>
        ))}
      </VStack>
    </ScrollView>
  );
};

export default ViewGoals;