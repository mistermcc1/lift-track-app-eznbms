
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import { mockUserProfile, mockPersonalRecords } from '../data/mockData';
import { PersonalRecord } from '../types';
import PRCard from '../components/PRCard';
import Icon from '../components/Icon';

export default function ProfileScreen() {
  const [profile] = useState(mockUserProfile);
  const [personalRecords] = useState(mockPersonalRecords);

  const calculateBMI = () => {
    const heightInMeters = (profile.height * 2.54) / 100;
    const weightInKg = profile.weight * 0.453592;
    return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: colors.warning };
    if (bmi < 25) return { category: 'Normal', color: colors.success };
    if (bmi < 30) return { category: 'Overweight', color: colors.warning };
    return { category: 'Obese', color: colors.error };
  };

  const getActivityLevelText = (level: string) => {
    const levels = {
      sedentary: 'Sedentary',
      light: 'Lightly Active',
      moderate: 'Moderately Active',
      active: 'Very Active',
      very_active: 'Extremely Active'
    };
    return levels[level as keyof typeof levels] || level;
  };

  const bmi = parseFloat(calculateBMI());
  const bmiInfo = getBMICategory(bmi);

  const handleEditProfile = () => {
    console.log('Edit profile pressed');
  };

  const handleSettings = () => {
    console.log('Settings pressed');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Icon name="person-circle" size={80} color={colors.primary} />
          </View>
          <Text style={styles.userName}>{profile.name}</Text>
          <Text style={styles.userAge}>{profile.age} years old</Text>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Icon name="create" size={16} color={colors.background} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Overview</Text>
          
          <View style={styles.statsGrid}>
            <View style={[commonStyles.card, styles.statCard]}>
              <Text style={styles.statValue}>{profile.weight}</Text>
              <Text style={styles.statLabel}>lbs</Text>
              <Text style={styles.statTitle}>Weight</Text>
            </View>
            
            <View style={[commonStyles.card, styles.statCard]}>
              <Text style={styles.statValue}>{Math.floor(profile.height / 12)}&apos;{profile.height % 12}&quot;</Text>
              <Text style={styles.statLabel}>ft&apos;in&quot;</Text>
              <Text style={styles.statTitle}>Height</Text>
            </View>
            
            <View style={[commonStyles.card, styles.statCard]}>
              <Text style={styles.statValue}>{bmi}</Text>
              <Text style={[styles.statLabel, { color: bmiInfo.color }]}>
                {bmiInfo.category}
              </Text>
              <Text style={styles.statTitle}>BMI</Text>
            </View>
          </View>
        </View>

        {/* Activity Level */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Activity Level</Text>
          <View style={commonStyles.card}>
            <View style={commonStyles.row}>
              <View>
                <Text style={styles.activityLevel}>
                  {getActivityLevelText(profile.activityLevel)}
                </Text>
                <Text style={styles.activityDescription}>
                  Current activity level setting
                </Text>
              </View>
              <Icon name="fitness" size={24} color={colors.secondary} />
            </View>
          </View>
        </View>

        {/* Daily Goals */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Daily Goals</Text>
          
          <View style={styles.goalsGrid}>
            <View style={[commonStyles.card, styles.goalCard]}>
              <Text style={styles.goalValue}>{profile.goals.calories}</Text>
              <Text style={styles.goalLabel}>Calories</Text>
            </View>
            
            <View style={[commonStyles.card, styles.goalCard]}>
              <Text style={styles.goalValue}>{profile.goals.protein}g</Text>
              <Text style={styles.goalLabel}>Protein</Text>
            </View>
            
            <View style={[commonStyles.card, styles.goalCard]}>
              <Text style={styles.goalValue}>{profile.goals.carbs}g</Text>
              <Text style={styles.goalLabel}>Carbs</Text>
            </View>
            
            <View style={[commonStyles.card, styles.goalCard]}>
              <Text style={styles.goalValue}>{profile.goals.fat}g</Text>
              <Text style={styles.goalLabel}>Fat</Text>
            </View>
          </View>
        </View>

        {/* Personal Records */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Personal Records</Text>
          {personalRecords.map((pr) => (
            <PRCard key={pr.id} pr={pr} />
          ))}
        </View>

        {/* Settings */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Settings</Text>
          
          <TouchableOpacity style={[commonStyles.card, styles.settingItem]} onPress={handleSettings}>
            <View style={commonStyles.row}>
              <View style={commonStyles.centerRow}>
                <Icon name="notifications" size={24} color={colors.textSecondary} />
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[commonStyles.card, styles.settingItem]} onPress={handleSettings}>
            <View style={commonStyles.row}>
              <View style={commonStyles.centerRow}>
                <Icon name="shield-checkmark" size={24} color={colors.textSecondary} />
                <Text style={styles.settingText}>Privacy</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={[commonStyles.card, styles.settingItem]} onPress={handleSettings}>
            <View style={commonStyles.row}>
              <View style={commonStyles.centerRow}>
                <Icon name="help-circle" size={24} color={colors.textSecondary} />
                <Text style={styles.settingText}>Help & Support</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userAge: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginTop: 8,
  },
  activityLevel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  activityDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalCard: {
    flex: 1,
    minWidth: '48%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  goalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  goalLabel: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  settingItem: {
    marginBottom: 8,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
});
