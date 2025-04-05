import { View, ScrollView } from "react-native";
import { useState } from "react";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Dropdown from "@/components/Dropdown";
import { dummy, months } from "@/constants/dummyData";
import { router } from "expo-router";

const Analyze = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const selectedMonthData = dummy.find((data) => data.month === selectedMonth);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
      className="p-4 my-12"
    >
      <View className="flex flex-row items-center justify-between w-full">
        <Heading bold size="2xl" className="flex-1 mr-2 text-primary">
          Your month in focus
        </Heading>
        <Dropdown
          options={months.map((month) => {
            const monthNames = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];
            return {
              label: `${monthNames[month.month - 1]}, ${month.year}`,
              value: month.month.toString(),
            };
          })}
          placeholder="Select a month"
          onValueChange={(value) => setSelectedMonth(Number(value))}
          className="flex-1 ml-2"
        />
      </View>
      {selectedMonthData && (
        <>
          <Box className="bg-secondary p-4 rounded-lg flex flex-col gap-4">
            <View className="flex items-center justify-center my-4">
              <Text bold size="6xl" className="text-primary font-bold mb-2">
                ₹{selectedMonthData.totalSavings + selectedMonthData.totalSpent}
              </Text>
              <Text bold size="2xl" className="text-primary font-bold mb-2">
                Total Savings and Investment
              </Text>
            </View>

            <Divider className="bg-primary" />
            <Badge
              size="lg"
              variant="outline"
              className="border-primary rounded-md gap-2 items-center py-2 flex flex-col"
            >
              <View className="flex flex-row justify-between gap-2 w-full">
                <Text className="text-primary gap-2 flex flex-row items-center">
                  <MaterialCommunityIcons
                    name="cash-minus"
                    size={24}
                    className="text-primary"
                  />
                  Total amount spent
                </Text>
                <Text className="text-primary">
                  ₹{selectedMonthData.totalSpent}
                </Text>
              </View>
            </Badge>
            <Badge
              size="lg"
              variant="outline"
              className="border-primary rounded-md gap-2 items-center py-2 flex flex-col"
            >
              <View className="flex flex-row justify-between gap-2 w-full">
                <Text className="text-primary gap-2 flex flex-row items-center">
                  <MaterialCommunityIcons
                    name="cash-plus"
                    size={24}
                    className="text-primary"
                  />
                  Total savings
                </Text>
                <Text className="text-primary">
                  ₹{selectedMonthData.totalSavings}
                </Text>
              </View>
            </Badge>
            <Badge
              size="lg"
              variant="outline"
              className="border-primary rounded-md gap-2 items-center py-2 flex flex-col"
            >
              <View className="flex flex-row justify-between gap-2 w-full">
                <Text className="text-primary gap-2 flex flex-row items-center">
                  <MaterialCommunityIcons
                    name="cash-refund"
                    size={24}
                    className="text-primary"
                  />
                  Total Round Up
                </Text>
                <Text className="text-primary">
                  ₹{selectedMonthData.totalRoundUp}
                </Text>
              </View>
            </Badge>
            <Badge
              size="lg"
              variant="outline"
              className="border-primary rounded-md gap-2 items-center py-2 flex flex-col"
            >
              <View className="flex flex-row justify-between gap-2 w-full">
                <Text className="text-primary gap-2 flex flex-row items-center">
                  <MaterialCommunityIcons
                    name="chart-line-variant"
                    size={24}
                    className="text-primary"
                  />
                  Total Investment
                </Text>
                <Text className="text-primary">
                  ₹{selectedMonthData.totalInvestments}
                </Text>
              </View>
            </Badge>
          </Box>
          <Box className="bg-secondary flex flex-col w-full items-center rounded-lg p-4">
            <Text>Top expenses this month: </Text>
            <View className="flex flex-col gap-2 mt-2">
              {selectedMonthData.transactions
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
            <Text
              onPress={() =>
                router.push({
                  pathname: "/transactions-history",
                  params: { month_id: selectedMonthData._id.$oid },
                })
              }
              className="text-primary mt-4 underline"
            >
              Show all transactions
            </Text>
          </Box>
          <Text>AI Summary: {selectedMonthData.aiSummary}</Text>
        </>
      )}
    </ScrollView>
  );
};

export default Analyze;
