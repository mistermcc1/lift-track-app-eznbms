
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import { mockDailyNutrition, mockUserProfile } from '../data/mockData';
import { FoodItem, Meal } from '../types';
import NutritionCard from '../components/NutritionCard';
import Icon from '../components/Icon';
import SimpleBottomSheet from '../components/BottomSheet';

export default function NutritionScreen() {
  const [nutrition, setNutrition] = useState(mockDailyNutrition);
  const [showAddFood, setShowAddFood] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [newFood, setNewFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    quantity: '1',
    unit: 'serving'
  });

  const profile = mockUserProfile;

  const handleAddFood = (mealName: string) => {
    console.log('Adding food to meal:', mealName);
    setSelectedMeal(mealName);
    setShowAddFood(true);
  };

  const handleSaveFood = () => {
    if (!newFood.name || !newFood.calories) {
      console.log('Missing required fields');
      return;
    }

    const foodItem: FoodItem = {
      id: Date.now().toString(),
      name: newFood.name,
      calories: parseInt(newFood.calories),
      protein: parseInt(newFood.protein) || 0,
      carbs: parseInt(newFood.carbs) || 0,
      fat: parseInt(newFood.fat) || 0,
      quantity: parseInt(newFood.quantity) || 1,
      unit: newFood.unit
    };

    // Find or create meal
    const updatedMeals = [...nutrition.meals];
    let mealIndex = updatedMeals.findIndex(meal => meal.name === selectedMeal);
    
    if (mealIndex === -1) {
      // Create new meal
      const newMeal: Meal = {
        id: Date.now().toString(),
        name: selectedMeal,
        timestamp: new Date(),
        foods: [foodItem]
      };
      updatedMeals.push(newMeal);
    } else {
      // Add to existing meal
      updatedMeals[mealIndex].foods.push(foodItem);
    }

    // Update nutrition totals
    const updatedNutrition = {
      ...nutrition,
      meals: updatedMeals,
      calories: nutrition.calories + foodItem.calories,
      protein: nutrition.protein + foodItem.protein,
      carbs: nutrition.carbs + foodItem.carbs,
      fat: nutrition.fat + foodItem.fat
    };

    setNutrition(updatedNutrition);
    setShowAddFood(false);
    setNewFood({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      quantity: '1',
      unit: 'serving'
    });
    console.log('Food added successfully');
  };

  const getMealCalories = (meal: Meal) => {
    return meal.foods.reduce((total, food) => total + food.calories, 0);
  };

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={commonStyles.title}>Nutrition</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>

        {/* Daily Overview */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Daily Overview</Text>
          
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

        {/* Meals */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>Meals</Text>
          
          {mealTypes.map((mealType) => {
            const meal = nutrition.meals.find(m => m.name === mealType);
            const calories = meal ? getMealCalories(meal) : 0;
            
            return (
              <View key={mealType} style={[commonStyles.card, styles.mealCard]}>
                <View style={[commonStyles.row, { marginBottom: meal ? 12 : 0 }]}>
                  <View>
                    <Text style={styles.mealName}>{mealType}</Text>
                    <Text style={styles.mealCalories}>{calories} calories</Text>
                  </View>
                  <TouchableOpacity onPress={() => handleAddFood(mealType)}>
                    <Icon name="add-circle" size={24} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                
                {meal && meal.foods.map((food) => (
                  <View key={food.id} style={styles.foodItem}>
                    <View style={styles.foodInfo}>
                      <Text style={styles.foodName}>{food.name}</Text>
                      <Text style={styles.foodDetails}>
                        {food.quantity} {food.unit} • {food.calories} cal
                      </Text>
                    </View>
                    <Text style={styles.foodMacros}>
                      P: {food.protein}g C: {food.carbs}g F: {food.fat}g
                    </Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Food Bottom Sheet */}
      <SimpleBottomSheet
        isVisible={showAddFood}
        onClose={() => setShowAddFood(false)}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetTitle}>Add Food to {selectedMeal}</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Food Name</Text>
            <TextInput
              style={styles.input}
              value={newFood.name}
              onChangeText={(text) => setNewFood({ ...newFood, name: text })}
              placeholder="Enter food name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Calories</Text>
              <TextInput
                style={styles.input}
                value={newFood.calories}
                onChangeText={(text) => setNewFood({ ...newFood, calories: text })}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Quantity</Text>
              <TextInput
                style={styles.input}
                value={newFood.quantity}
                onChangeText={(text) => setNewFood({ ...newFood, quantity: text })}
                placeholder="1"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 4 }]}>
              <Text style={styles.inputLabel}>Protein (g)</Text>
              <TextInput
                style={styles.input}
                value={newFood.protein}
                onChangeText={(text) => setNewFood({ ...newFood, protein: text })}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginHorizontal: 4 }]}>
              <Text style={styles.inputLabel}>Carbs (g)</Text>
              <TextInput
                style={styles.input}
                value={newFood.carbs}
                onChangeText={(text) => setNewFood({ ...newFood, carbs: text })}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 4 }]}>
              <Text style={styles.inputLabel}>Fat (g)</Text>
              <TextInput
                style={styles.input}
                value={newFood.fat}
                onChangeText={(text) => setNewFood({ ...newFood, fat: text })}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveFood}>
            <Text style={styles.saveButtonText}>Add Food</Text>
          </TouchableOpacity>
        </View>
      </SimpleBottomSheet>
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
  nutritionGrid: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  mealCard: {
    marginBottom: 12,
  },
  mealName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  mealCalories: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  foodDetails: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  foodMacros: {
    fontSize: 12,
    color: colors.textSecondary,
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
