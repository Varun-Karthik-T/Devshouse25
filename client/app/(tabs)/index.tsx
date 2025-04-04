
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';

export default function GoalScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Goal Screen</ThemedText>
      <Progress>
        <ProgressFilledTrack />
      </Progress>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});