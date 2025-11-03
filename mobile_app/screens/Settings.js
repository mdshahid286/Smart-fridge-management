import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { USE_MOCK_DATA, API_URL } from '../api';

export default function Settings({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(false);

  const SettingItem = ({ icon, title, subtitle, onPress, showArrow = true, rightComponent }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || (showArrow && <Text style={styles.arrow}>›</Text>)}
    </TouchableOpacity>
  );

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const handleClearData = () => {
    Alert.alert(
      'Clear Data',
      'Are you sure you want to clear all data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Data cleared successfully');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🧑‍🍳</Text>
        </View>
        <Text style={styles.username}>Smart Fridge User</Text>
        <Text style={styles.email}>user@smartfridge.com</Text>
      </View>

      {/* General Settings */}
      <SettingSection title="General">
        <SettingItem
          icon="🔔"
          title="Notifications"
          subtitle="Get alerts for low stock items"
          rightComponent={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.borderLight, true: colors.primaryLight }}
              thumbColor={notifications ? colors.primary : colors.border}
            />
          }
          showArrow={false}
        />
        <SettingItem
          icon="🔄"
          title="Auto Sync"
          subtitle="Automatically sync with backend"
          rightComponent={
            <Switch
              value={autoSync}
              onValueChange={setAutoSync}
              trackColor={{ false: colors.borderLight, true: colors.primaryLight }}
              thumbColor={autoSync ? colors.primary : colors.border}
            />
          }
          showArrow={false}
        />
      </SettingSection>

      {/* Demo Mode */}
      <SettingSection title="Demo Mode">
        <View style={[styles.demoCard, USE_MOCK_DATA ? styles.demoActive : styles.demoInactive]}>
          <View style={styles.demoHeader}>
            <Text style={styles.demoIcon}>{USE_MOCK_DATA ? '📦' : '🌐'}</Text>
            <View style={styles.demoInfo}>
              <Text style={styles.demoTitle}>
                {USE_MOCK_DATA ? 'Using Mock Data' : 'Connected to Backend'}
              </Text>
              <Text style={styles.demoSubtitle}>
                {USE_MOCK_DATA 
                  ? 'Testing with sample data (15 items)' 
                  : `Live backend at ${API_URL}`
                }
              </Text>
            </View>
          </View>
          <Text style={styles.demoNote}>
            {USE_MOCK_DATA 
              ? '💡 To connect to real backend, set USE_MOCK_DATA = false in data/mockData.js' 
              : '✅ Connected to Flask backend'}
          </Text>
        </View>
      </SettingSection>

      {/* Backend Connection */}
      <SettingSection title="Backend">
        <SettingItem
          icon="🌐"
          title="Server Address"
          subtitle={API_URL}
          onPress={() => Alert.alert('Server Settings', `Current: ${API_URL}\n\nTo change, update API_URL in api.js`)}
        />
        <SettingItem
          icon="🔌"
          title="Connection Status"
          subtitle={USE_MOCK_DATA ? 'Demo Mode (No connection needed)' : 'Check backend connectivity'}
          onPress={() => Alert.alert(
            'Connection Status', 
            USE_MOCK_DATA 
              ? '📦 Demo Mode Active\n\nUsing mock data for testing'
              : 'Backend: Connected ✅'
          )}
        />
      </SettingSection>

      {/* Data Management */}
      <SettingSection title="Data">
        <SettingItem
          icon="📥"
          title="Export Data"
          subtitle="Save inventory to file"
          onPress={() => Alert.alert('Export', 'Data exported successfully')}
        />
        <SettingItem
          icon="🗑️"
          title="Clear Data"
          subtitle="Remove all inventory items"
          onPress={handleClearData}
        />
      </SettingSection>

      {/* App Info */}
      <SettingSection title="About">
        <SettingItem
          icon="ℹ️"
          title="App Version"
          subtitle="1.0.0"
          showArrow={false}
        />
        <SettingItem
          icon="📄"
          title="Privacy Policy"
          onPress={() => Alert.alert('Privacy Policy', 'Your data is secure')}
        />
        <SettingItem
          icon="📜"
          title="Terms of Service"
          onPress={() => Alert.alert('Terms', 'Terms and conditions')}
        />
        <SettingItem
          icon="❤️"
          title="Rate App"
          onPress={() => Alert.alert('Thank You!', 'Please rate us on the store')}
        />
      </SettingSection>

      {/* Spacer for bottom tab */}
      <View style={{ height: 130 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
  },
  header: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.card,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 40,
  },
  username: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionContent: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  settingSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs / 2,
  },
  arrow: {
    fontSize: 24,
    color: colors.textDisabled,
  },
  demoCard: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  demoActive: {
    backgroundColor: colors.info + '15',
    borderWidth: 2,
    borderColor: colors.info,
  },
  demoInactive: {
    backgroundColor: colors.success + '15',
    borderWidth: 2,
    borderColor: colors.success,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  demoIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  demoInfo: {
    flex: 1,
  },
  demoTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  demoSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  demoNote: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
});

