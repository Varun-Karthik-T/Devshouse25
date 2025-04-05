import { View, ScrollView, Animated } from "react-native";
import { useState } from "react";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Dropdown from "@/components/Dropdown";
import { dummy, months } from "@/constants/dummyData";
import { router } from "expo-router";
import { HStack } from "@/components/ui/hstack";
import { Icon, ChevronRightIcon } from "@/components/ui/icon";

const Analyze = () => {
  const [selectedMonthId, setSelectedMonthId] = useState<number | null>(null);
  const [selectedMonthData, setSelectedMonthData] = useState<typeof dummy[0] | null>(null);
  const scrollY = new Animated.Value(0);

  const handleMonthChange = (value: string) => {
    const monthId = Number(value);
    setSelectedMonthId(monthId);
    console.log(monthId);
    const monthData = dummy.find((data) => data.month_id === monthId);
    console.log(monthData);
    setSelectedMonthData(monthData || null);
  };

  return (
    <Animated.ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
      className="p-4 my-12"
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
    >
      <View className="bg-black fixed top-0 z-10 flex flex-row items-center justify-between w-full">
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
              value: month.month_id.toString(),
            };
          })}
          placeholder="Select a month"
          onValueChange={handleMonthChange}
          value={selectedMonthId?.toString() || undefined}
          className="flex-1 ml-2"
        />
      </View>
      {selectedMonthData && (
        <>
          <Animated.View
            style={{
              opacity: scrollY.interpolate({
                inputRange: [0, 500],
                outputRange: [1, 0],
                extrapolate: "clamp",
              }),
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, 500],
                    outputRange: [0, -50],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
          >
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
          </Animated.View>
          <Animated.View
            style={{
              opacity: scrollY.interpolate({
                inputRange: [400, 800],
                outputRange: [1, 0],
                extrapolate: "clamp",
              }),
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [300, 600],
                    outputRange: [0, -50],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
          >
            <Box className=" flex flex-col w-full rounded-lg p-4">
              <HStack className="justify-between items-center mb-4">
                <Text bold size="2xl" className="text-left flex-1 text-primary">
                  Top expenses this month:
                </Text>
                <HStack className=" mt-4 flex-1 items-center justify-end">
                  <Text
                    className="text-primary"
                    onPress={() =>
                      router.push({
                        pathname: "/transactions-history",
                        params: { month_id: selectedMonthData._id.$oid },
                      })
                    }
                  >
                    Show all
                  </Text>
                  <Icon
                    as={ChevronRightIcon}
                    size="md"
                    className="text-primary ml-1"
                  />
                </HStack>
              </HStack>
              <View className="flex flex-col gap-4 mt-4">
                {selectedMonthData.transactions
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 3)
                  .map((transaction, index) => (
                    <Box
                      key={index}
                      className="bg-primary p-4 rounded-lg flex flex-col gap-2"
                    >
                      <HStack className="justify-between items-center">
                        <Text
                          bold
                          size="lg"
                          className="text-black"
                          style={{ textTransform: "capitalize" }}
                        >
                          {transaction.category}
                        </Text>
                        <Text bold size="lg" className="text-black">
                          ₹{transaction.amount}
                        </Text>
                      </HStack>
                      <Text className="text-secondary text-sm">
                        {new Date(transaction.date).toLocaleDateString()}
                      </Text>
                      {transaction.notes && (
                        <Text className="text-secondary text-sm italic">
                          "{transaction.notes}"
                        </Text>
                      )}
                    </Box>
                  ))}
              </View>
            </Box>
          </Animated.View>
          <Animated.View
            style={{
              opacity: scrollY.interpolate({
                inputRange: [800, 1200],
                outputRange: [1, 0],
                extrapolate: "clamp",
              }),
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [600, 900],
                    outputRange: [0, -50],
                    extrapolate: "clamp",
                  }),
                },
              ],
            }}
          >
            <Box className="bg-secondary p-4 rounded-lg flex flex-col gap-4">
              <Text bold size="2xl" className="text-primary mb-4">
                Goal Progress This Month
              </Text>
              {selectedMonthData.goals.map((goal) => (
                <Box
                  key={goal.goal_id}
                  className="bg-primary p-4 rounded-lg flex flex-col gap-2"
                >
                  <HStack className="justify-between items-center">
                    <Text bold size="lg" className="text-black">
                      {goal.goalName}
                    </Text>
                    <Text bold size="lg" className="text-black">
                      ₹{goal.progressThisMonth}
                    </Text>
                  </HStack>
                  <Text className="text-secondary text-sm">
                    Progress: {goal.progressPercentage}% ({goal.status})
                  </Text>
                </Box>
              ))}
            </Box>
          </Animated.View>
          <Animated.Text
            style={{
              opacity: scrollY.interpolate({
                inputRange: [900, 1200],
                outputRange: [1, 0],
                extrapolate: "clamp",
              }),
            }}
          >
            AI Summary: {selectedMonthData.aiSummary}
          </Animated.Text>
        </>
      )}
    </Animated.ScrollView>
  );
};

export default Analyze;
