
import { AIFoodSuggestion, AIAnalysisResult, NutritionalDatabase } from '../types';

// Mock nutritional database - in a real app, this would be a comprehensive API
const nutritionalDatabase: NutritionalDatabase = {
  'apple': {
    name: 'Apple',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    servingSize: '1 medium (182g)',
    category: 'Fruits',
    aliases: ['red apple', 'green apple', 'granny smith']
  },
  'banana': {
    name: 'Banana',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    servingSize: '1 medium (118g)',
    category: 'Fruits',
    aliases: ['yellow banana', 'ripe banana']
  },
  'chicken_breast': {
    name: 'Chicken Breast',
    calories: 231,
    protein: 43.5,
    carbs: 0,
    fat: 5,
    servingSize: '100g cooked',
    category: 'Protein',
    aliases: ['grilled chicken', 'chicken breast', 'cooked chicken']
  },
  'rice': {
    name: 'White Rice',
    calories: 205,
    protein: 4.3,
    carbs: 45,
    fat: 0.4,
    servingSize: '1 cup cooked (158g)',
    category: 'Grains',
    aliases: ['white rice', 'steamed rice', 'cooked rice']
  },
  'broccoli': {
    name: 'Broccoli',
    calories: 55,
    protein: 3.7,
    carbs: 11,
    fat: 0.6,
    servingSize: '1 cup chopped (91g)',
    category: 'Vegetables',
    aliases: ['green broccoli', 'steamed broccoli']
  },
  'salmon': {
    name: 'Salmon',
    calories: 231,
    protein: 25.4,
    carbs: 0,
    fat: 13.4,
    servingSize: '100g cooked',
    category: 'Protein',
    aliases: ['grilled salmon', 'baked salmon', 'salmon fillet']
  },
  'oatmeal': {
    name: 'Oatmeal',
    calories: 300,
    protein: 10,
    carbs: 54,
    fat: 6,
    servingSize: '1 cup cooked',
    category: 'Grains',
    aliases: ['oats', 'porridge', 'rolled oats']
  },
  'eggs': {
    name: 'Eggs',
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 10.6,
    servingSize: '2 large eggs',
    category: 'Protein',
    aliases: ['scrambled eggs', 'boiled eggs', 'fried eggs']
  },
  'avocado': {
    name: 'Avocado',
    calories: 234,
    protein: 2.9,
    carbs: 12,
    fat: 21,
    servingSize: '1 medium (150g)',
    category: 'Fruits',
    aliases: ['fresh avocado', 'ripe avocado']
  },
  'greek_yogurt': {
    name: 'Greek Yogurt',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0,
    servingSize: '170g container',
    category: 'Dairy',
    aliases: ['plain greek yogurt', 'non-fat greek yogurt']
  }
};

class AINutritionService {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private normalizeText(text: string): string {
    return text.toLowerCase().trim().replace(/[^\w\s]/g, '');
  }

  private findFoodMatches(query: string): AIFoodSuggestion[] {
    const normalizedQuery = this.normalizeText(query);
    const suggestions: AIFoodSuggestion[] = [];

    console.log('Searching for food matches:', normalizedQuery);

    Object.entries(nutritionalDatabase).forEach(([key, food]) => {
      let confidence = 0;
      
      // Direct name match
      if (this.normalizeText(food.name).includes(normalizedQuery)) {
        confidence = 0.9;
      }
      
      // Alias match
      food.aliases.forEach(alias => {
        if (this.normalizeText(alias).includes(normalizedQuery)) {
          confidence = Math.max(confidence, 0.8);
        }
      });

      // Partial match
      if (confidence === 0) {
        const words = normalizedQuery.split(' ');
        words.forEach(word => {
          if (word.length > 2) {
            if (this.normalizeText(food.name).includes(word)) {
              confidence = Math.max(confidence, 0.6);
            }
            food.aliases.forEach(alias => {
              if (this.normalizeText(alias).includes(word)) {
                confidence = Math.max(confidence, 0.5);
              }
            });
          }
        });
      }

      if (confidence > 0.4) {
        suggestions.push({
          id: key,
          name: food.name,
          confidence,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          servingSize: food.servingSize,
          category: food.category
        });
      }
    });

    // Sort by confidence
    return suggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  async analyzeTextInput(description: string): Promise<AIAnalysisResult> {
    console.log('Analyzing text input:', description);
    const startTime = Date.now();
    
    // Simulate AI processing delay
    await this.delay(800);

    const suggestions = this.findFoodMatches(description);
    const processingTime = Date.now() - startTime;

    return {
      suggestions,
      analysisType: 'text',
      confidence: suggestions.length > 0 ? suggestions[0].confidence : 0,
      processingTime
    };
  }

  async analyzeImageInput(imageUri: string): Promise<AIAnalysisResult> {
    console.log('Analyzing image input:', imageUri);
    const startTime = Date.now();
    
    // Simulate AI image processing delay
    await this.delay(1500);

    // Mock image recognition - in reality, this would use computer vision
    const mockDetectedFoods = ['chicken breast', 'rice', 'broccoli'];
    const allSuggestions: AIFoodSuggestion[] = [];

    for (const food of mockDetectedFoods) {
      const matches = this.findFoodMatches(food);
      allSuggestions.push(...matches);
    }

    // Remove duplicates and limit results
    const uniqueSuggestions = allSuggestions.filter((suggestion, index, self) => 
      index === self.findIndex(s => s.id === suggestion.id)
    ).slice(0, 3);

    const processingTime = Date.now() - startTime;

    return {
      suggestions: uniqueSuggestions,
      analysisType: 'image',
      confidence: uniqueSuggestions.length > 0 ? 0.85 : 0,
      processingTime
    };
  }

  async getSmartSuggestions(mealType: string, timeOfDay: number): Promise<AIFoodSuggestion[]> {
    console.log('Getting smart suggestions for:', mealType, 'at hour:', timeOfDay);
    
    // Simulate processing
    await this.delay(300);

    let suggestedFoods: string[] = [];

    switch (mealType.toLowerCase()) {
      case 'breakfast':
        suggestedFoods = ['oatmeal', 'eggs', 'banana', 'greek_yogurt'];
        break;
      case 'lunch':
        suggestedFoods = ['chicken_breast', 'rice', 'broccoli', 'salmon'];
        break;
      case 'dinner':
        suggestedFoods = ['salmon', 'chicken_breast', 'broccoli', 'rice'];
        break;
      case 'snacks':
        suggestedFoods = ['apple', 'banana', 'greek_yogurt', 'avocado'];
        break;
      default:
        suggestedFoods = ['apple', 'banana', 'chicken_breast'];
    }

    const suggestions: AIFoodSuggestion[] = [];
    suggestedFoods.forEach(foodKey => {
      const food = nutritionalDatabase[foodKey];
      if (food) {
        suggestions.push({
          id: foodKey,
          name: food.name,
          confidence: 0.8,
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          servingSize: food.servingSize,
          category: food.category
        });
      }
    });

    return suggestions;
  }

  async searchFoodDatabase(query: string): Promise<AIFoodSuggestion[]> {
    console.log('Searching food database:', query);
    
    if (query.length < 2) {
      return [];
    }

    await this.delay(200);
    return this.findFoodMatches(query);
  }
}

export const aiNutritionService = new AINutritionService();
