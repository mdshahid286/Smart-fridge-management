import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Image,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { getInventory } from '../api';
import { getRecommendedRecipes, getAllRecipes, getIngredientEmoji } from '../services/recipeService';
import RecipeCard from '../components/RecipeCard';

export default function Recipes({ navigation }) {
  const [inventory, setInventory] = useState([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showAllRecipes, setShowAllRecipes] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const items = await getInventory();
      const safeItems = Array.isArray(items) ? items : [];
      setInventory(safeItems);
      
      const recommended = getRecommendedRecipes(safeItems, 30);
      setRecommendedRecipes(Array.isArray(recommended) ? recommended : []);

      const all = getAllRecipes(safeItems);
      setAllRecipes(Array.isArray(all) ? all : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setInventory([]);
      setRecommendedRecipes([]);
      setAllRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const getInventoryStatusColor = (item) => {
    const quantity = typeof item === 'object' ? item.quantity : 1;
    const status = typeof item === 'object' ? item.status?.toLowerCase() : '';

    if (status.includes('low') || status.includes('expir') || quantity <= 2) {
      return colors.error;
    }
    if (quantity <= 5 || status.includes('warning')) {
      return colors.warning;
    }
    return colors.success;
  };

  const renderInventoryItem = (item, index) => {
    if (!item) return null;
    const name = typeof item === 'object' ? (item.name || 'Unknown') : (item || 'Unknown');
    const quantity = typeof item === 'object' ? (item.quantity || 0) : 1;
    const statusColor = getInventoryStatusColor(item);

    return (
      <View key={index} style={styles.inventoryItem}>
        <Text style={styles.inventoryEmoji}>{getIngredientEmoji(name)}</Text>
        <View style={styles.inventoryInfo}>
          <Text style={styles.inventoryName}>{name}</Text>
          <Text style={styles.inventoryQuantity}>
            {typeof item === 'object' && item.quantity 
              ? `${quantity} ${quantity === 1 ? 'unit' : 'units'}`
              : 'Available'}
          </Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>
    );
  };

  const RecipeDetailsModal = () => {
    if (!selectedRecipe) return null;

    return (
      <Modal
        visible={!!selectedRecipe}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedRecipe(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              {/* Recipe Image */}
              {selectedRecipe.image ? (
                <Image 
                  source={{ uri: selectedRecipe.image }} 
                  style={styles.modalImage}
                  onError={() => console.warn('Failed to load recipe image')}
                />
              ) : (
                <View style={[styles.modalImage, { backgroundColor: colors.borderLight, justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={{ fontSize: 64 }}>🍳</Text>
                </View>
              )}

              {/* Close Button */}
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedRecipe(null)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>

              {/* Recipe Details */}
              <View style={styles.modalDetails}>
                <Text style={styles.modalTitle}>{selectedRecipe.name || 'Unknown Recipe'}</Text>

                {/* Match Badge */}
                {selectedRecipe.matchPercentage !== undefined && (
                  <View style={styles.modalMatchBadge}>
                    <Text style={styles.modalMatchText}>
                      {selectedRecipe.matchPercentage}% Match
                    </Text>
                  </View>
                )}

                {/* Info Row */}
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>⏱️ Time</Text>
                    <Text style={styles.infoValue}>{selectedRecipe.time || 'N/A'}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>📊 Difficulty</Text>
                    <Text style={styles.infoValue}>{selectedRecipe.difficulty || 'N/A'}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>🔥 Calories</Text>
                    <Text style={styles.infoValue}>{selectedRecipe.calories || 'N/A'}</Text>
                  </View>
                </View>

                {/* Ingredients */}
                <Text style={styles.sectionTitle}>Ingredients</Text>
                <View style={styles.ingredientsList}>
                  {Array.isArray(selectedRecipe.ingredients) && selectedRecipe.ingredients.length > 0 ? (
                    selectedRecipe.ingredients.map((ingredient, index) => {
                      const isAvailable = !selectedRecipe.missingIngredients?.includes(ingredient);
                      return (
                        <View key={index} style={styles.ingredientItem}>
                          <Text style={styles.ingredientItemEmoji}>
                            {getIngredientEmoji(ingredient || '')}
                          </Text>
                          <Text style={[
                            styles.ingredientItemText,
                            !isAvailable && styles.missingIngredient
                          ]}>
                            {ingredient || 'Unknown'}
                          </Text>
                          {!isAvailable && (
                            <Text style={styles.missingTag}>Missing</Text>
                          )}
                        </View>
                      );
                    })
                  ) : (
                    <Text style={styles.emptyText}>No ingredients listed</Text>
                  )}
                </View>

                {/* Instructions */}
                <Text style={styles.sectionTitle}>Instructions</Text>
                <View style={styles.instructionsList}>
                  {Array.isArray(selectedRecipe.instructions) && selectedRecipe.instructions.length > 0 ? (
                    selectedRecipe.instructions.map((instruction, index) => (
                      <View key={index} style={styles.instructionItem}>
                        <View style={styles.instructionNumber}>
                          <Text style={styles.instructionNumberText}>{index + 1}</Text>
                        </View>
                        <Text style={styles.instructionText}>{instruction || 'No instruction'}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.emptyText}>No instructions available</Text>
                  )}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading recipes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🍳 Recipe Recommendations</Text>
        <Text style={styles.subtitle}>
          Based on your available ingredients
        </Text>
      </View>

      {/* Inventory Summary Card */}
      <View style={styles.inventoryCard}>
        <View style={styles.inventoryHeader}>
          <Text style={styles.inventoryTitle}>Your Inventory</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Inventory')}>
            <Text style={styles.viewInventoryButton}>View All →</Text>
          </TouchableOpacity>
        </View>

        {inventory.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.inventoryScroll}
          >
            {inventory.slice(0, 8).map((item, index) => {
              if (!item) return null;
              const itemName = typeof item === 'object' ? (item.name || 'Unknown') : (item || 'Unknown');
              return (
                <View key={index} style={styles.inventoryChip}>
                  <Text style={styles.inventoryChipEmoji}>
                    {getIngredientEmoji(itemName)}
                  </Text>
                  <Text style={styles.inventoryChipText}>
                    {itemName}
                  </Text>
                  <View style={[
                    styles.inventoryChipDot,
                    { backgroundColor: getInventoryStatusColor(item) }
                  ]} />
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <Text style={styles.emptyInventory}>
            No items in inventory. Add items to get recommendations!
          </Text>
        )}
      </View>

      {/* Recommended Recipes */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitleText}>Recommended for You</Text>
          <Text style={styles.recipeCount}>
            {recommendedRecipes.length} recipes
          </Text>
        </View>

        {recommendedRecipes.length > 0 ? (
          <>
            {recommendedRecipes.map((recipe) => {
              if (!recipe || !recipe.id) return null;
              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onPress={() => setSelectedRecipe(recipe)}
                />
              );
            })}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>No Matches Found</Text>
            <Text style={styles.emptyMessage}>
              Add more items to your inventory to get personalized recipe recommendations
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => setShowAllRecipes(true)}
            >
              <Text style={styles.browseButtonText}>Browse All Recipes</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* All Recipes Section (collapsed by default) */}
      {showAllRecipes && (
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitleText}>All Recipes</Text>
            <TouchableOpacity onPress={() => setShowAllRecipes(false)}>
              <Text style={styles.hideButton}>Hide ▲</Text>
            </TouchableOpacity>
          </View>

          {allRecipes.map((recipe) => {
            if (!recipe || !recipe.id) return null;
            return (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => setSelectedRecipe(recipe)}
              />
            );
          })}
        </View>
      )}

      {!showAllRecipes && recommendedRecipes.length > 0 && (
        <TouchableOpacity
          style={styles.showAllButton}
          onPress={() => setShowAllRecipes(true)}
        >
          <Text style={styles.showAllButtonText}>
            Show All Recipes ({allRecipes.length})
          </Text>
        </TouchableOpacity>
      )}

      {/* Recipe Details Modal */}
      <RecipeDetailsModal />

      {/* Bottom Spacer for Tab Bar */}
      <View style={{ height: 130 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
  },
  emptyText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.md,
  },
  scrollContent: {
    paddingBottom: 130,
  },
  content: {
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.2,
  },
  inventoryCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  inventoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  inventoryTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  viewInventoryButton: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  inventoryScroll: {
    marginTop: spacing.sm,
  },
  inventoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  inventoryChipEmoji: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  inventoryChipText: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
    marginRight: spacing.xs,
  },
  inventoryChipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyInventory: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitleText: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  recipeCount: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  emptyState: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    ...shadows.sm,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyMessage: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  browseButtonText: {
    color: colors.textWhite,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  showAllButton: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  showAllButtonText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  hideButton: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '90%',
  },
  modalImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.card,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  closeButtonText: {
    fontSize: fontSize.xl,
    color: colors.textPrimary,
    fontWeight: fontWeight.bold,
  },
  modalDetails: {
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },
  modalMatchBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  modalMatchText: {
    color: colors.textWhite,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: fontWeight.semibold,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    letterSpacing: 0.2,
  },
  ingredientsList: {
    marginBottom: spacing.md,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  ingredientItemEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  ingredientItemText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  missingIngredient: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  missingTag: {
    fontSize: fontSize.xs,
    color: colors.error,
    backgroundColor: colors.error + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    fontWeight: fontWeight.semibold,
  },
  instructionsList: {
    marginBottom: spacing.lg,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  instructionNumberText: {
    color: colors.textWhite,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  instructionText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  inventoryEmoji: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  inventoryInfo: {
    flex: 1,
  },
  inventoryName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  inventoryQuantity: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

