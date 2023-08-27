import { View, StyleSheet } from "react-native"
import Icons from "@expo/vector-icons/MaterialIcons"
import { useNavigation } from '@react-navigation/native';

interface ICloseHeaderIcon  {
    tintColor: string
}

const CloseHeaderIcon =  ({ tintColor }:  ICloseHeaderIcon) => {
    const navigation = useNavigation();

    return (
        <View style={styles.closeImage}>
                   <Icons 
                   name="close" 
                   color={tintColor} 
                   size={24} 
                   onPress={() => navigation.goBack()}                 
                   />
        </View>
    )
}

const styles = StyleSheet.create({
    closeImage: {
        marginRight: 15
    }
})

export default CloseHeaderIcon