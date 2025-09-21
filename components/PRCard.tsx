
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { PersonalRecord } from '../types';
import Icon from './Icon';

interface PRCardProps {
  pr: PersonalRecord;
}

export default function PRCard({ pr }: PRCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <View style={[commonStyles.card, styles.card]}>
      <View style={commonStyles.row}>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{pr.exerciseName}</Text>
          <Text style={styles.date}>{formatDate(pr.date)}</Text>
        </View>
        <View style={styles.prInfo}>
          <Text style={styles.weight}>{pr.weight} lbs</Text>
          <Text style={styles.reps}>{pr.reps} rep{pr.reps !== 1 ? 's' : ''}</Text>
        </View>
        <Icon name="trophy" size={24} color={colors.accent} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  prInfo: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  weight: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  reps: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
