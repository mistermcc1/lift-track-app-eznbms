
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#007AFF',
  primaryLight: '#E3F2FD',
  secondary: '#34C759',
  secondaryLight: '#E8F5E8',
  accent: '#FF9500',
  warning: '#FF3B30',
  error: '#FF3B30',
  success: '#34C759',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  border: '#E5E5EA',
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  } as ViewStyle,
  
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  } as ViewStyle,
  
  card: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  } as TextStyle,
  
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  } as TextStyle,
  
  body: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  } as TextStyle,
  
  caption: {
    fontSize: 12,
    color: colors.textSecondary,
  } as TextStyle,
  
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  } as ViewStyle,
  
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
  
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  } as ViewStyle,
  
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
});
