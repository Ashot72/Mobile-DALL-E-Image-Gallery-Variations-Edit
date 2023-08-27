import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps, createNativeStackNavigator } from "@react-navigation/native-stack"
import TabsNavigator, { TabsStackParamList } from "./TabsNavigator"
import SignInScreen from "../screens/SignInScreen";
import VariationsScreen from "../screens/VariationsScreen"
import EditScreen from "../screens/EditScreen"
import { MEDIUMSLATEBLUE, WHITE } from "../colors";

export type RootStackParamList =  {
    TabsStack: NavigatorScreenParams<TabsStackParamList>
    SignIn: undefined
    Variations: { imageUri: string }
    Edit: { imageUri: string }
}

const RootStack = createNativeStackNavigator<RootStackParamList>()

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>

const RootNavigator = () => {
    return (
        <RootStack.Navigator
            screenOptions={{           
             headerStyle: {backgroundColor: MEDIUMSLATEBLUE },
             headerTintColor: WHITE   
          }}
           >
            <RootStack.Screen
               name="TabsStack"
               component={ TabsNavigator }
               options= {{
               headerShown: false,
               }}
            />
            <RootStack.Screen
               name="SignIn"
               component={SignInScreen}   
               options= {{
                presentation: "modal"
               }}       
            />
            <RootStack.Screen
              name="Variations"
              component={VariationsScreen}
              options={{
                presentation: "modal",
                title: "Image Variations"  
              }}
            />
            <RootStack.Screen
              name="Edit"
              component={EditScreen}
              options={{
                presentation: "modal",
                title: "Image Edit"  
              }}
            />
        </RootStack.Navigator>
    )
}

export default RootNavigator