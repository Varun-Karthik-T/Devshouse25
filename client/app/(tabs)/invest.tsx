import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { getPrediction } from '@/api';
import { useEffect, useState } from 'react';

export default function InvestScreen() {
    const [data, setData] = useState<Record<string, { current_value: number; predictions: Record<string, number> }> | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getPrediction();
                setData(response.predictions);
            } catch (error) {
                console.error('Error fetching prediction:', error);
            }
        };

        fetchData();
    }, []);

    if (!data) {
        return (
            <Box className="flex-1 items-center justify-center bg-background">
                <Text className="text-primary flex text-lg font-semibold">Loading...</Text>
            </Box>
        );
    }

    const predictionPeriods = [
        { label: "1M", days: 30 },
        { label: "2M", days: 60 },
        { label: "3M", days: 90 },
        { label: "6M", days: 180 },
        { label: "12M", days: 365 },
    ];

    return (
        <Box className="flex-1 items-center justify-center bg-background p-4">
            <HStack space="sm" className="overflow-x-auto">
                {/* Stock Column */}
                <VStack space="sm" className="min-w-[30px]">
                    <Text className="font-bold text-primary text-center">Comp</Text>
                    {Object.keys(data).map((stock) => (
                        <Text key={stock} className="text-primary text-center truncate h-12">{stock}</Text>
                    ))}
                </VStack>

                {/* Current Value Column */} 
                <VStack space="sm" className="min-w-[30px]">
                    <Text className="font-bold text-primary text-center">Current</Text>
                    {Object.values(data).map((stockData, index) => (
                        <Text key={index} className="text-primary text-center h-12">
                            {stockData?.current_value !== undefined
                                ? stockData.current_value.toFixed(1)
                                : "N/A"}
                        </Text>
                    ))}
                </VStack>

                {/* Prediction Columns */}
                {predictionPeriods.map(({ label, days }) => (
                    <VStack key={days} space="sm" className="min-w-[20px]">
                        <Text className="font-bold text-primary text-center">{label}</Text>
                        {Object.values(data).map((stockData, index) => {
                            const currentValue = stockData?.current_value;
                            const prediction = stockData?.predictions?.[days];
                            const percentageChange =
                                currentValue && prediction
                                    ? ((prediction - currentValue) / currentValue) * 100
                                    : null;

                            return (
                                <Box key={index} className="text-center">
                                    <Text className="text-primary">
                                        {prediction !== undefined
                                            ? prediction.toFixed(1)
                                            : "N/A"}
                                    </Text>
                                    {percentageChange !== null && (
                                        <Text
                                            className={`text-sm ${
                                                percentageChange >= 0
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {`(${percentageChange.toFixed(1)}%)`}
                                        </Text>
                                    )}
                                </Box>
                            );
                        })}
                    </VStack>
                ))}
            </HStack>

            <Text className="text-primary mt-4 text-lg text-center">Note: These predictions are done by AI</Text>
        </Box>
    );
}