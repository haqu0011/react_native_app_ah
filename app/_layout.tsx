import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GiftProvider } from "@/context/GiftContext";
import PeopleScreen from "@/screens/PeopleScreen";
import AddPersonScreen from "@/screens/AddPersonScreen";
import IdeaScreen from "@/screens/IdeaScreen";
import AddIdeaScreen from "@/screens/AddIdeaScreen";
import { useFonts } from "expo-font";

const Stack = createStackNavigator();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      <NavigationContainer independent={true}>
      <GiftProvider>
        <Stack.Navigator initialRouteName="People">
          <Stack.Screen
            name="People"
            component={PeopleScreen}
            options={{ title: "Gift Ideas" }}
          />
          <Stack.Screen
            name="AddPerson"
            component={AddPersonScreen}
            options={{ title: "Add Person" }}
          />
          <Stack.Screen
            name="Ideas"
            component={IdeaScreen}
            options={{ title: "Gift Ideas" }}
          />
          <Stack.Screen
            name="AddIdea"
            component={AddIdeaScreen}
            options={{ title: "Add Idea" }}
          />
        </Stack.Navigator>
    </GiftProvider>
    </NavigationContainer>
  );
}
