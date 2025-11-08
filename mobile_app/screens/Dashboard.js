import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { getInventory, testConnection } from '../api';

export default function Dashboard({ navigation }) {
  const [inventory, setInventory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    categories: {},
    lowStock: 0,
    inStock: 0,
    expiring: 0,
  });

  useEffect(() => {
    checkConnection();
    fetchData();
  }, []);

  const checkConnection = async () => {
    try {
      await testConnection();
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getInventory();
      const safeData = Array.isArray(data) ? data : [];
      setInventory(safeData);
      calculateStats(safeData);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setInventory([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await checkConnection();
    await fetchData();
    setRefreshing(false);
  };

  const calculateStats = (data) => {
    if (!Array.isArray(data)) {
      setStats({
        total: 0,
        categories: {},
        lowStock: 0,
        inStock: 0,
        expiring: 0,
      });
      return;
    }

    const categories = {};
    let lowStock = 0;
    let inStock = 0;
    let expiring = 0;

    data.forEach(item => {
      if (!item) return; // Skip invalid items
      
      // Count by category
      const cat = item.category || 'Other';
      categories[cat] = (categories[cat] || 0) + 1;

      // Count by status
      const status = item.status?.toLowerCase() || '';
      const qty = item.quantity || 0;

      if (status.includes('low') || status.includes('expir') || qty <= 2) {
        lowStock++;
        if (status.includes('expir')) expiring++;
      } else {
        inStock++;
      }
    });

    setStats({
      total: data.length,
      categories,
      lowStock,
      inStock,
      expiring,
    });
  };

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Dairy': '🥛',
      'Vegetables': '🥬',
      'Fruits': '🍎',
      'Meat': '🥩',
      'Beverages': '🧃',
      'Bakery': '🍞',
      'Other': '📦',
    };
    return emojiMap[category] || '📦';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
      {/* Header with minimal status */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back! 👋</Text>
          <Text style={styles.subtitle}>Cool inventory • Hot recipes</Text>
        </View>
        <View style={[styles.statusBadge, isConnected ? styles.statusOnline : styles.statusOffline]}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{isConnected ? 'Online' : 'Offline'}</Text>
        </View>
      </View>

      {/* Overview Stats */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: colors.primary + '15' }]}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
          <Text style={[styles.statIcon, { color: colors.primary }]}>📦</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.success + '15' }]}>
          <Text style={styles.statValue}>{stats.inStock}</Text>
          <Text style={styles.statLabel}>In Stock</Text>
          <Text style={[styles.statIcon, { color: colors.success }]}>✅</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.warning + '15' }]}>
          <Text style={styles.statValue}>{stats.lowStock}</Text>
          <Text style={styles.statLabel}>Low Stock</Text>
          <Text style={[styles.statIcon, { color: colors.warning }]}>⚠️</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.error + '15' }]}>
          <Text style={styles.statValue}>{stats.expiring}</Text>
          <Text style={styles.statLabel}>Expiring</Text>
          <Text style={[styles.statIcon, { color: colors.error }]}>⏰</Text>
        </View>
      </View>

      {/* Categories Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoryGrid}>
          {Object.entries(stats.categories).map(([category, count]) => (
            <TouchableOpacity
              key={category}
              style={styles.categoryCard}
              onPress={() => navigation.navigate('Inventory')}
            >
              <Text style={styles.categoryEmoji}>{getCategoryEmoji(category)}</Text>
              <Text style={styles.categoryName}>{category}</Text>
              <Text style={styles.categoryCount}>{count} items</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Inventory')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>📦</Text>
            <Text style={styles.actionText}>View All Items</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.secondary }]}
            onPress={() => navigation.navigate('Recipes')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>🍳</Text>
            <Text style={styles.actionText}>Find Recipes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.accent }]}
            onPress={() => navigation.navigate('Inventory', { screen: 'AddItem' })}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>Add Item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.info }]}
            onPress={() => navigation.navigate('Camera')}
            activeOpacity={0.8}
          >
            <Text style={styles.actionIcon}>📷</Text>
            <Text style={styles.actionText}>Monitor</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Insights</Text>
        
        {stats.expiring > 0 && (
          <View style={[styles.insightCard, { borderLeftColor: colors.error }]}>
            <Text style={styles.insightIcon}>⚠️</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Items Expiring Soon</Text>
              <Text style={styles.insightText}>
                You have {stats.expiring} item{stats.expiring > 1 ? 's' : ''} that need attention
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Inventory')}>
              <Text style={styles.insightAction}>View →</Text>
            </TouchableOpacity>
          </View>
        )}

        {stats.lowStock > 0 && (
          <View style={[styles.insightCard, { borderLeftColor: colors.warning }]}>
            <Text style={styles.insightIcon}>📉</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Low Stock Alert</Text>
              <Text style={styles.insightText}>
                {stats.lowStock} item{stats.lowStock > 1 ? 's are' : ' is'} running low
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Inventory')}>
              <Text style={styles.insightAction}>View →</Text>
            </TouchableOpacity>
          </View>
        )}

        {inventory.length >= 5 && (
          <View style={[styles.insightCard, { borderLeftColor: colors.success }]}>
            <Text style={styles.insightIcon}>🍳</Text>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Ready to Cook</Text>
              <Text style={styles.insightText}>
                Check out recipes you can make with your items
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Recipes')}>
              <Text style={styles.insightAction}>Browse →</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

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
  content: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    gap: spacing.xs,
  },
  statusOnline: {
    backgroundColor: colors.success + '20',
  },
  statusOffline: {
    backgroundColor: colors.error + '20',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'currentColor',
  },
  statusText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.cardSolid,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
    position: 'relative',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  statIcon: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    fontSize: 24,
    opacity: 0.5,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    letterSpacing: 0.2,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    backgroundColor: colors.cardSolid,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    minWidth: '30%',
    flex: 1,
    ...shadows.sm,
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
    letterSpacing: 0.2,
  },
  categoryCount: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    letterSpacing: 0.1,
  },
  actionsContainer: {
    gap: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  actionText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textWhite,
    flex: 1,
    letterSpacing: 0.2,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardSolid,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  insightIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
    letterSpacing: 0.1,
  },
  insightText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  insightAction: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
