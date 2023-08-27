import { useEffect, useState, useRef } from "react"
import { Alert, View, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native"
import { WebView } from 'react-native-webview';
import Voice from "@react-native-voice/voice"
import { RootStackScreenProps } from "../navigators/RootNavigators"
import { editImage } from "../service/dalle"
import { blobToBase64 } from "../utils"
import { MEDIUMSLATEBLUE, WHITE } from "../colors"
import { width } from "../dimentions"
import CloseHeaderIcon from "../components/CloseHeaderIcon"

const EditScreen = ({ navigation, route }: RootStackScreenProps<"Edit">) => {
    const [result, setResult] = useState("")
    const [recording, setRecording] = useState(false)
    const [startPrompt, setStartPrompt] = useState(false)
    const [loader, setLoader] = useState(false)
    
    const originalImage:any = useRef("");
    const maskImage = useRef("");

    const webviewRef = useRef(null);
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
                const response = await fetch(imageUri)
                const blob: Blob = await response.blob()          
             
                const image: string = await blobToBase64(blob)
                if(webviewRef.current) {
                    (webviewRef.current as any).postMessage(image);
                }              
            } catch(e:any) {
                Alert.alert("Error", e.message)
            }
          })();
    }, [])

    useEffect(() => {
        Voice.onSpeechStart = speechStartHandler
        Voice.onSpeechResults = speechResultsHandler
        Voice.onSpeechError = speechErrorHandler

        return () => {
            Voice.destroy().then(Voice.removeAllListeners)
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

    const setImage = async ()=> {
        if(result.trim()) {
            try {
              setLoader(true)
              
              const editImgUrl = await editImage(originalImage.current, maskImage.current, result);  
              (navigation as any).navigate("Record", {imageUri: editImgUrl, prompt: result })
        
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

    const startRecording = async () => {
        setRecording(true)
        try {
            console.log("Voice Start")
            await Voice.start("en-GB")            
        } catch(error) {
            console.log('error: ', error)
        }
    }

    const js = `
        const ctx = myCanvas.getContext("2d")

        document.addEventListener("message", function(event) {    
          const saveButton = document.getElementById("save"); 
          saveButton.innerText = "Edit and Process"

          const image = new Image();     
          const base64 = event.data 
          image.src = base64
    
          image.onload = () => {
            ctx.drawImage(image, 0, 0,${width},${width});  
            const originalImage = myCanvas.toDataURL()    
            window.ReactNativeWebView.postMessage(originalImage);
          }       

          myCanvas.addEventListener("touchmove", function(evt) {
            const touches = evt.changedTouches;   
            const x = touches[0].clientX
            const y=touches[0].clientY         
            ctx.clearRect(x,y + 40 - ${width}/2,10,10);        
          })
      })
    `;

    const HTMLCanvas = `
         <html>
            <meta name="viewport" content="width=device-width">
            <body style="display:flex;justify-content: center; align-items:center;">
     
                <script>   
                    const sendEditImageToReactNativeApp = () => {     
                        const canvas = document.getElementById("myCanvas");               
                        try {
                          const data = canvas.toDataURL()
                          window.ReactNativeWebView.postMessage(data);
                        }catch(e) {
                          window.alert(e.message)
                        }             
                    };        
                </script>

                <div style="display: flex; flex-direction: column">                
                    <div>
                      <canvas id="myCanvas"             
                         width="${width}"
                         height="${width}">
                      </canvas>
                    </div>
                    
                    <div style="text-align: center; margin-top: 20px">
                      <button id="save"
                        style="
                            color: ${WHITE};
                            background-color: ${MEDIUMSLATEBLUE};
                            border-color: ${MEDIUMSLATEBLUE}
                            display: inline-block;
                            border: 1px solid transparent;
                            padding: 6px 40px;
                            font-size: 1rem;
                            line-height: 1.5;
                            border-radius: 0.35rem;
                        "
                        onclick="sendEditImageToReactNativeApp()">                                        
                         Wait...
                      </button>                        
                    </div>                    
                </div>

            </body>
         </html>
     `;

    const onMessage = async (data: any) => {
        if(!originalImage.current) {
            originalImage.current = data.nativeEvent.data
        } else {
            maskImage.current = data.nativeEvent.data 
            setStartPrompt(true)
        }
    }

    const run = `
      window.isNativeApp = true,
      true
    `

    return (     
        <>
        { loader && <ActivityIndicator style={styles.loader} size="large" color= { MEDIUMSLATEBLUE } /> }
            {
            !startPrompt && 
                <WebView
                ref={webviewRef}
                automaticallyAdjustContentInsets={true}
                useWebKit={true}
                startInLoadingState={true}                          
                source={{ html: HTMLCanvas }}
                onMessage={onMessage}
                injectedJavaScript={js}
                injectedJavaScriptBeforeContentLoaded={run}
            />
            }
            {
                startPrompt && recording && !loader &&
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
                startPrompt && !recording && !loader &&
                <View style={styles.recorderContainer}>
                <TouchableOpacity onPress={startRecording}>
                    <Image
                        source={require("../../assets/images/recordingIcon.png")}
                        style={styles.icons}
                    />
                </TouchableOpacity>
            </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    loader: {
        marginTop: 70
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
     }
})

export default EditScreen