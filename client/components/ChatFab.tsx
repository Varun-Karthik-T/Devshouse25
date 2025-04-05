import { Box } from "@/components/ui/box";
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab";
import { AddIcon } from "@/components/ui/icon";
import { useRouter } from "expo-router";

export function ChatFab() {
  const router = useRouter();

  return (
    <Box>
      <Fab
        size="md"
        placement="bottom right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        onPress={() => router.push("/chat")}
        style={{ backgroundColor: "#6200ea" }} // Change background color
      >
        <FabIcon as={AddIcon} />
        <FabLabel>Chat</FabLabel>
      </Fab>
    </Box>
  );
}
