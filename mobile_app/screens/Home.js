import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from "../theme";
import { getInventory, testConnection, API_URL } from "../api";

export default function Home({ navigation }) {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [refreshing, setRefreshing] = useState(false);
  const [lastCapture, setLastCapture] = useState(null);
  const [detectedItems, setDetectedItems] = useState([]);
  const [captureStats, setCaptureStats] = useState({
    total: 0,
    today: 0,
    lastDetection: null,
  });

  useEffect(() => {
    checkConnection();
    fetchRecentData();
  }, []);

  const checkConnection = async () => {
    try {
      await testConnection();
      setConnectionStatus('connected');
    } catch (error) {
      setConnectionStatus('disconnected');
    }
  };

  const fetchRecentData = async () => {
    try {
      const items = await getInventory();
      setDetectedItems(items.slice(0, 8));
      setCaptureStats({
        total: items.length,
        today: items.filter((item) => item.status?.includes('Detected')).length,
        lastDetection: items.length > 0 ? new Date() : null,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await checkConnection();
    await fetchRecentData();
    setRefreshing(false);
  };

  const getStatusIcon = () => {
    if (connectionStatus === 'connected') return '✅';
    if (connectionStatus === 'disconnected') return '❌';
    return '🔄';
  };

  const getStatusText = () => {
    if (connectionStatus === 'connected') return 'ESP32-CAM Active';
    if (connectionStatus === 'disconnected') return 'ESP32-CAM Offline';
    return 'Checking Connection...';
  };

  const getStatusColor = () => {
    if (connectionStatus === 'connected') return colors.success;
    if (connectionStatus === 'disconnected') return colors.error;
    return colors.warning;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📷 ESP32-CAM Monitor</Text>
        <Text style={styles.subtitle}>Real-time fridge monitoring</Text>
      </View>

      {/* Connection Status - Minimal */}
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, connectionStatus === 'connected' ? styles.statusOnline : styles.statusOffline]}>
          <View style={styles.statusDot} />
          <Text style={styles.statusBadgeText}>
            {connectionStatus === 'connected' ? 'ESP32 Online' : 'Offline'}
          </Text>
        </View>
        <Text style={styles.statusHint}>
          {connectionStatus === 'connected'
            ? 'Capturing every 10 seconds'
            : 'Check backend connection'}
        </Text>
      </View>

      {/* Capture Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Capture Statistics</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{captureStats.total}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
            <Text style={styles.statSubtext}>All time</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{captureStats.today}</Text>
            <Text style={styles.statLabel}>Recently Added</Text>
            <Text style={styles.statSubtext}>Auto-detected</Text>
          </View>
        </View>

        {captureStats.lastDetection && (
          <View style={styles.lastCaptureInfo}>
            <Text style={styles.lastCaptureText}>
              🕐 Last detection: {captureStats.lastDetection.toLocaleTimeString()}
            </Text>
          </View>
        )}
      </View>

      {/* How It Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔄 How It Works</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoStep}>
            <Text style={styles.stepNumber}>1</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>ESP32-CAM Captures</Text>
              <Text style={styles.stepDescription}>
                Camera automatically takes photos every 10 seconds
              </Text>
            </View>
          </View>

          <View style={styles.infoStep}>
            <Text style={styles.stepNumber}>2</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>YOLO Detection</Text>
              <Text style={styles.stepDescription}>
                AI model identifies food items in real-time
              </Text>
            </View>
          </View>

          <View style={styles.infoStep}>
            <Text style={styles.stepNumber}>3</Text>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Inventory Updated</Text>
              <Text style={styles.stepDescription}>
                Detected items instantly appear in your inventory
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recently Detected Items */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>🆕 Recently Detected</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Inventory')}>
            <Text style={styles.viewAllButton}>View All →</Text>
          </TouchableOpacity>
        </View>

        {detectedItems.length > 0 ? (
          <View style={styles.itemsList}>
            {detectedItems.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={styles.itemIcon}>📦</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>
                    {typeof item === 'object' ? item.name : item}
                  </Text>
                  <Text style={styles.itemStatus}>
                    {typeof item === 'object' ? item.status : 'Detected'}
                  </Text>
                </View>
                <Text style={styles.itemQuantity}>
                  {typeof item === 'object' ? `×${item.quantity}` : '×1'}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📸</Text>
            <Text style={styles.emptyTitle}>No items detected yet</Text>
            <Text style={styles.emptyMessage}>
              ESP32-CAM will automatically detect and add items to your inventory
            </Text>
          </View>
        )}
      </View>

      {/* Camera Settings Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Camera Settings</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Capture Interval:</Text>
            <Text style={styles.settingValue}>10 seconds</Text>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Image Quality:</Text>
            <Text style={styles.settingValue}>QVGA (320×240)</Text>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Detection Model:</Text>
            <Text style={styles.settingValue}>YOLOv8n</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.settingsButtonText}>
            Configure Settings →
          </Text>
        </TouchableOpacity>
      </View>

      {/* Troubleshooting */}
      {connectionStatus === 'disconnected' && (
        <View style={styles.section}>
          <View style={styles.troubleshootCard}>
            <Text style={styles.troubleshootTitle}>⚠️ Troubleshooting</Text>
            <Text style={styles.troubleshootText}>
              • Check if Flask backend is running
            </Text>
            <Text style={styles.troubleshootText}>
              • Verify ESP32-CAM is connected to WiFi
            </Text>
            <Text style={styles.troubleshootText}>
              • Ensure all devices are on the same network
            </Text>
            <Text style={styles.troubleshootText}>
              • Check firewall settings
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={onRefresh}
            >
              <Text style={styles.retryButtonText}>🔄 Retry Connection</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom Spacer for Tab Bar */}
      <View style={{ height: 130 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
  },
  content: {
    padding: spacing.lg,
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
  statusContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.round,
    gap: spacing.sm,
  },
  statusOnline: {
    backgroundColor: colors.success + '20',
  },
  statusOffline: {
    backgroundColor: colors.error + '20',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'currentColor',
  },
  statusBadgeText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  statusHint: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    letterSpacing: 0.2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  viewAllButton: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  statValue: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  statSubtext: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  lastCaptureInfo: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  lastCaptureText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  infoStep: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    color: colors.textWhite,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    lineHeight: 32,
    marginRight: spacing.md,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  stepDescription: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemsList: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    ...shadows.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  itemIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textPrimary,
  },
  itemStatus: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemQuantity: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primary,
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
  },
  settingsCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  settingLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  settingValue: {
    fontSize: fontSize.sm,
    color: colors.textPrimary,
    fontWeight: fontWeight.medium,
  },
  settingsButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: colors.textWhite,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  troubleshootCard: {
    backgroundColor: colors.error + '15',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  troubleshootTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.error,
    marginBottom: spacing.md,
  },
  troubleshootText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  retryButton: {
    marginTop: spacing.md,
    backgroundColor: colors.error,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  retryButtonText: {
    color: colors.textWhite,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});
