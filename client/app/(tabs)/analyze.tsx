import { View } from "react-native";
import { useState } from "react";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
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
        <View className="mt-4">
          <Text>Total Spent: ₹{selectedWeekData.totalSpent}</Text>
          <Text>Top Expense: {selectedWeekData.topExpenses[0]?.category}</Text>
          <Text>AI Summary: {selectedWeekData.aiSummary}</Text>
        </View>
      )}
    </View>
  );
};

export default Analyze;
