import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ScrollView, TextInput, Modal, Pressable } from "react-native";
import { dummy } from "@/constants/dummyData";
import { Icon, EditIcon } from "@/components/ui/icon";
import { CalendarDays, IndianRupee } from "lucide-react-native";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState(dummy[0].transactions); 
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null); 
  const [editedNotes, setEditedNotes] = useState(""); 
  const [isModalVisible, setIsModalVisible] = useState(false); 

  const handleEditNotes = (transactionId: string, currentNotes: string) => {
    setEditingTransactionId(transactionId); 
    setEditedNotes(currentNotes || ""); 
    setIsModalVisible(true); 
  };

  const handleSaveNotes = () => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction.transactionId === editingTransactionId
        ? { ...transaction, notes: editedNotes }
        : transaction
    );
    setTransactions(updatedTransactions);
    setEditingTransactionId(null); 
    setEditedNotes(""); 
    setIsModalVisible(false); 
  };

  return (
    <Box className="flex-1 bg-background p-6">
      
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <VStack space="md">
          {transactions.map((transaction, index) => (
            <React.Fragment key={transaction.transactionId}>
              <Box className="p-4">
                <Text className="text-primary font-bold">
                  {transaction.category}
                </Text>
                <Box className="flex-row items-center mt-2">
                  <CalendarDays color="#9BA1A6" size={26} />
                  <Text className="text-gray-300 ml-2">
                    {new Date(transaction.date).toLocaleString()}
                  </Text>
                </Box>
                <Box className="flex-row items-center mt-2">
                  <IndianRupee color="#9BA1A6" size={26} />
                  <Text className="text-gray-300 ml-2">₹{transaction.amount}</Text>
                </Box>
                <Box className="flex-row items-center mt-2">
                  <Text className="text-gray-300 flex-1">
                    Notes: {transaction.notes || "No notes available"}
                  </Text>
                  {!transaction.notes && (
                    <Pressable
                      onPress={() =>
                        handleEditNotes(transaction.transactionId, transaction.notes)
                      }
                    >
                      <Icon
                        as={EditIcon}
                        size="xl"
                        className="text-primary ml-2"
                      />
                    </Pressable>
                  )}
                </Box>
              </Box>
              {index < transactions.length - 1 && (
                <Box className="h-px bg-accent my-2" />
              )}
            </React.Fragment>
          ))}
        </VStack>
      </ScrollView>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Box className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <Box className="w-4/5 bg-secondary p-6 rounded-lg">
            <Text className="text-primary text-lg font-bold mb-4">
              Edit Notes
            </Text>
            <TextInput
              value={editedNotes}
              onChangeText={setEditedNotes}
              placeholder="Enter notes"
              className="border border-accent rounded-lg p-2 text-gray-300 bg-background mb-4"
              placeholderTextColor="#888"
            />
            <Box className="flex-row justify-end">
              <Pressable onPress={handleSaveNotes}>
                <Text className="text-primary font-bold mr-4">Save</Text>
              </Pressable>
              <Pressable onPress={() => setIsModalVisible(false)}>
                <Text className="text-gray-400 font-bold">Cancel</Text>
              </Pressable>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}