import { BottomTabBarProps, BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import { RootStackScreenProps } from "./RootNavigators"
import CustomBottomTabs from "../components/CustomBottomTabs"
import HomeScreen from "../screens/HomeScreen"
import RecordScreen from "../screens/RecordScreen"
import ExploreScreen from "../screens/ExploreScreen" 
import { MEDIUMSLATEBLUE, WHITE } from "../colors"

export type TabsStackParamList = {
   Home: undefined,
   Record: undefined,
   Explore: undefined
}

export const TabsStack = createBottomTabNavigator<TabsStackParamList>()

export type TabsStackScreenProps<T extends keyof TabsStackParamList> = 
       CompositeScreenProps<
            BottomTabScreenProps<TabsStackParamList, T>,
            RootStackScreenProps<"TabsStack">
        >
    
const TabNavigator = () => {
   return (
      <TabsStack.Navigator
          screenOptions={{
            tabBarShowLabel: false,
            headerStyle: {backgroundColor: MEDIUMSLATEBLUE },
            headerTintColor: WHITE   
          }}
          tabBar={(props: BottomTabBarProps) => <CustomBottomTabs { ...props} />}
      >
        <TabsStack.Screen
           name="Home"
           component={ HomeScreen }           
        />
        <TabsStack.Screen
          name="Record"
          component={ RecordScreen }
          options ={{ 
            title: "Record for DALL-E Image"                     
          }}            
     /> 
         <TabsStack.Screen
            name="Explore"
            component={ ExploreScreen }      
            options ={{ 
               title: "Explore Images"                     
            }}  
         />
      </TabsStack.Navigator>
   )
}

export default TabNavigator