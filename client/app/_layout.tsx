import 'expo-dev-client';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { usePathname } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { dummy } from "@/constants/dummyData";
import { ChatFab } from '@/components/ChatFab';

SplashScreen.preventAutoHideAsync();

const monthNames = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const path = usePathname();
  const noChat = path === "/chat";

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode="dark"><ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false,
              headerTintColor: "#93bee2",
              headerTitleStyle: { color: "#93bee2" }
            }} 
          />
          <Stack.Screen 
            name="+not-found" 
            options={{ 
              headerShown: true, 
              title: "Page Not Found",
              headerTintColor: "#93bee2",
              headerTitleStyle: { color: "#93bee2" }
            }} 
          />
          <Stack.Screen 
            name="chat" 
            options={{ 
              headerShown: true, 
              title: "Pixie is here to help",
              headerTintColor: "#93bee2",
              headerTitleStyle: { color: "#93bee2" }
            }} 
          />
          <Stack.Screen 
            name="transactions-history" 
            options={({ route }: { route: { params?: { month_id?: string } } }) => {
              const monthData = dummy.find(
                (data) => data._id.$oid === route.params?.month_id
              );
              const title = monthData
                ? `Transactions for ${monthNames[monthData.month - 1]} ${monthData.year}`
                : "Transactions";
              return { 
                headerShown: true, 
                title,
                headerTintColor: "#93bee2",
                headerTitleStyle: { color: "#93bee2" }
              };
            }} 
          />
        </Stack>
        <StatusBar style="auto" />
        {!noChat && <ChatFab />}
      </ThemeProvider></GluestackUIProvider>
  );
}
