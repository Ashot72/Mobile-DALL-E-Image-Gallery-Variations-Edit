import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { View, ImageBackground, StyleSheet, Alert, ActivityIndicator } from "react-native"
import * as Speech from 'expo-speech';
import Swiper from "react-native-deck-swiper";
import { TabsStackScreenProps } from "../navigators/TabsNavigator"
import GraphService from "../service/graph";
import CardItem from "../components/CartItem";
import { height, width } from "../dimentions";
import { IAuth } from "../interfaces";
import { MEDIUMSLATEBLUE, WHITE } from "../colors"

const ExploreScreen = ({ navigation }: TabsStackScreenProps<"Explore">) => {
     const [items, setItems] = useState<any>([]) 
     const [userPrincipalName, seUserPrincipalName] = useState("")
     const swiperRef = useRef(null)
     const [loader, setLoader] = useState(false)

     useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            (async () => {
                try {
                    const auth = await AsyncStorage.getItem('auth');  
                    const authParsed: IAuth = JSON.parse(auth!)
         
                    if(!auth) {
                        navigation.navigate("Home")
                    } else {
                        setLoader(true)
                        const listItems = await GraphService.getListItems()  
                        setItems(listItems.value);                        
                        seUserPrincipalName(authParsed.userPrincipalName)
                    }               
                } catch(e: any) {
                    Alert.alert("Error", e.message)
                } finally {
                    setLoader(false)
                }
            })();
        })

        return unsubscribe;
    }, [])

    const onDelete = async () => {
        try {
           const listItems = await GraphService.getListItems()  
           setItems(listItems.value);
           if(swiperRef.current) {
            (swiperRef.current as any).jumpToCardIndex(0)
           }         
        } catch(e: any) {
            Alert.alert("Error", e.message)
        }
    }

    const onSwiped = (index: number) => { 
        Speech.stop()
        const cardIndex = index === items.length - 1 ? 0 : index + 1
        const prompt: string = items[cardIndex].fields.Prompt
        Speech.speak(prompt);
    }

    return (
        <View>        
            <ImageBackground
               source={require("../../assets/images/bg.png")}
              style={styles.bg}>            
                { items.length > 0 && 
                <>
                    { loader && <ActivityIndicator size="large" style={styles.loader} color={ MEDIUMSLATEBLUE } /> }
                    { userPrincipalName && 
                        <Swiper
                            ref = {swiperRef }
                            onSwiped = { onSwiped }
                            cards = {items}
                            infinite={true}
                            showSecondCard={items.length === 1 ? false: true} 
                            stackSize={2}
                            verticalSwipe={false}
                            horizontalSwipe={items.length === 1 ? false : true }
                            renderCard={(item:any) =>  item ? 
                            <CardItem  { ...item.fields } userPrincipalName={userPrincipalName} onDelete = {onDelete} /> : <View/>}        
                        />
                    }
                 </>
                }  
                              
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        resizeMode: "cover",
        width: width,
        height: height,
      },
      loader: {
        marginTop: 23,
        backgroundColor: WHITE
    }   
})

export default ExploreScreen