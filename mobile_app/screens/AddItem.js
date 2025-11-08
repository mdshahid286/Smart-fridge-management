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
import { addInventoryItem } from "../api";

export default function AddItem({ navigation }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("In Stock");

  const handleAdd = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert("Error", "Please enter item name");
      return;
    }

    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      Alert.alert("Error", "Please enter valid quantity");
      return;
    }

    try {
      const newItem = {
        name: name.trim(),
        quantity: parseInt(quantity),
        status: status.trim() || "In Stock",
      };

      const result = await addInventoryItem(newItem);
      console.log("✅ Item added:", result);

      Alert.alert("Success", "Item added successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("❌ Add item error:", error);
      Alert.alert("Error", "Failed to add item. Check backend connection.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>➕ Add New Item</Text>

      <Text style={styles.label}>Item Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g., Milk, Eggs, Bread"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Quantity *</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        placeholder="e.g., 1, 2, 5"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Status</Text>
      <TextInput
        style={styles.input}
        value={status}
        onChangeText={setStatus}
        placeholder="In Stock / Low / Out of Stock"
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>💾 Add Item</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>❌ Cancel</Text>
      </TouchableOpacity>
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
    padding: spacing.lg,
    paddingTop: spacing.xl,
    flexGrow: 1,
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
    fontSize: fontSize.md,
    backgroundColor: colors.cardSolid,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.xl,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.error,
    marginTop: spacing.sm,
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});

