import { StyleSheet, TouchableOpacity, View, Text } from "react-native"
import Icons from "@expo/vector-icons/MaterialIcons"
import { GRAY, MEDIUMSLATEBLUE, WHITE } from "../colors"

interface ITabItem {
    routeName: String
    isActive: boolean
    navigation: any
}

const TabItem = ({routeName, isActive, navigation}: ITabItem) => {
    const onTop = () => {
      navigation.navigate(routeName)
   }

   return (
     <TouchableOpacity
        onPress={onTop}
        style={styles.container}
     >
       <View
          style={[styles.itemContainer, { backgroundColor: isActive ? MEDIUMSLATEBLUE : "transparent"}]}
       >
         <Icons 
           name = {
             routeName === "Home"
             ? "login"
             : routeName === "Record" ? "record-voice-over"
             : routeName === "Explore" ? "search"
             : "person"
           }
           size={ 24 }
           color = { isActive ? WHITE : GRAY }
           style= {{ opacity: isActive ? 1 : 0.5 }}
         />
       </View>
       {
          isActive && (
            <Text style={ styles.iconText }>
                { routeName } 
            </Text>
          )
       }
     </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingVertical: 8
  },
  itemContainer: {
     width: 36,
     height: 36,
     alignItems: "center",
     justifyContent: "center",
     borderRadius: 32    
  },
  iconText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
    color: GRAY
  }
})

export default TabItem