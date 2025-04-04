import { View } from "react-native";
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
    <View className="flex-1 items-center gap-4 p-4">
      <Heading bold size="2xl">
        Your week in focus
      </Heading>
      <Dropdown
        options={weeks.map((week) => ({
          label: `${week.weekStart} - ${week.weekEnd}`,
          value: week.week_id.toString(),
        }))}
        placeholder="Select a week"
        onValueChange={(value) => setSelectedWeek(Number(value))}
      />
      <Divider className="my-2 bg-accent" />
      {selectedWeekData && (
        <>
          <View className="flex flex-row gap-2">
            <Badge
              size="lg"
              variant="solid"
              action="success"
              className="bg-red-500"
            >
              <BadgeText className="text-white">
                ₹{selectedWeekData.totalSpent}
              </BadgeText>
              <MaterialCommunityIcons
                name="cash-minus"
                size={24}
                className="text-white"
              />
            </Badge>
            <Badge
              size="lg"
              variant="solid"
              action="success"
              className="bg-green-500"
            >
              <BadgeText className="text-white">
                ₹{selectedWeekData.totalSavings}
              </BadgeText>
              <MaterialCommunityIcons
                name="cash-plus"
                size={24}
                className="text-white"
              />
            </Badge>
            <Badge
              size="lg"
              variant="solid"
              action="success"
              className="bg-green-500"
            >
              <BadgeText className="text-white">
                ₹{selectedWeekData.totalRoundUp}
              </BadgeText>
              <MaterialCommunityIcons
                name="cash-refund"
                size={24}
                className="text-white"
              />
            </Badge>
            <Badge
              size="lg"
              variant="solid"
              action="success"
              className="bg-green-500"
            >
              <BadgeText className="text-white">
                ₹{selectedWeekData.totalInvestments}
              </BadgeText>
              <MaterialCommunityIcons
                name="chart-line-variant"
                size={24}
                className="text-white"
              />
            </Badge>
          </View>
          <Box className="bg-secondary flex flex-col w-full items-center rounded-lg p-4">
            <Text>Top expenses this week: </Text>
            <View className="flex flex-col gap-2 mt-2">
              {selectedWeekData.transactions
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 3)
                .map((transaction, index) => (
                  <Badge key={index} size="sm" variant="solid" action="success">
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
  );
};

export default Analyze;
