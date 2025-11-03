# 🎨 Smart Refrigerator UI/UX Design Plan

## Design System

### Color Palette
```
Primary: #4CAF50 (Green - Fresh, Food)
Secondary: #2196F3 (Blue - Technology)
Accent: #FF9800 (Orange - Warning/Alert)
Error: #F44336 (Red)
Success: #4CAF50 (Green)
Background: #F5F7FA
Card: #FFFFFF
Text Primary: #1F2937
Text Secondary: #6B7280
Border: #E5E7EB
```

### Typography
```
Heading: 24-28px, Bold
Subheading: 18-20px, SemiBold
Body: 14-16px, Regular
Caption: 12-14px, Regular
```

### Spacing
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
xxl: 48px
```

---

## Screen Structure

### 1. **Bottom Tab Navigation**
- 🏠 Dashboard (Home/Overview)
- 📦 Inventory (List view)
- 📸 Scanner (Camera/Upload)
- ⚙️ Settings

### 2. **Dashboard Screen** (New)
**Purpose:** Quick overview and statistics

**Components:**
- Welcome header with user greeting
- Stats cards (Total Items, Low Stock, Expiring Soon)
- Recent detections
- Quick actions (Scan, Add Item)
- Visual charts (optional)

### 3. **Scanner Screen** (Improved Home)
**Purpose:** Image capture and upload

**Components:**
- Large camera preview area
- Stylish capture/pick buttons
- Upload button with progress
- Results display with animations
- Connection status badge

### 4. **Inventory Screen** (Enhanced)
**Purpose:** View and manage all items

**Components:**
- Search bar
- Filter chips (All, Low Stock, Expiring)
- Grid/List toggle
- Swipe actions (Edit, Delete)
- Empty state illustration
- Floating Add button

### 5. **Settings Screen** (New)
**Purpose:** App configuration

**Components:**
- Profile section
- Backend connection config
- Notification preferences
- About app
- Clear data option

### 6. **Welcome Screen** (New)
**Purpose:** First-time user onboarding

**Components:**
- 3 onboarding slides
- Skip button
- Get Started CTA

---

## Component Library

### Reusable Components
1. **CustomButton** - Styled button with variants
2. **ItemCard** - Display inventory items
3. **StatCard** - Show statistics
4. **EmptyState** - When no data
5. **LoadingSpinner** - Custom loader
6. **Header** - Consistent page headers

---

## Implementation Order

### Phase 1: Design System (30 mins)
- [x] Create theme.js with colors
- [x] Create components folder
- [ ] Build reusable components

### Phase 2: Bottom Navigation (20 mins)
- [ ] Install @react-navigation/bottom-tabs
- [ ] Setup tab navigator
- [ ] Add icons

### Phase 3: Screens (60 mins)
- [ ] Dashboard screen
- [ ] Improved Scanner screen
- [ ] Enhanced Inventory screen
- [ ] Settings screen
- [ ] Welcome screen

### Phase 4: Polish (30 mins)
- [ ] Animations
- [ ] Icons
- [ ] Images/Illustrations
- [ ] Final touches

---

## Libraries Needed

```bash
npm install @react-navigation/bottom-tabs
npm install react-native-vector-icons
npm install @expo/vector-icons  # Already included in Expo
```

---

**Total Time: ~2.5 hours**
**Result: Production-ready, modern mobile app UI**

