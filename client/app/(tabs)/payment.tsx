import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import {
  Button,
  ButtonText
} from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { AlertCircleIcon } from "@/components/ui/icon";
import React from "react";

export default function PaymentScreen() {
  const [isInvalid, setIsInvalid] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("12345");

  const handleSubmit = () => {
    setIsInvalid(inputValue.length < 6);
  };

  return (
    <Box className="flex-1 items-center justify-center bg-background p-4">
      <Text className="text-primary text-lg font-semibold mb-4">
        This is the payment screen
      </Text>

      <VStack className="w-full max-w-[300px] rounded-md border border-background-200 p-4">
        <FormControl isInvalid={isInvalid} size="md">
          <FormControlLabel>
            <FormControlLabelText>Password</FormControlLabelText>
          </FormControlLabel>

          <Input className="my-1">
            <InputField
              type="password"
              placeholder="Enter password"
              value={inputValue}
              onChangeText={setInputValue}
            />
          </Input>

          <FormControlHelper>
            <FormControlHelperText>
              Must be at least 6 characters.
            </FormControlHelperText>
          </FormControlHelper>

          {isInvalid && (
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                At least 6 characters are required.
              </FormControlErrorText>
            </FormControlError>
          )}
        </FormControl>

        <Button className="w-fit self-end mt-4" size="sm" onPress={handleSubmit}>
          <ButtonText>Submit</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
