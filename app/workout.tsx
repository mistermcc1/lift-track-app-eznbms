
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import { mockExercises, mockWorkouts } from '../data/mockData';
import { Exercise, Workout, WorkoutExercise, Set } from '../types';
import Icon from '../components/Icon';
import SimpleBottomSheet from '../components/BottomSheet';

export default function WorkoutScreen() {
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showSetInput, setShowSetInput] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
  const [newSet, setNewSet] = useState({ weight: '', reps: '' });

  const handleStartWorkout = () => {
    const workout: Workout = {
      id: Date.now().toString(),
      name: 'New Workout',
      exercises: [],
      startTime: new Date(),
    };
    setCurrentWorkout(workout);
    console.log('Started new workout');
  };

  const handleAddExercise = (exercise: Exercise) => {
    if (!currentWorkout) return;

    const workoutExercise: WorkoutExercise = {
      id: Date.now().toString(),
      exercise,
      sets: [],
    };

    setCurrentWorkout({
      ...currentWorkout,
      exercises: [...currentWorkout.exercises, workoutExercise],
    });
    setShowExerciseSelector(false);
    console.log('Added exercise:', exercise.name);
  };

  const handleAddSet = (exerciseId: string) => {
    setSelectedExerciseId(exerciseId);
    setShowSetInput(true);
  };

  const handleSaveSet = () => {
    if (!currentWorkout || !newSet.weight || !newSet.reps) return;

    const exerciseIndex = currentWorkout.exercises.findIndex(
      ex => ex.id === selectedExerciseId
    );

    if (exerciseIndex === -1) return;

    const set: Set = {
      id: Date.now().toString(),
      weight: parseInt(newSet.weight),
      reps: parseInt(newSet.reps),
      completed: true,
    };

    const updatedExercises = [...currentWorkout.exercises];
    updatedExercises[exerciseIndex].sets.push(set);

    setCurrentWorkout({
      ...currentWorkout,
      exercises: updatedExercises,
    });

    setNewSet({ weight: '', reps: '' });
    setShowSetInput(false);
    console.log('Added set:', set);
  };

  const handleFinishWorkout = () => {
    if (!currentWorkout) return;

    const finishedWorkout = {
      ...currentWorkout,
      endTime: new Date(),
    };

    console.log('Finished workout:', finishedWorkout);
    setCurrentWorkout(null);
  };

  const getTotalSets = (workout: Workout) => {
    return workout.exercises.reduce((total, ex) => total + ex.sets.length, 0);
  };

  const getWorkoutDuration = (startTime: Date, endTime?: Date) => {
    const end = endTime || new Date();
    const duration = Math.floor((end.getTime() - startTime.getTime()) / 60000);
    return `${duration} min`;
  };

  if (currentWorkout) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Workout Header */}
          <View style={styles.workoutHeader}>
            <View>
              <Text style={styles.workoutTitle}>{currentWorkout.name}</Text>
              <Text style={styles.workoutTime}>
                Started at {currentWorkout.startTime.toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit' 
                })}
              </Text>
              <Text style={styles.workoutStats}>
                {currentWorkout.exercises.length} exercises • {getTotalSets(currentWorkout)} sets
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.finishButton}
              onPress={handleFinishWorkout}
            >
              <Text style={styles.finishButtonText}>Finish</Text>
            </TouchableOpacity>
          </View>

          {/* Exercises */}
          <View style={commonStyles.section}>
            {currentWorkout.exercises.map((workoutExercise) => (
              <View key={workoutExercise.id} style={[commonStyles.card, styles.exerciseCard]}>
                <View style={[commonStyles.row, { marginBottom: 12 }]}>
                  <View>
                    <Text style={styles.exerciseName}>{workoutExercise.exercise.name}</Text>
                    <Text style={styles.exerciseCategory}>
                      {workoutExercise.exercise.category} • {workoutExercise.sets.length} sets
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleAddSet(workoutExercise.id)}>
                    <Icon name="add-circle" size={24} color={colors.primary} />
                  </TouchableOpacity>
                </View>

                {/* Sets */}
                {workoutExercise.sets.map((set, index) => (
                  <View key={set.id} style={styles.setRow}>
                    <Text style={styles.setNumber}>{index + 1}</Text>
                    <Text style={styles.setWeight}>{set.weight} lbs</Text>
                    <Text style={styles.setReps}>{set.reps} reps</Text>
                    <Icon 
                      name={set.completed ? "checkmark-circle" : "ellipse-outline"} 
                      size={20} 
                      color={set.completed ? colors.success : colors.textSecondary} 
                    />
                  </View>
                ))}
              </View>
            ))}

            {/* Add Exercise Button */}
            <TouchableOpacity 
              style={styles.addExerciseButton}
              onPress={() => setShowExerciseSelector(true)}
            >
              <Icon name="add" size={24} color={colors.primary} />
              <Text style={styles.addExerciseText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Exercise Selector Bottom Sheet */}
        <SimpleBottomSheet
          isVisible={showExerciseSelector}
          onClose={() => setShowExerciseSelector(false)}
        >
          <View style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Select Exercise</Text>
            <ScrollView style={styles.exerciseList}>
              {mockExercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={styles.exerciseOption}
                  onPress={() => handleAddExercise(exercise)}
                >
                  <View>
                    <Text style={styles.exerciseOptionName}>{exercise.name}</Text>
                    <Text style={styles.exerciseOptionCategory}>
                      {exercise.category} • {exercise.muscleGroups.join(', ')}
                    </Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </SimpleBottomSheet>

        {/* Set Input Bottom Sheet */}
        <SimpleBottomSheet
          isVisible={showSetInput}
          onClose={() => setShowSetInput(false)}
        >
          <View style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Add Set</Text>
            
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Weight (lbs)</Text>
                <TextInput
                  style={styles.input}
                  value={newSet.weight}
                  onChangeText={(text) => setNewSet({ ...newSet, weight: text })}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Reps</Text>
                <TextInput
                  style={styles.input}
                  value={newSet.reps}
                  onChangeText={(text) => setNewSet({ ...newSet, reps: text })}
                  placeholder="0"
                  keyboardType="numeric"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveSet}>
              <Text style={styles.saveButtonText}>Add Set</Text>
            </TouchableOpacity>
          </View>
        </SimpleBottomSheet>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Workouts</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>

        {/* Start Workout */}
        <View style={commonStyles.section}>
          <TouchableOpacity style={styles.startWorkoutCard} onPress={handleStartWorkout}>
            <Icon name="play-circle" size={48} color={colors.primary} />
            <Text style={styles.startWorkoutTitle}>Start Empty Workout</Text>
            <Text style={styles.startWorkoutSubtitle}>
              Begin a new workout and add exercises as you go
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Workouts */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Recent Workouts</Text>
          
          {mockWorkouts.map((workout) => (
            <View key={workout.id} style={[commonStyles.card, styles.workoutHistoryCard]}>
              <View style={commonStyles.row}>
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutName}>{workout.name}</Text>
                  <Text style={styles.workoutDate}>
                    {workout.startTime.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </Text>
                  <Text style={styles.workoutSummary}>
                    {workout.exercises.length} exercises • {getTotalSets(workout)} sets
                  </Text>
                </View>
                <View style={styles.workoutDuration}>
                  <Text style={styles.durationText}>
                    {getWorkoutDuration(workout.startTime, workout.endTime)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  startWorkoutCard: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  startWorkoutTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
  },
  startWorkoutSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  workoutHistoryCard: {
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
  workoutDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  workoutSummary: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  workoutDuration: {
    alignItems: 'flex-end',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  workoutTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  workoutStats: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  finishButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  finishButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  exerciseCard: {
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  exerciseCategory: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  setNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    width: 30,
  },
  setWeight: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    marginLeft: 12,
  },
  setReps: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  addExerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 20,
    marginTop: 12,
  },
  addExerciseText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 8,
  },
  bottomSheetContent: {
    padding: 20,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  exerciseList: {
    maxHeight: 300,
  },
  exerciseOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exerciseOptionName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  exerciseOptionCategory: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
