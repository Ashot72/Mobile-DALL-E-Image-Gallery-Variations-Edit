import { StatusBar } from 'expo-status-bar';
import {NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./src/navigators/RootNavigators";

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}