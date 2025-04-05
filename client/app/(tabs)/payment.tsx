import React, { useState, useEffect } from "react";
import { Keyboard, Modal } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { History } from "lucide-react-native";
import { dummy } from "@/constants/dummyData";

export default function PaymentScreen() {
  const [amountValue, setAmountValue] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [upiId, setUpiId] = useState("");
  const [scannerVisible, setScannerVisible] = useState(false);
  const [permission, setPermission] = useState<null | boolean>(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(""); // State for modal message
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setPermission(status === "granted");
      if (status !== "granted") {
        setModalMessage("Camera permission is required to scan QR codes.");
        setShowModal(true);
      }
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setScannerVisible(true);
    }, [])
  );

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setUpiId(data);
    setScannerVisible(false);
    setModalMessage(`Paying to UPI ID: ${data}`);
    setShowModal(true);
  };

  const handlePayment = () => {
    Keyboard.dismiss();

    if (!paymentType || !amountValue) {
      setModalMessage("Please fill in both Payment Type and Amount.");
      setShowModal(true);
      return;
    }

    const enteredAmount = parseFloat(amountValue);

    if (enteredAmount % 10 === 0) {
      setModalMessage(`Paid ₹${enteredAmount}\nNo round-off applied.`);
      setShowModal(true);
      return;
    }

    let roundedAmount = Math.ceil(enteredAmount / 100) * 100;
    let roundUpValue = roundedAmount - enteredAmount;

    if (roundUpValue > enteredAmount * 0.25) {
      roundedAmount = Math.ceil(enteredAmount / 10) * 10;
      roundUpValue = roundedAmount - enteredAmount;
    }

    const newTransaction = {
      transactionId: `txn${dummy[0].transactions.length + 1}`,
      date: new Date().toISOString(),
      category: paymentType,
      amount: enteredAmount,
      upiId: upiId || "N/A",
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

    setModalMessage(
      `Paid ₹${enteredAmount}\nRounded up to ₹${roundedAmount}\n₹${roundUpValue} saved!`
    );
    setShowModal(true);
  };

  return (
    <Box className="flex-1 bg-background p-6">
      <Card className="flex-1 p-4 rounded-lg shadow-lg bg-background relative">
        <Box className="absolute top-8 right-4">
          <Button
            onPress={() => router.push("/transactions")}
            className="bg-transparent"
          >
            <History color="#9BA1A6" size={26} />
          </Button>
        </Box>

        <Center className="flex-1">
          <VStack space="xl" className="items-center w-4/5">
            <Text className="text-primary text-2xl font-bold">Make Payment</Text>

            <Input variant="outline" size="lg" className="placeholder:text-gray-400 text-white w-full border border-accent rounded-lg">
              <InputField
                placeholder="Enter Payment Type"
                value={paymentType}
                onChangeText={setPaymentType}
                className="placeholder:text-gray-400 text-white"
              />
            </Input>

            <Input variant="outline" size="lg" className="placeholder:text-gray-400 text-white w-full border border-accent rounded-lg">
              <InputField
                placeholder="Enter Amount"
                keyboardType="numeric"
                value={amountValue}
                onChangeText={setAmountValue}
                className="placeholder:text-gray-400 text-white"
              />
            </Input>

            <Input variant="outline" size="lg" className="placeholder:text-gray-400 text-white w-full border border-accent rounded-lg">
              <InputField
                placeholder="Add Comments "
                value={commentValue}
                onChangeText={setCommentValue}
                className="placeholder:text-gray-400 text-white"
              />
            </Input>

            <Input variant="outline" size="lg" className="placeholder:text-gray-400 text-white w-full border border-accent rounded-lg">
              <InputField
                placeholder="Enter or Scan UPI ID"
                value={upiId}
                onChangeText={setUpiId}
                className="placeholder:text-gray-400 text-white"
              />
            </Input>

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

      {/* Modal for Payment Success */}
      <Modal visible={showModal} animationType="fade" transparent>
        <Box className="flex-1 items-center justify-center bg-black bg-opacity-50">
          <Card className="p-6 rounded-lg bg-white w-4/5">
            <Text className="text-primary text-lg font-bold mb-4">Payment Status</Text>
            <Text className="text-gray-700 mb-6">{modalMessage}</Text>
            <Button
              onPress={() => setShowModal(false)}
              className="bg-primary px-6 py-3 rounded-lg"
            >
              <ButtonText className="text-background">Close</ButtonText>
            </Button>
          </Card>
        </Box>
      </Modal>
    </Box>
  );
}
