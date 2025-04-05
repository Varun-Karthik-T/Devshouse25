import { View, ScrollView } from "react-native";
import { useState } from "react";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Dropdown from "@/components/Dropdown";
import { dummy, weeks } from "@/constants/dummyData";

const Analyze = () => {
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const selectedWeekData = dummy.find((data) => data.week_id === selectedWeek);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
      <View className="flex-1 items-center gap-4">
        <View className="flex flex-row items-center justify-between w-full">
          <Heading bold size="2xl" className="flex-1 mr-2">
            Your week in focus
          </Heading>
          <Dropdown
            options={weeks.map((week) => ({
              label: `${week.weekStart} - ${week.weekEnd}`,
              value: week.week_id.toString(),
            }))}
            placeholder="Select a week"
            onValueChange={(value) => setSelectedWeek(Number(value))}
            className="flex-1 ml-2"
          />
        </View>
        {selectedWeekData && (
          <>
            <View className="flex flex-col w-3/4 gap-2">
              <Badge
                size="lg"
                variant="outline"
                className="border-accent rounded-md gap-2 items-center py-2 flex flex-col"
              >
                <View className="flex flex-row justify-between gap-2 w-full">
                  <Text className="text-accent gap-2 flex flex-row items-center">
                    <MaterialCommunityIcons
                      name="cash-minus"
                      size={24}
                      className="text-accent"
                    />
                    Total amount spent
                  </Text>
                  <Text className="text-accent">
                    ₹{selectedWeekData.totalSpent}
                  </Text>
                </View>
              </Badge>
              <Badge
                size="lg"
                variant="outline"
                className="border-accent rounded-md gap-2 items-center py-2 flex flex-col"
              >
                <View className="flex flex-row justify-between gap-2 w-full">
                  <Text className="text-accent gap-2 flex flex-row items-center">
                    <MaterialCommunityIcons
                      name="cash-plus"
                      size={24}
                      className="text-accent"
                    />
                    Total savings
                  </Text>
                  <Text className="text-accent">
                    ₹{selectedWeekData.totalSavings}
                  </Text>
                </View>
              </Badge>
              <Badge
                size="lg"
                variant="outline"
                className="border-accent rounded-md gap-2 items-center py-2 flex flex-col"
              >
                <View className="flex flex-row justify-between gap-2 w-full">
                  <Text className="text-accent gap-2 flex flex-row items-center">
                    <MaterialCommunityIcons
                      name="cash-refund"
                      size={24}
                      className="text-accent"
                    />
                    Total Round Up
                  </Text>
                  <Text className="text-accent">
                    ₹{selectedWeekData.totalRoundUp}
                  </Text>
                </View>
              </Badge>
              <Badge
                size="lg"
                variant="outline"
                className="border-accent rounded-md gap-2 items-center py-2 flex flex-col"
              >
                <View className="flex flex-row justify-between gap-2 w-full">
                  <Text className="text-accent gap-2 flex flex-row items-center">
                    <MaterialCommunityIcons
                      name="chart-line-variant"
                      size={24}
                      className="text-accent"
                    />
                    Total Investment
                  </Text>
                  <Text className="text-accent">
                    ₹{selectedWeekData.totalInvestments}
                  </Text>
                </View>
              </Badge>
            </View>
            <Box className="bg-secondary flex flex-col w-full items-center rounded-lg p-4">
              <Text>Top expenses this week: </Text>
              <View className="flex flex-col gap-2 mt-2">
                {selectedWeekData.transactions
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 3)
                  .map((transaction, index) => (
                    <Badge
                      key={index}
                      size="sm"
                      variant="solid"
                      action="success"
                    >
                      <BadgeText className="text-white">
                        {transaction.category}: ₹{transaction.amount}
                      </BadgeText>
                    </Badge>
                  ))}
              </View>
            </Box>
            <Text>AI Summary: {selectedWeekData.aiSummary}</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default Analyze;
