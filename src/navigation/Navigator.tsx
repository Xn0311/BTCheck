import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import AddJobsScreen1 from "../screens/user/AddJobsScreen1";
import HomeScreen from "../screens/user/HomeScreen";
import CVScreen from "../screens/user/CvScreen";
import UserScreen from "../screens/user/UserScreen";
import LoginScreen from "../screens/user/LoginScreen";
import SignupScreen from "../screens/user/SignupScreen";
import EditProfileScreen from "../screens/user/EditProfileScreen";
import JobDetailScreen from "../screens/user/JobDetailScreen";
import SuggestedJobsScreen from "../screens/user/SuggestedJobsScreen";
import AllJobsScreen from "../screens/user/AllJobsScreen";
import GoodJobScreen from "../screens/user/GoodJobScreen";
import SearchResultScreen from "../screens/user/SearchResultScreen";
import CompanyStatsScreen from "../screens/user/CompanyStatsScreen";
import ChangePasswordScreen from "../screens/user/ChangePasswordScreen";
import CreateCVScreen from "../screens/user/CreateCVScreen";
import EditCVScreen from "../screens/user/EditCVScreen ";
import PreviewCVScreen from "../screens/user/PreviewCVScreen";
import NewsDetailScreen from "../screens/user/NewsDetailScreen";
import CompanyDetailScreen from "../screens/user/CompanyDetailScreen";
import AdminScreen from "../screens/admin/AdminScreen";
import AppliedJobsScreen from "../screens/admin/AppliedJobsScreen";
import AddJobsScreen from "../screens/admin/AddJobScreen";
import ChatScreen from "../screens/user/ChatScreen";
import ChatListScreen from "../screens/user/ChatListScreen";
import UserListScreen from "../screens/user/UserListScreen";
import ApplicationDetailScreen from "../screens/admin/ApplicationDetailScreen";
import AJobDetailScreen from "../screens/admin/AJobDetailScreen";
import PrivacyPolicyScreen from "../screens/user/PrivacyPolicyScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "CV") {
            iconName = focused ? "document-text" : "document-text-outline"; 
          } else if (route.name === "User") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "blue",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="CV" component={CVScreen} />
      <Tab.Screen name="User" component={UserScreen} />
      

    </Tab.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddJobsScreen1"
          component={AddJobsScreen1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JobDetail"
          component={JobDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddJobs"
          component={AddJobsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SuggestedJobsScreen"
          component={SuggestedJobsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AllJobsScreen"
          component={AllJobsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GoodJobScreen"
          component={GoodJobScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchResultScreen"
          component={SearchResultScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompanyStatsScreen"
          component={CompanyStatsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateCVScreen"
          component={CreateCVScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditCVScreen"
          component={EditCVScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PreviewCVScreen"
          component={PreviewCVScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NewsDetailScreen"
          component={NewsDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CompanyDetailScreen"
          component={CompanyDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminScreen"
          component={AdminScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AppliedJobsScreen"
          component={AppliedJobsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddJobsScreen"
          component={AddJobsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatListScreen"
          component={ChatListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserListScreen"
          component={UserListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ApplicationDetailScreen"
          component={ApplicationDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AJobDetailScreen"
          component={AJobDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PrivacyPolicyScreen"
          component={PrivacyPolicyScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
