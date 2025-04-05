import React, { useState } from "react";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Icon, GlobeIcon, PlayIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { Keyboard, Alert } from "react-native";
import { dummy } from "@/constants/dummyData";
import { useRouter } from "expo-router";

export default function PaymentScreen() {
  const [amountValue, setAmountValue] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const router = useRouter();

  const handlePayment = () => {
    Keyboard.dismiss();

    if (!paymentType || !amountValue) {
      Alert.alert("Error", "Please fill in both Payment Type and Amount.");
      return;
    }

    const enteredAmount = parseFloat(amountValue);
    const roundedAmount = Math.ceil(enteredAmount / 10) * 10; // Round up to the nearest 10
    const roundUpValue = roundedAmount - enteredAmount;

    // Add the transaction to the dummy data
    const newTransaction = {
      transactionId: `txn${dummy[0].transactions.length + 1}`,
      date: new Date().toISOString(),
      category: paymentType,
      amount: enteredAmount,
      notes: commentValue || "",
    };

    dummy[0].transactions.push(newTransaction);

    // Update totalRoundUp, totalSavings, and balance
    dummy[0].totalRoundUp += roundUpValue;
    dummy[0].totalSavings += roundUpValue;
    dummy[0].balance -= roundedAmount;

    console.log("Payment submitted:", { paymentType, enteredAmount, roundUpValue });
    console.log("Updated Dummy Data:", dummy[0]);

    // Reset the form
    setPaymentType("");
    setAmountValue("");
    setCommentValue("");

    // Notify the user about the round-up process
    Alert.alert(
      "Payment Successful",
      `You have paid ₹${enteredAmount}.  ₹${roundUpValue} has been added to your savings!! .`
    );
  };

  return (
    <Box className="flex-1 bg-background p-6">
      <Card className="flex-1 p-4 rounded-lg shadow-lg bg-background relative">
        <Box className="absolute top-8 right-4">
          <Menu
            placement="bottom"
            offset={5}
            trigger={({ ...triggerProps }) => {
              return (
                <Button {...triggerProps} className="bg-primary">
                  <ButtonText className="text-background">Menu</ButtonText>
                </Button>
              );
            }}
          >
            <MenuItem
              key="Transactions"
              textValue="Transactions"
              onPress={() => router.push("/transactions")}
            >
              <Icon as={GlobeIcon} size="sm" className="mr-2 text-primary" />
              <MenuItemLabel size="sm" className="text-primary">
                Transactions
              </MenuItemLabel>
            </MenuItem>
            <MenuItem key="Account" textValue="Plugins">
              <Icon as={PlayIcon} size="sm" className="mr-2 text-primary" />
              <MenuItemLabel size="sm" className="text-primary">
                Plugins
              </MenuItemLabel>
            </MenuItem>
          </Menu>
        </Box>

        {/* Payment Form */}
        <Center className="flex-1">
          <VStack space="xl" className="items-center w-4/5">
            <Text className="text-primary text-2xl font-bold">Make Payment</Text>
            <Input variant="outline" size="lg" className="w-full border border-accent rounded-lg">
              <InputField
                placeholder="Payment Type"
                value={paymentType}
                onChangeText={(text) => setPaymentType(text)}
                className={`placeholder:text-gray-400 ${
                  paymentType ? "text-primary" : "text-gray-800"
                }`}
              />
            </Input>
            <Input variant="outline" size="lg" className="w-full border border-accent rounded-lg">
              <InputField
                placeholder="Amount"
                keyboardType="numeric"
                value={amountValue}
                onChangeText={(text) => setAmountValue(text)}
                className={`placeholder:text-gray-400 ${
                  amountValue ? "text-primary" : "text-gray-800"
                }`}
              />
            </Input>
            <Input variant="outline" size="lg" className="w-full border border-accent rounded-lg">
              <InputField
                placeholder="Comments"
                value={commentValue}
                onChangeText={(text) => setCommentValue(text)}
                className={`placeholder:text-gray-400 ${
                  commentValue ? "text-primary" : "text-gray-800"
                }`}
              />
            </Input>
            <Button
              size="lg"
              variant="solid"
              action="primary"
              className="w-full bg-primary rounded-lg"
              onPress={handlePayment}
            >
              <ButtonText className="text-background text-lg font-semibold">Pay</ButtonText>
            </Button>
          </VStack>
        </Center>
      </Card>
    </Box>
  );
}