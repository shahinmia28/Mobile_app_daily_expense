Daily Expense - Expo Starter (Offline with expo-sqlite)

How to use

1. Create a new Expo app (if you haven't already):
   npx create-expo-app DailyExpenseApp
   cd DailyExpenseApp

2. Install dependencies:
   npx expo install expo-sqlite
   npm install @react-navigation/native @react-navigation/native-stack
   npx expo install react-native-screens react-native-safe-area-context
   npx expo install @expo/vector-icons

3. Copy the src/ folder and App.js from this starter into your Expo project root (replace existing App.js).
4. Start Expo:
   npx expo start --clear

Notes:

- This starter uses expo-sqlite and Promise-wrapped database functions.
- Screens, context and DB are minimal; adapt fields/styling to match your web app.

for production build
eas build --platform android --profile production

for personal use build
eas build --platform android --profile preview
