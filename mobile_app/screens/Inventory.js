import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput,
  SafeAreaView,
} from "react-native";
import { getInventory } from "../api";
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from "../theme";
import { getIngredientEmoji } from "../services/recipeService";

export default function Inventory({ navigation }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      console.log("📦 Fetching inventory...");
      const data = await getInventory();
      // Ensure data is an array
      const safeData = Array.isArray(data) ? data : [];
      console.log("✅ Inventory loaded:", safeData.length, "items");
      if (safeData.length > 0) {
        console.log("📋 First item:", safeData[0]);
      }
      setItems(safeData);
      setFilteredItems(safeData);
    } catch (error) {
      console.error("❌ Error fetching inventory:", error);
      console.error("Error details:", error?.message || 'Unknown error');
      // Set empty arrays on error
      setItems([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load data on initial mount
    fetchInventory();
    
    // Also load when screen comes into focus
    const unsubscribe = navigation.addListener("focus", () => {
      fetchInventory();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    filterItems();
  }, [searchQuery, selectedCategory, items]);

  const filterItems = () => {
    // Ensure items is an array
    let filtered = Array.isArray(items) ? items : [];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => 
        (item?.category || 'Other') === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery && searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const getCategories = () => {
    if (!Array.isArray(items) || items.length === 0) {
      return ['All'];
    }
    const cats = ['All', ...new Set(items.map(item => item?.category || 'Other'))];
    return cats;
  };

  const getStatusColor = (item) => {
    if (!item) return colors.textSecondary;
    const quantity = item.quantity || 0;
    const status = item.status?.toLowerCase() || '';

    if (status.includes('low') || status.includes('expir') || quantity <= 2) {
      return colors.error;
    }
    if (quantity <= 5 || status.includes('warning')) {
      return colors.warning;
    }
    return colors.success;
  };

  const getQuantityDisplay = (item) => {
    if (!item) return '0 units';
    const qty = item.quantity || 0;
    const name = (item.name || '').toLowerCase();

    if (name.includes('milk') || name.includes('juice') || name.includes('yogurt')) {
      return qty > 1 ? `${qty} bottles` : `${qty} bottle`;
    }
    if (name.includes('lettuce') || name.includes('cabbage')) {
      return qty > 1 ? `${qty} heads` : `${qty} head`;
    }
    if (name.includes('chicken') || name.includes('beef') || name.includes('fish')) {
      return qty > 1 ? `${qty} pieces` : `${qty} piece`;
    }
    return `${qty} ${qty === 1 ? 'unit' : 'units'}`;
  };

  const renderItem = ({ item, index }) => {
    if (!item || !item.name) {
      return null; // Skip invalid items
    }
    console.log(`Rendering item ${index}:`, item.name);
    return (
      <TouchableOpacity
        style={styles.itemCard}
        onPress={() => {
          console.log("Tapped item:", item.name);
          navigation.navigate("EditItem", { item });
        }}
        activeOpacity={0.7}
      >
        <View style={styles.itemIcon}>
          <Text style={styles.itemEmoji}>{getIngredientEmoji(item.name || '')}</Text>
        </View>
        
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name || 'Unknown'}</Text>
          <Text style={styles.itemQuantity}>{getQuantityDisplay(item)}</Text>
          <Text style={styles.itemCategory}>{item.category || 'Other'}</Text>
        </View>

        <View style={styles.itemRight}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item) }]} />
          <Text style={styles.editIcon}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  console.log("🔍 Rendering Inventory with", filteredItems.length, "filtered items");
  console.log("📊 Total items:", items.length);
  console.log("🔎 Search query:", searchQuery);
  console.log("🏷️ Selected category:", selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          placeholderTextColor={colors.textDisabled}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={getCategories()}
          keyExtractor={(cat) => cat}
          renderItem={({ item: cat }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === cat && styles.categoryChipTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Items Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
          {searchQuery && ` matching "${searchQuery}"`}
        </Text>
      </View>

      {/* Items List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading inventory...</Text>
        </View>
      ) : filteredItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>No items found</Text>
          <Text style={styles.emptyText}>
            {searchQuery 
              ? `No items matching "${searchQuery}"`
              : 'Your inventory is empty. Add some items to get started!'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddItem")}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardSolid,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.textPrimary,
  },
  clearIcon: {
    fontSize: 20,
    color: colors.textDisabled,
    padding: spacing.sm,
  },
  categoriesContainer: {
    marginBottom: spacing.sm,
  },
  categoriesList: {
    paddingHorizontal: spacing.lg,
  },
  categoryChip: {
    backgroundColor: colors.cardSolid,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.round,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  categoryChipText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: colors.textWhite,
  },
  countContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  countText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 130, // Space for floating button + tab bar
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardSolid,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  itemEmoji: {
    fontSize: 28,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  itemQuantity: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 2,
    fontWeight: fontWeight.medium,
  },
  itemCategory: {
    fontSize: fontSize.xs,
    color: colors.textDisabled,
    fontWeight: fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  itemRight: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  editIcon: {
    fontSize: 24,
    color: colors.textDisabled,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  addButton: {
    position: 'absolute',
    right: spacing.lg,
    bottom: 90, // Above tab bar with safe spacing
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  addButtonIcon: {
    fontSize: 28,
    color: colors.textWhite,
    fontWeight: fontWeight.bold,
  },
});
