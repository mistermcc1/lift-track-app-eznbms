
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import { mockDailyNutrition, mockPersonalRecords, mockUserProfile, mockWorkouts } from '../data/mockData';
import NutritionCard from '../components/NutritionCard';
import PRCard from '../components/PRCard';
import WorkoutCard from '../components/WorkoutCard';
import BottomNavigation from '../components/BottomNavigation';
import Icon from '../components/Icon';
import NutritionScreen from './nutrition';
import WorkoutScreen from './workout';
import ProfileScreen from './profile';

export default function MainApp() {
  const [activeTab, setActiveTab] = useState('home');
  const nutrition = mockDailyNutrition;
  const profile = mockUserProfile;
  const recentPRs = mockPersonalRecords.slice(0, 3);
  const todayWorkouts = mockWorkouts;

  const handleTabPress = (tab: string) => {
    console.log('Tab pressed:', tab);
    setActiveTab(tab);
  };

  const handleWorkoutPress = () => {
    console.log('Workout pressed');
  };

  const handleAddMeal = () => {
    console.log('Add meal pressed');
    setActiveTab('nutrition');
  };

  const handleStartWorkout = () => {
    console.log('Start workout pressed');
    setActiveTab('workout');
  };

  // Render different screens based on active tab
  if (activeTab === 'nutrition') {
    return (
      <View style={commonStyles.container}>
        <NutritionScreen />
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    );
  }

  if (activeTab === 'workout') {
    return (
      <View style={commonStyles.container}>
        <WorkoutScreen />
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    );
  }

  if (activeTab === 'profile') {
    return (
      <View style={commonStyles.container}>
        <ProfileScreen />
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    );
  }

  // Home screen
  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{profile.name}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => setActiveTab('profile')}>
            <Icon name="person-circle" size={40} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Daily Nutrition Overview */}
        <View style={commonStyles.section}>
          <View style={[commonStyles.row, { marginBottom: 16 }]}>
            <Text style={commonStyles.subtitle}>Today&apos;s Nutrition</Text>
            <TouchableOpacity onPress={handleAddMeal}>
              <Icon name="add-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.nutritionGrid}>
            <NutritionCard
              title="Calories"
              current={nutrition.calories}
              goal={profile.goals.calories}
              unit=""
              color={colors.primary}
            />
            <NutritionCard
              title="Protein"
              current={nutrition.protein}
              goal={profile.goals.protein}
              unit="g"
              color={colors.secondary}
            />
          </View>
          
          <View style={styles.nutritionGrid}>
            <NutritionCard
              title="Carbs"
              current={nutrition.carbs}
              goal={profile.goals.carbs}
              unit="g"
              color={colors.accent}
            />
            <NutritionCard
              title="Fat"
              current={nutrition.fat}
              goal={profile.goals.fat}
              unit="g"
              color={colors.warning}
            />
          </View>
        </View>

        {/* Today's Workouts */}
        <View style={commonStyles.section}>
          <View style={[commonStyles.row, { marginBottom: 16 }]}>
            <Text style={commonStyles.subtitle}>Today&apos;s Workouts</Text>
            <TouchableOpacity onPress={handleStartWorkout}>
              <Icon name="add-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {todayWorkouts.length > 0 ? (
            todayWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onPress={handleWorkoutPress}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Icon name="fitness" size={48} color={colors.textSecondary} />
              <Text style={styles.emptyStateText}>No workouts planned for today</Text>
              <TouchableOpacity style={styles.startWorkoutButton} onPress={handleStartWorkout}>
                <Text style={styles.startWorkoutText}>Start a Workout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Recent Personal Records */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Recent PRs</Text>
          {recentPRs.map((pr) => (
            <PRCard key={pr.id} pr={pr} />
          ))}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  nutritionGrid: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 16,
  },
  startWorkoutButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startWorkoutText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
