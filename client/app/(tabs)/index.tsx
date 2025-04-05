import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Box, ScrollView, Image, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import axios from "axios";

export default function GoalScreen() {
  const router = useRouter();

  const [targetName, setTargetName] = useState(""); // Target name
  const [goalCost, setGoalCost] = useState<number | null>(null); // Goal cost
  const [totalMonths, setTotalMonths] = useState<number | null>(null); // Total months to achieve the goal
  const [imageResults, setImageResults] = useState([]); // Image search results
  const [selectedImage, setSelectedImage] = useState(""); // Selected image URL

  const handleSearchImages = async () => {
    if (!targetName) {
      alert("Please enter a target name to search for images.");
      return;
    }

    try {
      const response = await axios.get("https://api.unsplash.com/search/photos", {
        params: {
          query: targetName,
          per_page: 10,
        },
        headers: {
          Authorization: `Client-ID YOUR_UNSPLASH_ACCESS_KEY`, 
      });
      setImageResults(response.data.results);
    } catch (error) {
      console.error("Error fetching images:", error);
      alert("Failed to fetch images. Please try again.");
    }
  };

  const handleSetGoal = () => {
    if (targetName && goalCost && totalMonths && selectedImage) {
      const newGoal = {
        targetName,
        goalCost,
        totalMonths,
        imageUrl: selectedImage, // Add the selected image URL to the goal
      };

      // Save the goal to the database or pass it to the next screen
      console.log("New Goal:", newGoal);

      // Reset the form fields
      setTargetName("");
      setGoalCost(null);
      setTotalMonths(null);
      setImageResults([]);
      setSelectedImage("");

      // Navigate to the ViewGoals page
      router.push("/ViewGoals");
    } else {
      alert("Please fill in all fields and select an image.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-background p-6">
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
            onPress={handleSearchImages}
          >
            <ButtonText className="text-background text-lg font-semibold">Search Images</ButtonText>
          </Button>
          {imageResults.length > 0 && (
            <VStack space="md" className="w-full">
              <Text className="text-primary text-lg font-bold">Select an Image</Text>
              <ScrollView horizontal>
                {imageResults.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedImage(image.urls.small)}
                    style={{
                      borderWidth: selectedImage === image.urls.small ? 2 : 0,
                      borderColor: "blue",
                      marginRight: 10,
                    }}
                  >
                    <Image
                      source={{ uri: image.urls.small }}
                      style={{ width: 100, height: 100, borderRadius: 10 }}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </VStack>
          )}
          <Button
            size="lg"
            variant="solid"
            action="primary"
            className="w-full bg-primary rounded-lg"
            onPress={handleSetGoal}
          >
            <ButtonText className="text-background text-lg font-semibold">Set Goal</ButtonText>
          </Button>
        </VStack>
      </Center>
    </ScrollView>
  );
}