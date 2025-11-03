// mobile_app/App.js
import React from "react";
import { Text, View, StatusBar, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "./theme";

// Screens
import Dashboard from "./screens/Dashboard";
import Home from "./screens/Home";
import Inventory from "./screens/Inventory";
import Recipes from "./screens/Recipes";
import Settings from "./screens/Settings";
import EditItem from "./screens/EditItem";
import AddItem from "./screens/AddItem";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator for Inventory (includes Edit and Add screens)
function InventoryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        headerStyle: {
          backgroundColor: '#F1F5F9',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          height: 100,
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '800',
          fontSize: 18,
          letterSpacing: 0.3,
        },
      }}
    >
      <Stack.Screen 
        name="InventoryList" 
        component={Inventory}
        options={{ 
          title: "Inventory",
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <Text style={{ fontSize: 22, marginRight: 6 }}>📦</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.textPrimary, letterSpacing: 0.5 }}>Inventory</Text>
            </View>
          ),
          animation: 'fade',
        }}
      />
      <Stack.Screen 
        name="EditItem" 
        component={EditItem}
        options={{ 
          title: "Edit Item",
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <Text style={{ fontSize: 22, marginRight: 6 }}>✏️</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.textPrimary, letterSpacing: 0.5 }}>Edit Item</Text>
            </View>
          ),
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="AddItem" 
        component={AddItem}
        options={{ 
          title: "Add Item",
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
              <Text style={{ fontSize: 22, marginRight: 6 }}>➕</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.textPrimary, letterSpacing: 0.5 }}>Add Item</Text>
            </View>
          ),
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#E2E8F0"
        translucent={false}
      />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textDisabled,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: 'rgba(0, 0, 0, 0.1)',
            height: 85,
            paddingBottom: 15,
            paddingTop: 4,
            elevation: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            position: 'absolute',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginBottom: 0,
            zIndex: 1000,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "700",
            marginBottom: 2,
            letterSpacing: 0.3,
          },
          tabBarItemStyle: {
            paddingTop: 8,
          },
          headerStyle: {
            backgroundColor: '#E2E8F0',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            height: 100,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: "800",
            fontSize: 18,
            letterSpacing: 0.3,
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Text style={{ 
                fontSize: 26, 
                color, 
                opacity: focused ? 1 : 0.6,
                transform: [{ scale: focused ? 1.1 : 1 }]
              }}>
                🏠
              </Text>
            ),
            tabBarLabel: "Home",
            headerTitle: () => (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'center',
                flex: 1,
                paddingHorizontal: 8,
              }}>
                <Text style={{ fontSize: 28, marginRight: 8 }}>🧊</Text>
                <View style={{ alignItems: 'flex-start' }}>
                  <Text style={{ 
                    fontSize: 24, 
                    fontWeight: '800', 
                    color: colors.textPrimary,
                    letterSpacing: 1,
                    marginBottom: 0,
                    lineHeight: 26,
                  }}>
                    ChillTrack
                  </Text>
                  <Text style={{ 
                    fontSize: 9.5, 
                    color: colors.primary,
                    fontWeight: '700',
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                    marginTop: -2,
                  }}>
                    Cool inventory • Hot recipes
                  </Text>
                </View>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Inventory"
          component={InventoryStack}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Text style={{ 
                fontSize: 26, 
                color, 
                opacity: focused ? 1 : 0.6,
                transform: [{ scale: focused ? 1.1 : 1 }]
              }}>
                📦
              </Text>
            ),
            tabBarLabel: "Inventory",
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Recipes"
          component={Recipes}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Text style={{ 
                fontSize: 26, 
                color, 
                opacity: focused ? 1 : 0.6,
                transform: [{ scale: focused ? 1.1 : 1 }]
              }}>
                🍳
              </Text>
            ),
            tabBarLabel: "Recipes",
            headerTitle: () => (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'center',
                flex: 1,
              }}>
                <Text style={{ fontSize: 22, marginRight: 6 }}>🍳</Text>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: '800', 
                  color: colors.textPrimary,
                  letterSpacing: 0.5,
                }}>
                  Recipe Recommendations
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Camera"
          component={Home}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Text style={{ 
                fontSize: 26, 
                color, 
                opacity: focused ? 1 : 0.6,
                transform: [{ scale: focused ? 1.1 : 1 }]
              }}>
                📷
              </Text>
            ),
            tabBarLabel: "Monitor",
            headerTitle: () => (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'center',
                flex: 1,
              }}>
                <Text style={{ fontSize: 22, marginRight: 6 }}>📷</Text>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: '800', 
                  color: colors.textPrimary,
                  letterSpacing: 0.5,
                }}>
                  ESP32 Monitor
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Text style={{ 
                fontSize: 26, 
                color, 
                opacity: focused ? 1 : 0.6,
                transform: [{ scale: focused ? 1.1 : 1 }]
              }}>
                ⚙️
              </Text>
            ),
            tabBarLabel: "Settings",
            headerTitle: () => (
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'center',
                flex: 1,
              }}>
                <Text style={{ fontSize: 22, marginRight: 6 }}>⚙️</Text>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: '800', 
                  color: colors.textPrimary,
                  letterSpacing: 0.5,
                }}>
                  Settings
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
