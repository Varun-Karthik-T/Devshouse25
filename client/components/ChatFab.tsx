import { Box } from "@/components/ui/box";
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab";
import { AddIcon } from "@/components/ui/icon";
import MaterialComunnityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { BotMessageSquare } from "lucide-react-native";

export function ChatFab() {
  const router = useRouter();

  return (
    <Box>
      <Fab
        size="lg"
        placement="bottom right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        onPress={() => router.push("/chat")}
        className="mb-16 border-4 border-secondary bg-primary w-20 h-20"
      >
        <FabIcon size="xl" className="text-secondary w-12 h-12" as={BotMessageSquare} />
      </Fab>
    </Box>
  );
}
