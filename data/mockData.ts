
import { Exercise, PersonalRecord, DailyNutrition, UserProfile, Workout } from '../types';

export const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Bench Press',
    category: 'Chest',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders']
  },
  {
    id: '2',
    name: 'Squat',
    category: 'Legs',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings']
  },
  {
    id: '3',
    name: 'Deadlift',
    category: 'Back',
    muscleGroups: ['Back', 'Hamstrings', 'Glutes']
  },
  {
    id: '4',
    name: 'Pull-ups',
    category: 'Back',
    muscleGroups: ['Back', 'Biceps']
  },
  {
    id: '5',
    name: 'Overhead Press',
    category: 'Shoulders',
    muscleGroups: ['Shoulders', 'Triceps']
  }
];

export const mockPersonalRecords: PersonalRecord[] = [
  {
    id: '1',
    exerciseId: '1',
    exerciseName: 'Bench Press',
    weight: 225,
    reps: 1,
    date: new Date('2024-01-15'),
    oneRepMax: 225
  },
  {
    id: '2',
    exerciseId: '2',
    exerciseName: 'Squat',
    weight: 315,
    reps: 1,
    date: new Date('2024-01-10'),
    oneRepMax: 315
  },
  {
    id: '3',
    exerciseId: '3',
    exerciseName: 'Deadlift',
    weight: 405,
    reps: 1,
    date: new Date('2024-01-08'),
    oneRepMax: 405
  }
];

export const mockDailyNutrition: DailyNutrition = {
  date: new Date().toISOString().split('T')[0],
  calories: 1850,
  protein: 140,
  carbs: 180,
  fat: 65,
  meals: [
    {
      id: '1',
      name: 'Breakfast',
      timestamp: new Date(),
      foods: [
        {
          id: '1',
          name: 'Oatmeal',
          calories: 300,
          protein: 10,
          carbs: 54,
          fat: 6,
          quantity: 1,
          unit: 'cup'
        },
        {
          id: '2',
          name: 'Banana',
          calories: 105,
          protein: 1,
          carbs: 27,
          fat: 0,
          quantity: 1,
          unit: 'medium'
        }
      ]
    }
  ]
};

export const mockUserProfile: UserProfile = {
  id: '1',
  name: 'John Doe',
  age: 28,
  weight: 180,
  height: 72,
  activityLevel: 'moderate',
  goals: {
    calories: 2200,
    protein: 150,
    carbs: 220,
    fat: 75
  }
};

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Push Day',
    startTime: new Date(),
    exercises: [
      {
        id: '1',
        exercise: mockExercises[0],
        sets: [
          { id: '1', reps: 8, weight: 185, completed: true },
          { id: '2', reps: 6, weight: 205, completed: true },
          { id: '3', reps: 4, weight: 215, completed: false }
        ]
      }
    ]
  }
];
