import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { getIngredientEmoji } from '../services/recipeService';

export default function RecipeCard({ recipe, onPress }) {
  const getMatchColor = () => {
    if (recipe.matchPercentage >= 75) return colors.success;
    if (recipe.matchPercentage >= 50) return colors.warning;
    return colors.error;
  };

  const displayIngredients = recipe.ingredients.slice(0, 4);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Recipe Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: recipe.image }} 
          style={styles.image}
          defaultSource={require('../assets/icon.png')}
        />
        {recipe.matchPercentage !== undefined && (
          <View style={[styles.matchBadge, { backgroundColor: getMatchColor() }]}>
            <Text style={styles.matchText}>{recipe.matchPercentage}%</Text>
          </View>
        )}
      </View>

      {/* Recipe Details */}
      <View style={styles.content}>
        <Text style={styles.recipeName} numberOfLines={2}>
          {recipe.name}
        </Text>

        {/* Ingredients Icons */}
        <View style={styles.ingredientsRow}>
          {displayIngredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredientEmoji}>
              {getIngredientEmoji(ingredient)}
            </Text>
          ))}
          {recipe.ingredients.length > 4 && (
            <Text style={styles.moreIngredients}>
              +{recipe.ingredients.length - 4}
            </Text>
          )}
        </View>

        {/* Time and Difficulty */}
        <View style={styles.footer}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeIcon}>⏱️</Text>
            <Text style={styles.timeText}>{recipe.time}</Text>
          </View>
          {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
            <View style={styles.missingContainer}>
              <Text style={styles.missingText}>
                Missing: {recipe.missingIngredients.length}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
    backgroundColor: colors.borderLight,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  matchBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  matchText: {
    color: colors.textWhite,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  content: {
    padding: spacing.md,
  },
  recipeName: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: 0.1,
  },
  ingredientsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    flexWrap: 'wrap',
  },
  ingredientEmoji: {
    fontSize: 24,
    marginRight: spacing.xs,
  },
  moreIngredients: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  timeText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  missingContainer: {
    backgroundColor: colors.error + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  missingText: {
    fontSize: fontSize.xs,
    color: colors.error,
    fontWeight: fontWeight.semibold,
  },
});

