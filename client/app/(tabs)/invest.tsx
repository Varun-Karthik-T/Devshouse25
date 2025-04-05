import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { getPrediction } from "@/api";
import { useEffect, useState } from "react";
import { ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

export default function InvestScreen() {
  const [data, setData] = useState<Record<
    string,
    { current_value: number; predictions: Record<string, number> }
  > | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    "stocks" | "gold" | "fd"
  >("stocks");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPrediction();
        setData(response.predictions);
      } catch (error) {
        console.error("Error fetching prediction:", error);
      }
    };
    fetchData();
  }, []);

  const predictionPeriods = [
    { label: "1M", days: 30 },
    { label: "2M", days: 60 },
    { label: "3M", days: 90 },
    { label: "6M", days: 180 },
    { label: "12M", days: 365 },
  ];

  return (
    <ScrollView>
      <HStack space="lg" className="mt-20 justify-center">
        <Box className="bg-accent p-5 py-10 w-fit rounded-xl items-center">
          <Text className="text-white text-4xl">12.1K</Text>
          <Text className="text-white">Invested</Text>
        </Box>
        <Box className="bg-accent p-5 py-10 w-fit rounded-xl items-center">
          <Text className="text-white text-5xl">7%</Text>
          <Text className="text-white">Profit</Text>
        </Box>
      </HStack>
      <Box className="mt-10 px-4">
        <Text className="text-primary text-center mb-2 font-semibold">
          Savings Over Time
        </Text>
       
          <LineChart
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [{ data: [200, 250, 350, 420, 490, 532] }],
            }}
            width={Dimensions.get("window").width - 30}
            height={220}
            yAxisLabel="₹"
            chartConfig={{
              backgroundColor: '#04080b',
              backgroundGradientFrom: "#04080b",
              backgroundGradientTo: "#04080b",
              decimalPlaces: 0,
              color: (opacity = 1) => `white`,
              labelColor: () => "#37a0f6",
            }}
            style={{ borderRadius: 11 }}
            
          />
       
      </Box>
 
      <Box className="mt-6 px-4 items-center">
        {/* Table Header */}
        <Text className="text-accent flex-1 ">Your Investments</Text>
        <HStack className="border-b border-primary pb-2 mb-2">
          <Text className="flex-1 font-semibold text-primary text-sm text-center">
            Area
          </Text>
          <Text className="flex-1 font-semibold text-primary text-sm text-center">
            Deposit
          </Text>
          <Text className="flex-1 font-semibold text-primary text-sm text-center">
            Profit %
          </Text>
          <Text className="flex-1 font-semibold text-primary text-sm text-center">
            Current
          </Text>
          <Text className="flex-1 font-semibold text-primary text-sm text-center">
            Action
          </Text>
        </HStack>

        {/* Table Rows */}
        {[
          { area: "Stocks", deposit: 8000, profit: 7.2, current: 8560 },
          { area: "Gold", deposit: 3000, profit: 5.1, current: 3153 },
          { area: "FD", deposit: 1100, profit: 4.0, current: 1040 },
        ].map((item, index) => (
          <HStack key={index} className="mb-3">
            <Text className="flex-1 text-primary text-center">{item.area}</Text>
            <Text className="flex-1 text-primary text-center">
              ₹{item.deposit}
            </Text>
            <Text className="flex-1 text-primary text-center">
              {item.profit}%
            </Text>
            <Text className="flex-1 text-primary text-center">
              ₹{item.current}
            </Text>
            <Box className="flex-1 items-center">
              <Button
                size="sm"
                variant="solid"
                className="rounded-full px-2 py-1"
              >
                <ButtonText className="text-white text-xs">Withdraw</ButtonText>
              </Button>
            </Box>
          </HStack>
        ))}
      </Box>
      <Box className="flex-1 bg-background p-4">
        <VStack space="lg" className="items-center mt-20">
          <Text className="text-accent text-6xl font-semibold">₹532</Text>
          <Text className="text-primary text-lg font-semibold">Saved</Text>
          <Text className="text-primary text-lg font-semibold">
            Where to Invest?
          </Text>

          {/* Investment Category Buttons */}
          <HStack space="md" className="flex-wrap justify-center">
            {["stocks", "gold", "fd", "Others"].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "solid" : "outline"}
                onPress={() => setSelectedCategory(category as any)}
                size="md"
                className="mb-2 border-2 border-primary rounded-full  "
              >
                <ButtonText className="capitalize text-primary">
                  {category}
                </ButtonText>
              </Button>
            ))}
          </HStack>
        </VStack>

        {/* Conditional Content */}
        <Box className="mt-6">
          {selectedCategory === "stocks" && data ? (
            <>
              <HStack space="sm" className="overflow-x-auto">
                {/* Company Names */}
                <VStack space="sm" className="min-w-[30px]">
                  <Text className="font-bold text-primary text-center">
                    Comp
                  </Text>
                  {Object.keys(data).map((stock) => (
                    <Text
                      key={stock}
                      className="text-primary text-center truncate h-12"
                    >
                      {stock}
                    </Text>
                  ))}
                </VStack>

                {/* Current Value */}
                <VStack space="sm" className="min-w-[25px]">
                  <Text className="font-bold text-primary text-center">
                    Current
                  </Text>
                  {Object.values(data).map((stockData, index) => (
                    <Text key={index} className="text-primary text-center h-12">
                      {stockData?.current_value?.toFixed(1) ?? "N/A"}
                    </Text>
                  ))}
                </VStack>

                {/* Predictions */}
                {predictionPeriods.map(({ label, days }) => (
                  <VStack key={days} space="sm" className="min-w-[25px]">
                    <Text className="font-bold text-primary text-center">
                      {label}
                    </Text>
                    {Object.values(data).map((stockData, index) => {
                      const current = stockData?.current_value;
                      const predicted = stockData?.predictions?.[days];
                      const change =
                        current && predicted
                          ? ((predicted - current) / current) * 100
                          : null;
                      return (
                        <Box key={index} className="text-center">
                          <Text className="text-primary">
                            {predicted?.toFixed(1) ?? "N/A"}
                          </Text>
                          {change !== null && (
                            <Text
                              className={`text-sm ${
                                change >= 0 ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              ({change.toFixed(1)}%)
                            </Text>
                          )}
                        </Box>
                      );
                    })}
                  </VStack>
                ))}
              </HStack>
              <Text className="text-center text-primary text-sm">
                Note: Predictions are AI-generated and are not financial advice.
              </Text>
            </>
          ) : selectedCategory === "gold" ? (
            <Text className="text-primary text-center text-md">
              Gold investments coming soon!
            </Text>
          ) : selectedCategory === "fd" ? (
            <Text className="text-primary text-center text-md">
              Fixed Deposits feature launching soon!
            </Text>
          ) : null}
        </Box>
      </Box>
    </ScrollView>
  );
}
