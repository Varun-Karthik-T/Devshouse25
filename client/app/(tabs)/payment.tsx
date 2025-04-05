import React, { useState, useEffect } from "react";
import { Keyboard, Alert, Modal } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useRouter } from "expo-router";

import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Icon, GlobeIcon, PlayIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";

import { dummy } from "@/constants/dummyData";

export default function PaymentScreen() {
  const [amountValue, setAmountValue] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [upiId, setUpiId] = useState(""); // UPI ID from QR code
  const [scannerVisible, setScannerVisible] = useState(false);
  const [permission, setPermission] = useState<null | boolean>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setUpiId(data); // Autofill the UPI ID field
    setScannerVisible(false);
    Alert.alert(
      "Paying to",
      `UPI ID: ${data}`,
      [
        { text: "Cancel", onPress: () => console.log("Cancelled"), style: "cancel" },
        { text: "OK", onPress: () => console.log("Confirmed") },
      ]
    );
  };

  const handlePayment = () => {
    Keyboard.dismiss();

    if (!paymentType || !amountValue) {
      Alert.alert("Error", "Please fill in both Payment Type and Amount.");
      return;
    }

    const enteredAmount = parseFloat(amountValue);
    const roundedAmount = Math.ceil(enteredAmount / 10) * 10;
    const roundUpValue = roundedAmount - enteredAmount;

    const newTransaction = {
      transactionId: `txn${dummy[0].transactions.length + 1}`,
      date: new Date().toISOString(),
      category: paymentType,
      amount: enteredAmount,
      notes: commentValue || "",
    };

    dummy[0].transactions.push(newTransaction);
    dummy[0].totalRoundUp += roundUpValue;
    dummy[0].totalSavings += roundUpValue;
    dummy[0].balance -= roundedAmount;

    setPaymentType("");
    setAmountValue("");
    setCommentValue("");
    setUpiId("");

    Alert.alert(
      "Payment Successful",
      `Paid ₹${enteredAmount}\n₹${roundUpValue} saved!\nUPI: ${upiId || "N/A"}`
    );
  };

  return (
    <Box className="flex-1 bg-background p-6">
      <Card className="flex-1 p-4 rounded-lg shadow-lg bg-background relative">
        {/* Top Menu */}
        <Box className="absolute top-8 right-4">
          <Menu
            placement="bottom"
            offset={5}
            trigger={({ ...triggerProps }) => (
              <Button {...triggerProps} className="bg-primary">
                <ButtonText className="text-background">Menu</ButtonText>
              </Button>
            )}
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
            <MenuItem key="Plugins" textValue="Plugins">
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

            {/* Payment Type */}
            <Input variant="outline" size="lg" className="placeholder:text-gray-400 text-white w-full border border-accent rounded-lg">
              <InputField
                placeholder="Enter Payment Type"
                value={paymentType}
                onChangeText={setPaymentType}
                className="placeholder:text-gray-400 text-white"
              />
            </Input>

            {/* Amount */}
            <Input variant="outline" size="lg" className="placeholder:text-gray-400 text-white w-full border border-accent rounded-lg">
              <InputField
                placeholder="Enter Amount"
                keyboardType="numeric"
                value={amountValue}
                onChangeText={setAmountValue}
                className="placeholder:text-gray-400 text-white"
              />
            </Input>

            {/* Comments */}
            <Input variant="outline" size="lg" className="placeholder:text-gray-400 text-white w-full border border-accent rounded-lg">
              <InputField
                placeholder="Add Comments "
                value={commentValue}
                onChangeText={setCommentValue}
                className="placeholder:text-gray-400 text-white"
              />
            </Input>

            {/* UPI ID */}
            <Input variant="outline" size="lg" className="placeholder:text-gray-400 text-white w-full border border-accent rounded-lg">
              <InputField
                placeholder="Enter or Scan UPI ID"
                value={upiId}
                onChangeText={setUpiId}
                className="placeholder:text-gray-400 text-white"
              />
            </Input>

            {/* Scan QR Button */}
            <Button
              onPress={() => setScannerVisible(true)}
              className="bg-secondary w-full rounded-lg"
            >
              <ButtonText className="text-background">Scan QR for UPI</ButtonText>
            </Button>

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

      {/* QR Scanner Modal */}
      <Modal visible={scannerVisible} animationType="slide">
        <Box className="flex-1 items-center justify-center bg-black">
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={{ height: "100%", width: "100%" }}
          />
          <Button
            onPress={() => setScannerVisible(false)}
            className="absolute bottom-8 bg-primary px-6 py-3 rounded-lg"
          >
            <ButtonText className="text-background text-md">Cancel</ButtonText>
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
