import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../theme";
import { updateInventoryItem } from "../api";

export default function EditItem({ route, navigation }) {
  // Safe access to route params with defaults
  const item = route?.params?.item || { name: '', quantity: 1, status: 'In Stock' };

  const [name, setName] = useState(item?.name || '');
  const [quantity, setQuantity] = useState(item?.quantity?.toString() || '1');
  const [status, setStatus] = useState(item?.status || 'In Stock');

  const handleSave = async () => {
    // Validation
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      Alert.alert("Error", "Please enter valid quantity");
      return;
    }

    try {
      const updatedItem = {
        name,  // Keep original name
        quantity: parseInt(quantity),
        status: status.trim(),
      };

      await updateInventoryItem(updatedItem);
      console.log("✅ Item updated:", updatedItem);

      Alert.alert("Success", "Item updated successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("❌ Update Error:", error);
      Alert.alert("Error", "Failed to update item. Check backend connection.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Edit Item</Text>

      <Text style={styles.label}>Item Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        editable={false}
        placeholder="Item name"
      />

      <Text style={styles.label}>Quantity</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Status</Text>
      <TextInput
        style={styles.input}
        value={status}
        onChangeText={setStatus}
        placeholder="In Stock / Expiring / Out of Stock"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>💾 Save Changes</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSolid,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    textAlign: "center",
    marginBottom: spacing.xl,
    color: colors.textPrimary,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.xs,
    backgroundColor: colors.cardSolid,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.xl,
    alignItems: "center",
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
