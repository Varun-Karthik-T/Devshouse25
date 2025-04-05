import React, { useState, useEffect  } from "react";
import axios from "axios";
import { ScrollView, Image , Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";


const ViewGoals = () => {
  const [walletAmount] = useState(10000); // Hardcoded wallet balance
  const [distributedGoals, setDistributedGoals] = useState<
    { goal_id: string; targetName: string; goalCost: number; goalMonths: number; monthlyContribution: number; savings: number; image?: string }[]
  >([]); // Goals after distribution
  const [goals, setGoals] = useState<
    { goal_id: string; targetName: string; goalCost: number; goalMonths: number; savings: number; monthlyContribution: number; image?: string }[]
  >([]);

  useEffect(() => {
    const fetchGoalsFromDB = async () => {
      try {
        const response = await axios.get("http://192.168.134.213:8000/api/goals/user123");
        const fetchedGoals = response.data.goals.map((goal: any) => ({
          goal_id: goal.goal_id,
          targetName: goal.goal_name,
          goalCost: goal.goal_cost,
          goalMonths: goal.total_months,
          savings: goal.savings,
          monthlyContribution: goal.monthly_requirement,
        }));

        const updatedGoals = await Promise.all(
          fetchedGoals.map(async (goal) => {
            const image = await fetchImage(goal.targetName); // Fetch image for the goal
            return { ...goal, image }; // Add the image URL to the goal
          })
        );

        setGoals(updatedGoals);
      } catch (error) {
        console.error("Error fetching goals from DB:", error);
      }
    };

    fetchGoalsFromDB();
  }, []);

  useEffect(() => {
    fetchImagesForGoals(); // Fetch images for goals
  }, []);
  
  useEffect(() => {
    distributeWallet(); // Recalculate distributedGoals whenever goals are updated
  }, [goals]); // Add goals as a dependency

  useEffect(() => {
    checkForDisintegration(); // Check for disintegration after wallet distribution
  }, [distributedGoals]);

  // Function to check for disintegration and alert the user
  const checkForDisintegration = () => {
    distributedGoals.forEach((goal) => {
      if (goal.savings < goal.monthlyContribution * 0.5) {
        // If savings are less than 50% of the required monthly contribution
        Alert.alert(
          "Save Now or Forget It Forever!",
          `Your goal "${goal.targetName}" is falling apart. Without more savings, it might never be achieved. Act now before it's too late!`,
          [{ text: "OK" }]
        );
      }
    });
  };

  // Function to fetch images for each goal based on the targetName
  const fetchImagesForGoals = async () => {
    const updatedGoals = await Promise.all(
      goals.map(async (goal) => {
        if (!goal.image) {
          const image = await fetchImage(goal.targetName); // Fetch image for the goal
          return { ...goal, image }; // Add the image URL to the goal
        }
        return goal; // If the image already exists, return the goal as is
      })
    );
    setGoals(updatedGoals); // Update the goals state with the fetched images
  };

  // Function to fetch a single image from Unsplash API
  const fetchImage = async (query: string) => {
    try {
      const response = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          query,
          per_page: 1,
          w: 400, 
        },
        headers: {
          Authorization: `Client-ID ${process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        },
      });
      return response.data.results[0]?.urls?.small || null; 
    } catch (error) {
      console.error(`Error fetching image for ${query}:`, error);
      return null;
    }
  };

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
      finalGoals.forEach((goal) => {
        updateSavingsInBackend(goal.goal_id, goal.savings);
      });
      
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
      finalGoals.forEach((goal) => {
        updateSavingsInBackend(goal.goal_id, goal.savings);
      });
    } else {
      setDistributedGoals(updatedGoals);
      updatedGoals.forEach((goal) => {
        updateSavingsInBackend(goal.goal_id, goal.savings);
      });
    }
  };

  const updateSavingsInBackend = async (goalId: string, savings: number) => {
    try {
      const response = await axios.patch("http://192.168.134.213:8000/api/goals/update-savings", {
        goal_id: goalId,
        savings: savings,
      });
      console.log(`Savings updated for goal ${goalId}:`, response.data);
    } catch (error) {
      console.error(`Error updating savings for goal ${goalId}:`, error);
    }
  };

  const calculateProgress = (goal: { targetName?: string; goalCost: any; goalMonths?: number; monthlyContribution?: number; savings: any; image?: string | undefined; }) =>
    goal.savings ? Math.min((goal.savings / goal.goalCost) * 100, 100) : 0;

  const renderProgressLines = (goalMonths: number) => {
    const lines = [];
    for (let i = 1; i <= goalMonths; i++) {
      lines.push(
        <Box
          key={i}
          className="absolute h-full border-l border-gray-500"
          style={{
            left: `${(i / goalMonths) * 100}%`,
          }}
        />
      );
    }
    return lines;
  };

  const removeGoal = async (goalId: string, goalName: string) => {
  try {
    // Call the backend to delete the goal
    await axios.delete(`http://192.168.134.213:8000/api/goals/${goalId}`);

    // Remove the goal from the local state
    const updatedGoals = goals.filter((goal) => goal.goal_id !== goalId);
    setGoals(updatedGoals);

    // Show a fun message
    Alert.alert("Goodbye!", `Bye bye "${goalName}", you deserve a better owner!`);
  } catch (error) {
    console.error(`Error removing goal ${goalId}:`, error);
    Alert.alert("Error", "Failed to remove the goal. Please try again.");
  }
};


  const renderDisintegration = (disintegrationPercentage: number) => {
    const numRows = 10; // Number of rows in the grid
    const numCols = Math.ceil(disintegrationPercentage * 10); // Number of columns based on disintegration percentage
    const squareSize = 10; // Size of each square in percentage (relative to the image size)
    const squares = [];
  
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        // Add randomness to the position and opacity of the squares
        squares.push(
          <Box
            key={`${row}-${col}`}
            className="absolute bg-background"
            style={{
              width: `${squareSize}%`, // Fixed width for each square
              height: `${squareSize}%`, // Fixed height for each square
              right: `${col * squareSize + Math.random() }%`, // Add randomness to horizontal position
              top: `${row * squareSize + Math.random() * 5}%`, // Add randomness to vertical position
              
              transform: `rotate(${Math.random() * 20 - 10}deg)`, // Add slight rotation for chaos
            }}
          />
        );
      }
    }
  
    return squares;
  };

  

  return (
    <ScrollView className="flex-1">
      <VStack space="xl" className="items-center flex-1">
        
        <Text className="text-white text-lg">{`Total Money in Wallet: ${walletAmount.toFixed(
          2
        )}`}</Text>
        {distributedGoals.map((goal, index) => (
          <VStack key={index} space="lg" className="items-center w-4/5">
          <Box className="w-64 h-64 bg-secondary rounded-lg overflow-hidden relative">
  {goal.image ? (
    <>
      
      <Image
      source={{ uri: goal.image }}
      //zoom out the image to fit the box
      resizeMode="cover"
    
      className="absolute w-64 h-64 rounded-lg"
      />

     
      {goal.savings < goal.monthlyContribution && (
      <LinearGradient
        colors={[
          'rgba(0, 0, 0, 0)',
          `rgba(0, 0, 0, ${(goal.monthlyContribution - goal.savings)})`,
        ]}
        start={{ x: 0 , y: 0 }} 
    end={{ x: 1, y: 0 }} 
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: 8,
        }}
      />
      )}
    </>
  ) : (
    <Text className="text-white">Loading Image...</Text>
  )}
</Box>
          <Text className="text-primary text-2xl font-bold">{goal.targetName}</Text>
          <Center className="w-full relative">
            <Progress
              value={calculateProgress(goal)}
              size="lg"
              orientation="horizontal"
              className="bg-gray-700 relative"
            >
              {renderProgressLines(goal.goalMonths)}
              <ProgressFilledTrack className="bg-accent" />
            </Progress>
          </Center>
          <Text className="text-white text-lg">
            {`Savings: ${goal.savings?.toFixed(2) || "0.00"} / ${goal.goalCost?.toFixed(2) || "0.00"}`}
          </Text>
          <Text className="text-accent text-md">
            {`Monthly Contribution: ${goal.monthlyContribution?.toFixed(2) || "0.00"}`}
          </Text>
          <Button
            onPress={() => removeGoal(goal.goal_id, goal.targetName)}
            className="bg-red-500 mt-4"
          >
            <ButtonText className="text-white">Remove Goal</ButtonText>
          </Button>
        </VStack>
        ))}
      </VStack>
    </ScrollView>
  );
};

export default ViewGoals;