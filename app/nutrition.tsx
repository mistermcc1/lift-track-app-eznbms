
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/commonStyles';
import { mockDailyNutrition, mockUserProfile } from '../data/mockData';
import { FoodItem, Meal, AIFoodSuggestion } from '../types';
import NutritionCard from '../components/NutritionCard';
import Icon from '../components/Icon';
import AIFoodInput from '../components/AIFoodInput';

export default function NutritionScreen() {
  const [nutrition, setNutrition] = useState(mockDailyNutrition);
  const [showAIInput, setShowAIInput] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string>('');

  const profile = mockUserProfile;

  const handleAddFood = (mealName: string) => {
    console.log('Adding food to meal:', mealName);
    setSelectedMeal(mealName);
    setShowAIInput(true);
  };

  const handleFoodSelected = (suggestion: AIFoodSuggestion, quantity: number) => {
    console.log('Food selected:', suggestion.name, 'quantity:', quantity);

    // Calculate adjusted macros based on quantity
    const adjustedCalories = Math.round(suggestion.calories * quantity);
    const adjustedProtein = Math.round(suggestion.protein * quantity * 10) / 10;
    const adjustedCarbs = Math.round(suggestion.carbs * quantity * 10) / 10;
    const adjustedFat = Math.round(suggestion.fat * quantity * 10) / 10;

    const foodItem: FoodItem = {
      id: Date.now().toString(),
      name: suggestion.name,
      calories: adjustedCalories,
      protein: adjustedProtein,
      carbs: adjustedCarbs,
      fat: adjustedFat,
      quantity: quantity,
      unit: 'serving'
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
      protein: Math.round((nutrition.protein + foodItem.protein) * 10) / 10,
      carbs: Math.round((nutrition.carbs + foodItem.carbs) * 10) / 10,
      fat: Math.round((nutrition.fat + foodItem.fat) * 10) / 10
    };

    setNutrition(updatedNutrition);
    setShowAIInput(false);
    console.log('Food added successfully with AI assistance');
  };

  const getMealCalories = (meal: Meal) => {
    return meal.foods.reduce((total, food) => total + food.calories, 0);
  };

  const handleRemoveFood = (mealId: string, foodId: string) => {
    console.log('Removing food:', foodId, 'from meal:', mealId);
    
    const updatedMeals = nutrition.meals.map(meal => {
      if (meal.id === mealId) {
        const foodToRemove = meal.foods.find(food => food.id === foodId);
        if (foodToRemove) {
          // Update nutrition totals
          const updatedNutrition = {
            ...nutrition,
            calories: nutrition.calories - foodToRemove.calories,
            protein: Math.round((nutrition.protein - foodToRemove.protein) * 10) / 10,
            carbs: Math.round((nutrition.carbs - foodToRemove.carbs) * 10) / 10,
            fat: Math.round((nutrition.fat - foodToRemove.fat) * 10) / 10
          };
          setNutrition(updatedNutrition);
        }
        
        return {
          ...meal,
          foods: meal.foods.filter(food => food.id !== foodId)
        };
      }
      return meal;
    }).filter(meal => meal.foods.length > 0); // Remove empty meals

    setNutrition(prev => ({
      ...prev,
      meals: updatedMeals
    }));
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
          <View style={styles.aiIndicator}>
            <Icon name="sparkles" size={16} color={colors.secondary} />
            <Text style={styles.aiText}>AI-Powered Tracking</Text>
          </View>
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
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => handleAddFood(mealType)}
                  >
                    <Icon name="sparkles" size={16} color={colors.background} />
                    <Text style={styles.addButtonText}>AI Add</Text>
                  </TouchableOpacity>
                </View>
                
                {meal && meal.foods.map((food) => (
                  <View key={food.id} style={styles.foodItem}>
                    <View style={styles.foodInfo}>
                      <Text style={styles.foodName}>{food.name}</Text>
                      <Text style={styles.foodDetails}>
                        {food.quantity} {food.unit} • {food.calories} cal
                      </Text>
                      <Text style={styles.foodMacros}>
                        P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                      </Text>
                    </View>
                    <TouchableOpacity 
                      onPress={() => handleRemoveFood(meal.id, food.id)}
                      style={styles.removeButton}
                    >
                      <Icon name="close-circle" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            );
          })}
        </View>

        {/* AI Insights */}
        <View style={commonStyles.section}>
          <Text style={commonStyles.subtitle}>AI Insights</Text>
          <View style={[commonStyles.card, styles.insightsCard]}>
            <View style={styles.insightItem}>
              <Icon name="trending-up" size={20} color={colors.secondary} />
              <Text style={styles.insightText}>
                You&apos;re {Math.round(((nutrition.protein / profile.goals.protein) * 100))}% towards your protein goal
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Icon name="lightbulb" size={20} color={colors.accent} />
              <Text style={styles.insightText}>
                Consider adding more vegetables for micronutrients
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Icon name="water" size={20} color={colors.primary} />
              <Text style={styles.insightText}>
                Don&apos;t forget to stay hydrated throughout the day
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* AI Food Input Modal */}
      <Modal
        visible={showAIInput}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AIFoodInput
          mealType={selectedMeal}
          onFoodSelected={handleFoodSelected}
          onClose={() => setShowAIInput(false)}
        />
      </Modal>
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
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: colors.secondaryLight,
    borderRadius: 12,
  },
  aiText: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
    marginLeft: 4,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
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
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
  insightsCard: {
    backgroundColor: colors.surface,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
});
