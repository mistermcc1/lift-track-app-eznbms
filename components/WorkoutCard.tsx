
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { Workout } from '../types';
import Icon from './Icon';

interface WorkoutCardProps {
  workout: Workout;
  onPress: () => void;
}

export default function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTotalSets = () => {
    return workout.exercises.reduce((total, exercise) => total + exercise.sets.length, 0);
  };

  const getCompletedSets = () => {
    return workout.exercises.reduce((total, exercise) => 
      total + exercise.sets.filter(set => set.completed).length, 0
    );
  };

  return (
    <TouchableOpacity style={[commonStyles.card, styles.card]} onPress={onPress}>
      <View style={commonStyles.row}>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.time}>{formatTime(workout.startTime)}</Text>
          <Text style={styles.exercises}>
            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <View style={styles.progressInfo}>
          <Text style={styles.progress}>
            {getCompletedSets()}/{getTotalSets()} sets
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(getCompletedSets() / getTotalSets()) * 100}%` }
              ]} 
            />
          </View>
        </View>
        <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  time: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  exercises: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  progressInfo: {
    alignItems: 'flex-end',
    marginRight: 12,
    minWidth: 80,
  },
  progress: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: colors.grey,
    borderRadius: 2,
    marginTop: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: 2,
  },
});
