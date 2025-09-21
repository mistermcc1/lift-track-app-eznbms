
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { colors, commonStyles } from '../styles/commonStyles';
import { AIFoodSuggestion, AIAnalysisResult } from '../types';
import { aiNutritionService } from '../services/aiNutritionService';
import Icon from './Icon';
import * as ImagePicker from 'expo-image-picker';

interface AIFoodInputProps {
  mealType: string;
  onFoodSelected: (suggestion: AIFoodSuggestion, quantity: number) => void;
  onClose: () => void;
}

export default function AIFoodInput({ mealType, onFoodSelected, onClose }: AIFoodInputProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AIFoodSuggestion[]>([]);
  const [smartSuggestions, setSmartSuggestions] = useState<AIFoodSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AIFoodSuggestion | null>(null);
  const [quantity, setQuantity] = useState('1');

  useEffect(() => {
    loadSmartSuggestions();
  }, [mealType]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchFoods();
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const loadSmartSuggestions = async () => {
    try {
      const currentHour = new Date().getHours();
      const suggestions = await aiNutritionService.getSmartSuggestions(mealType, currentHour);
      setSmartSuggestions(suggestions);
      console.log('Loaded smart suggestions:', suggestions.length);
    } catch (error) {
      console.log('Error loading smart suggestions:', error);
    }
  };

  const searchFoods = async () => {
    try {
      const results = await aiNutritionService.searchFoodDatabase(searchQuery);
      setSuggestions(results);
      console.log('Search results:', results.length);
    } catch (error) {
      console.log('Error searching foods:', error);
    }
  };

  const analyzeText = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a food description');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await aiNutritionService.analyzeTextInput(searchQuery);
      setAnalysisResult(result);
      console.log('AI analysis result:', result);
    } catch (error) {
      console.log('Error analyzing text:', error);
      Alert.alert('Error', 'Failed to analyze food description');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to analyze food images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsAnalyzing(true);
        try {
          const analysisResult = await aiNutritionService.analyzeImageInput(result.assets[0].uri);
          setAnalysisResult(analysisResult);
          console.log('Image analysis result:', analysisResult);
        } catch (error) {
          console.log('Error analyzing image:', error);
          Alert.alert('Error', 'Failed to analyze food image');
        } finally {
          setIsAnalyzing(false);
        }
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSuggestionSelect = (suggestion: AIFoodSuggestion) => {
    setSelectedSuggestion(suggestion);
    console.log('Selected suggestion:', suggestion.name);
  };

  const handleAddFood = () => {
    if (!selectedSuggestion) {
      Alert.alert('Error', 'Please select a food item');
      return;
    }

    const qty = parseFloat(quantity) || 1;
    onFoodSelected(selectedSuggestion, qty);
    console.log('Adding food:', selectedSuggestion.name, 'quantity:', qty);
  };

  const renderSuggestion = (suggestion: AIFoodSuggestion, isSelected: boolean = false) => (
    <TouchableOpacity
      key={suggestion.id}
      style={[styles.suggestionCard, isSelected && styles.selectedSuggestion]}
      onPress={() => handleSuggestionSelect(suggestion)}
    >
      <View style={styles.suggestionHeader}>
        <Text style={styles.suggestionName}>{suggestion.name}</Text>
        {suggestion.confidence && (
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>
              {Math.round(suggestion.confidence * 100)}%
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.suggestionServing}>{suggestion.servingSize}</Text>
      <View style={styles.macroRow}>
        <Text style={styles.macroText}>{suggestion.calories} cal</Text>
        <Text style={styles.macroText}>P: {suggestion.protein}g</Text>
        <Text style={styles.macroText}>C: {suggestion.carbs}g</Text>
        <Text style={styles.macroText}>F: {suggestion.fat}g</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Food to {mealType}</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* AI Input Methods */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Describe Your Food</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="e.g., grilled chicken with rice"
            placeholderTextColor={colors.textSecondary}
          />
          <TouchableOpacity 
            style={styles.aiButton} 
            onPress={analyzeText}
            disabled={isAnalyzing}
          >
            <Icon 
              name={isAnalyzing ? "hourglass" : "sparkles"} 
              size={20} 
              color={colors.background} 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.imageButton} 
          onPress={analyzeImage}
          disabled={isAnalyzing}
        >
          <Icon name="camera" size={20} color={colors.primary} />
          <Text style={styles.imageButtonText}>
            {isAnalyzing ? 'Analyzing...' : 'Take Photo or Choose from Gallery'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* AI Analysis Results */}
        {analysisResult && analysisResult.suggestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              AI Suggestions ({analysisResult.analysisType === 'image' ? 'From Image' : 'From Text'})
            </Text>
            {analysisResult.suggestions.map(suggestion => 
              renderSuggestion(suggestion, selectedSuggestion?.id === suggestion.id)
            )}
          </View>
        )}

        {/* Search Results */}
        {suggestions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            {suggestions.map(suggestion => 
              renderSuggestion(suggestion, selectedSuggestion?.id === suggestion.id)
            )}
          </View>
        )}

        {/* Smart Suggestions */}
        {smartSuggestions.length > 0 && !analysisResult && suggestions.length === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested for {mealType}</Text>
            {smartSuggestions.map(suggestion => 
              renderSuggestion(suggestion, selectedSuggestion?.id === suggestion.id)
            )}
          </View>
        )}
      </ScrollView>

      {/* Selected Food Details */}
      {selectedSuggestion && (
        <View style={styles.selectedFoodSection}>
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="1"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.quantityUnit}>servings</Text>
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddFood}>
            <Text style={styles.addButtonText}>Add to {mealType}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  inputSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  aiButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  imageButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  suggestionCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedSuggestion: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    color: colors.background,
    fontWeight: '500',
  },
  suggestionServing: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  selectedFoodSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  quantitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginRight: 12,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: colors.text,
    width: 80,
    textAlign: 'center',
    marginRight: 8,
  },
  quantityUnit: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
