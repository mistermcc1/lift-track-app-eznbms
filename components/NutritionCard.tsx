
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import ProgressRing from './ProgressRing';

interface NutritionCardProps {
  title: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}

export default function NutritionCard({ title, current, goal, unit, color }: NutritionCardProps) {
  const progress = Math.min(current / goal, 1);
  const percentage = Math.round(progress * 100);

  return (
    <View style={[commonStyles.card, styles.card]}>
      <ProgressRing
        progress={progress}
        size={80}
        strokeWidth={8}
        color={color}
      >
        <Text style={styles.percentage}>{percentage}%</Text>
      </ProgressRing>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.values}>
        {current}{unit} / {goal}{unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  percentage: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginTop: 8,
  },
  values: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
