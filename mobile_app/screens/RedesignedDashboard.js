import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import StatCard from '../components/StatCard';
import ItemCard from '../components/ItemCard';
import EmptyState from '../components/EmptyState';
import { getInventory, testConnection } from '../api';

export default function RedesignedDashboard({ navigation }) {
  const [inventory, setInventory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    detected: 0,
  });
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    checkConnection();
    fetchData();
  }, []);

  const checkConnection = async () => {
    try {
      await testConnection();
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('disconnected');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getInventory();
      setInventory(data);
      calculateStats(data);
      setLastUpdate(new Date());
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setConnectionStatus('disconnected');
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
    setStats({
      total: data.length,
      lowStock: data.filter((item) =>
        item.status?.toLowerCase().includes('low')
      ).length,
      detected: data.filter((item) =>
        item.status?.toLowerCase().includes('detected')
      ).length,
    });
  };

  const recentItems = inventory.slice(0, 5);

  const getStatusColor = () => {
    if (connectionStatus === 'connected') return colors.success;
    if (connectionStatus === 'disconnected') return colors.error;
    return colors.textSecondary;
  };

  const getStatusText = () => {
    if (connectionStatus === 'connected') return '● Online';
    if (connectionStatus === 'disconnected') return '● Offline';
    return '● Checking...';
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Status Banner */}
      <View style={[styles.statusBanner, { backgroundColor: getStatusColor() + '20' }]}>
        <View style={styles.statusContent}>
          <Text style={styles.statusIcon}>📡</Text>
          <View style={styles.statusTextContainer}>
            <Text style={[styles.statusLabel, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
            <Text style={styles.statusSubtext}>
              {connectionStatus === 'connected'
                ? 'ESP32-CAM connected and monitoring'
                : 'Unable to reach backend server'}
            </Text>
          </View>
        </View>
        {lastUpdate && (
          <Text style={styles.lastUpdate}>
            Last update: {lastUpdate.toLocaleTimeString()}
          </Text>
        )}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Your Smart Fridge 🧊</Text>
        <Text style={styles.subtitle}>
          Automatically detected by ESP32-CAM
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading inventory...</Text>
        </View>
      ) : (
        <>
          {/* Statistics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            
            <StatCard
              icon="📦"
              title="Total Items Detected"
              value={stats.total}
              color={colors.primary}
              subtitle="Automatically scanned"
            />

            <View style={styles.statRow}>
              <View style={styles.statHalf}>
                <View style={[styles.miniCard, { borderLeftColor: colors.warning, borderLeftWidth: 4 }]}>
                  <Text style={styles.miniCardValue}>{stats.lowStock}</Text>
                  <Text style={styles.miniCardLabel}>Low Stock</Text>
                  <Text style={styles.miniCardSubtext}>Need attention</Text>
                </View>
              </View>

              <View style={styles.statHalf}>
                <View style={[styles.miniCard, { borderLeftColor: colors.info, borderLeftWidth: 4 }]}>
                  <Text style={styles.miniCardValue}>{stats.detected}</Text>
                  <Text style={styles.miniCardLabel}>Recently Added</Text>
                  <Text style={styles.miniCardSubtext}>By ESP32-CAM</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ESP32 Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ESP32-CAM Status</Text>
            <View style={styles.esp32Card}>
              <View style={styles.esp32Header}>
                <Text style={styles.esp32Icon}>📷</Text>
                <View style={styles.esp32Info}>
                  <Text style={styles.esp32Title}>Camera Module</Text>
                  <Text style={styles.esp32Status}>
                    {connectionStatus === 'connected' ? 'Active & Monitoring' : 'Offline'}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.monitorButton}
                  onPress={() => navigation.navigate('Camera')}
                >
                  <Text style={styles.monitorButtonText}>View</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.esp32Details}>
                <Text style={styles.esp32DetailText}>
                  ✓ Automatic image capture every 10 seconds
                </Text>
                <Text style={styles.esp32DetailText}>
                  ✓ Real-time object detection with YOLO
                </Text>
                <Text style={styles.esp32DetailText}>
                  ✓ Instant inventory updates
                </Text>
              </View>
            </View>
          </View>

          {/* Recent Detections */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Detections</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Inventory')}>
                <Text style={styles.seeAll}>See All →</Text>
              </TouchableOpacity>
            </View>

            {recentItems.length > 0 ? (
              <>
                {recentItems.map((item, index) => (
                  <ItemCard
                    key={index}
                    item={item}
                    onPress={() => navigation.navigate('Inventory', {
                      screen: 'EditItem',
                      params: { item }
                    })}
                  />
                ))}
              </>
            ) : (
              <EmptyState
                icon="📸"
                title="No Items Detected Yet"
                message="ESP32-CAM is monitoring your fridge. Items will appear here automatically."
                actionLabel="Check Camera"
                onAction={() => navigation.navigate('Camera')}
              />
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: colors.primary + '15' }]}
                onPress={() => navigation.navigate('Inventory')}
              >
                <Text style={styles.actionIcon}>📦</Text>
                <Text style={styles.actionText}>Manage Inventory</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionCard, { backgroundColor: colors.secondary + '15' }]}
                onPress={() => navigation.navigate('Inventory', { screen: 'AddItem' })}
              >
                <Text style={styles.actionIcon}>➕</Text>
                <Text style={styles.actionText}>Add Manual Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {/* Bottom Spacer for Tab Bar */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  statusBanner: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  statusSubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  lastUpdate: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  greeting: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  loadingContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  seeAll: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statHalf: {
    flex: 1,
  },
  miniCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.md,
  },
  miniCardValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  miniCardLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  miniCardSubtext: {
    fontSize: fontSize.xs,
    color: colors.textDisabled,
    marginTop: 2,
  },
  esp32Card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
  esp32Header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  esp32Icon: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  esp32Info: {
    flex: 1,
  },
  esp32Title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  esp32Status: {
    fontSize: fontSize.sm,
    color: colors.success,
    marginTop: 2,
  },
  monitorButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  monitorButtonText: {
    color: colors.textWhite,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  esp32Details: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  esp32DetailText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  actionIcon: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  actionText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});

