import { useEffect, useState } from "react"
import { View, Alert, StyleSheet, ScrollView, ActivityIndicator, 
         Text,TouchableOpacity, Image, ImageBackground } from "react-native"
import { RootStackScreenProps } from "../navigators/RootNavigators"
import { imageVariations } from "../service/dalle"
import { blobToBase64 } from "../utils"
import { BLACK, MEDIUMSLATEBLUE, WHITE } from "../colors"
import { width } from "../dimentions"
import CloseHeaderIcon from "../components/CloseHeaderIcon"

const VariationsScreen = ({ navigation, route }: RootStackScreenProps<"Variations">) => {

    const [images, setImages] = useState<[{url: string}?]>([])
    const [loader, setLoadar] = useState(false)

    const { imageUri } = route.params

    useEffect(() => {
        navigation.setOptions({
            headerRight: ({tintColor}) => (
                <CloseHeaderIcon tintColor={ tintColor! } />
              )
        })
    },[])

    useEffect(() => {
        (async () => {
            try 
            {
                setLoadar(true)
                const response = await fetch(imageUri)
                const blob: Blob = await response.blob()          
             
                const image: string = await blobToBase64(blob)
                const imageVas = await imageVariations(image) 
               
                imageVas.unshift({ url: imageUri })
                setImages(imageVas)
            } catch(e:any) {
                Alert.alert("Error", e.message)
            }finally {
                setLoadar(false)
            }
          })();
    }, [])

    return (
        <>
          { loader && <ActivityIndicator size="large" style={styles.loader} color={ MEDIUMSLATEBLUE } /> }
          { !loader && images.length > 0 &&
           <ScrollView>
                <ImageBackground
                    source={require("../../assets/images/bg.png")}
                    style={styles.bg}> 
                    {
                        images.map((uri) =>
                        <View style={styles.containerCardItem} key={uri!.url}>
                        <Image
                            source={{uri: uri!.url }}
                            resizeMode='contain'
                                style={ styles.image }
                        />   
                            <TouchableOpacity style={styles.containerSelect} onPress={() => (navigation as any).navigate("Record", {imageUri: uri!.url })}>               
                                <Text style={{ color: WHITE }}>
                                    Select 
                                </Text>
                            </TouchableOpacity>                                    
                        </View>
                        )
                    }
               </ImageBackground>
           </ScrollView>     
          }
        </>
    )
}

const styles = StyleSheet.create({
    loader: {
        marginTop: 70,
        color: MEDIUMSLATEBLUE
    },
    containerCardItem: {
        height: 385,
        backgroundColor: WHITE,
        alignSelf: "center",
        borderRadius: 8,
        alignItems: "center",     
        marginTop: 25,
        elevation: 1,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowColor: BLACK,
        shadowOffset: { height: 0, width:  0 },
    },
    image: {
        borderRadius: 8,
        height: width - 60,
        width: width - 60,
        margin: 20
    },
    containerSelect: {
        backgroundColor: MEDIUMSLATEBLUE,
        paddingVertical: 7,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    bg: {
        flex: 1,
        resizeMode: "cover"
      }, 
})

export default VariationsScreen