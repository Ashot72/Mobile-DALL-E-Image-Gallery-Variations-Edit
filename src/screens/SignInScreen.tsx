import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { View, StyleSheet, Alert } from "react-native"
import Icons from "@expo/vector-icons/MaterialIcons"
import { AzureInstance, AzureLoginView } from "../../lib"
import { RootStackScreenProps } from "../navigators/RootNavigators"
import { redirect_uri, scope } from "../constants"
import CloseHeaderIcon from "../components/CloseHeaderIcon"

const SignInScreen = ({ navigation }: RootStackScreenProps<"SignIn">) => {
    const [loginSuccess, setLoginSuccess] = useState(false)

    const homeScreen = () => navigation.goBack()

    useEffect(() => {
        navigation.setOptions({
            headerRight: ({tintColor}) => (
                <CloseHeaderIcon tintColor={ tintColor! } />
              )
        })
    },[])

    const client_id = process.env.EXPO_PUBLIC_CLIENT_ID
    const client_secret = process.env.EXPO_PUBLIC_CLIENT_SECRET

    const credentials =  { client_id, client_secret, redirect_uri, scope }
    const azureInstance = new AzureInstance(credentials)

    const onLoginSuccess = async() => {
        try {
            const token = await azureInstance.getToken() as string
            await AsyncStorage.setItem('token', JSON.stringify(token));

          const userInfo = await azureInstance.getUserInfo()
          
          setLoginSuccess(true)
          await AsyncStorage.setItem('auth', JSON.stringify(userInfo));       
          homeScreen()
     
        } catch(err: any) {
            Alert.alert("Error", err.message)
            console.error(err)
        }
    }
  
    if(!loginSuccess) {
        return (
            <AzureLoginView
               azureInstance={azureInstance}
               loadingMessage="Requesting access token ..."
               onSuccess={(onLoginSuccess)}
            />
        )
    }

    return <View />
}

const styles = StyleSheet.create({
    closeImage: {
        marginRight: 15
    }
})

export default SignInScreen