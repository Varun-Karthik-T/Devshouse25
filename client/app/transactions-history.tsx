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
          className="bg-secondary p-4 rounded-lg mb-2"
        >
          <Text bold className="text-primary">
            {transaction.category}
          </Text>
          <Text>Amount: ₹{transaction.amount}</Text>
          <Text>Date: {new Date(transaction.date).toLocaleDateString()}</Text>
          <Text>Notes: {transaction.notes}</Text>
        </Box>
      ))}
    </ScrollView>
  );
};

export default TransactionsHistory;
