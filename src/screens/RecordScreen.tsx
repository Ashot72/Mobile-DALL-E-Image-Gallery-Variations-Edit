import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { View, ActivityIndicator, Text, ImageBackground, 
        TouchableOpacity, Image, StyleSheet, Alert } from "react-native"
import Voice from "@react-native-voice/voice"
import { TabsStackScreenProps } from "../navigators/TabsNavigator"
import { createImage } from "../service/dalle"
import GraphService from "../service/graph"
import { IAuth } from "../interfaces"
import { BLACK, MEDIUMSLATEBLUE, WHITE } from "../colors"
import { width, height } from "../dimentions"
import Button from "../components/Button"

const RecordScreen = ({ navigation, route }: TabsStackScreenProps<"Record">) => {
    const [result, setResult] = useState("")
    const [recording, setRecording] = useState(false)
    const [loader, setLoader] = useState(false)
    const [dalleImage, setDalleImage] = useState('')
    const [auth, setAuth] = useState(false)
   
    useEffect(() => {
        if(route.params) {
            const { imageUri, prompt } = route.params
            if(imageUri) {
                setDalleImage(imageUri)
                if(prompt) {
                    setResult(prompt)
                }
            }
        }    
    }, [route.params])
   
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            (async () => {
                try {
                    const auth = await AsyncStorage.getItem('auth');  
                    if(!auth) {
                        navigation.navigate("Home")
                    } else {
                        setAuth(true)
                        Voice.onSpeechStart = speechStartHandler
                        Voice.onSpeechResults = speechResultsHandler
                        Voice.onSpeechError = speechErrorHandler
                    }          
                } catch(e: any) {
                    Alert.alert("Error", e.message)
                }
            })();
        })

        return () => {
            Voice.destroy().then(Voice.removeAllListeners)
            unsubscribe()
        }
    }, [])

    const speechStartHandler = (e: any) => {
        console.log("speech start handler", e)
    }

    const speechResultsHandler = (e: any) => {
        console.log("voice event:", e)
        const text = e.value[0]
        setResult(text)
    }

    const speechErrorHandler = (e: any) => {
        setRecording(false)
        console.log("speech error handler: ", e)
    }

    const startRecording = async () => {
        setRecording(true)
        try {
            console.log("Voice Start")
            await Voice.start("en-GB")            
        } catch(error) {
            console.log('error: ', error)
        }
    }

    const save = async () => {
            try {
              setLoader(true)
              const auth = await AsyncStorage.getItem('auth');
              const authParsed: IAuth = JSON.parse(auth!)

              await GraphService.addListItem({
                    Title: "Gallery", 
                    Prompt: result, 
                    Image: dalleImage, 
                    Name:  authParsed.displayName,  
                    Email: authParsed.userPrincipalName
                })   
                navigation.navigate("Explore")  
                setDefault()   
            } catch(e:any) {
                Alert.alert("Error", e.message)
            } finally {
                setLoader(false)
            }
    }

    const setDefault = () => {
        setResult("")
        setDalleImage("")
    }

    const setImage = async ()=> {
        if(result.trim()) {
            try {
              setLoader(true)
              const dalleImage = await createImage(result)           
              setDalleImage(dalleImage)
        
            } catch(e:any) {
                Alert.alert("Error", e.message)
            }finally {
               setLoader(false)
            }
        }
    }

    const stopRecording = async () => {
        try {
            if(result) {
                console.log("Voice stop")
                await Voice.stop()
                setRecording(false)     
                setImage()
            } else {
                Alert.alert("Warning", "Please wait to generate the prompt from the voice.")
            }
        } catch(error) {
            console.log('error: ', error)
        }
    }

    const imageVariations = () => {
        navigation.navigate("Variations", {
            imageUri: dalleImage
        })
    }

    const editImage = () => {
        Voice.destroy().then(Voice.removeAllListeners)
        navigation.navigate("Edit", {
            imageUri: dalleImage
        })
    }

    return (
        auth ? (
            <View style={styles.container}>       
               { loader && <ActivityIndicator style={styles.loader} size="large" color= { MEDIUMSLATEBLUE } /> }
                <ImageBackground
                    source={require("../../assets/images/bg.png")}
                    style={styles.bg}>  
                   {  
                      dalleImage &&   
                        <View style={styles.containerCardItem}>
                            <Image
                                source={{uri: dalleImage }}
                                resizeMode='contain'
                                style={ styles.image }
                            />   
                            <Text style={ styles.prompt }>{ result }</Text>                                           
                        </View>
                        
                    }
                    {
                        recording && !dalleImage &&   !loader  &&
                        <View style={styles.recorderContainer}>
                        <TouchableOpacity onPress={stopRecording}>
                            <Image
                                source={require("../../assets/images/voiceLoading.gif")}
                                style={styles.icons}
                            />
                        </TouchableOpacity>
                        </View>
                    }
                    {
                    !recording && !dalleImage && !loader  &&
                        <View style={styles.recorderContainer}>
                            <TouchableOpacity onPress={startRecording}>
                                <Image
                                    source={require("../../assets/images/recordingIcon.png")}
                                    style={styles.icons}
                                />
                            </TouchableOpacity>
                        </View>
                        }
                        {
                          dalleImage && !loader  &&               
                            <>  
                                <View style={styles.buttonsContainer}>
                                    <Button 
                                        onPress={() => save()} 
                                        style={ styles.button }>
                                            Save
                                    </Button>
                                    <Button 
                                        onPress={() => setDefault()} 
                                        style={ styles.button }>
                                            Delete
                                    </Button>
                                </View> 
                                <View style={styles.buttonsContainer}>
                                    <Button 
                                        onPress={imageVariations} 
                                        style={ styles.button }>
                                            Variations
                                    </Button>
                                    <Button 
                                        onPress={editImage} 
                                        style={ styles.button }>
                                            Edit
                                    </Button>
                                </View>    
                            </>                   
                        }
                   </ImageBackground>                 
            </View>
        ) : (<View/>)
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: WHITE
    },
    containerCardItem: {
        height: 385,
        width: width - 30,
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
    bg: {
        flex: 1,
        resizeMode: "cover",
        width: width,
        height: height,
      }, 
    prompt: {      
        paddingHorizontal: 27,
        textAlign: "center",
        fontSize: 18
    },
    image: {
        borderRadius: 8,
        height: width - 60,
        width: width - 60,
        margin: 20
    },
    recorderContainer:{ 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: WHITE
    },
    icons: {
       width: 150,
       height: 150
    },
    buttonsContainer: {
        marginHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        margin: 5, 
        flex: 0.5
    },
    loader: {
        marginTop: 70,
        backgroundColor: WHITE
    }
})

export default RecordScreen