import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { dummy } from "@/constants/dummyData";
import { useLocalSearchParams } from "expo-router";

const TransactionsHistory = () => {
  const { month_id } = useLocalSearchParams();

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const selectedMonthData = dummy.find(
    (data) => data._id.$oid === (typeof month_id === "string" ? month_id : "")
  );

  return (
    <ScrollView className="p-4">
      {selectedMonthData?.transactions.map((transaction) => (
        <Box
          key={transaction.transactionId}
          className="bg-primary p-4 rounded-lg flex flex-col gap-2 mb-2"
        >
          <View className="flex flex-row justify-between items-center">
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
          </View>
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
    </ScrollView>
  );
};

export default TransactionsHistory;
