import { useState } from "react"
import { Alert, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"
import Icons from "@expo/vector-icons/MaterialIcons"
import { BLACK, GRAY, MEDIUMSLATEBLUE, WHITE } from "../colors"
import GraphService from "../service/graph"

interface IDeleteListItem  {
    Id: string
    onDelete: () => void
}

const DeleteImage = ({ Id, onDelete }: IDeleteListItem) => {
    const [del, setDel] = useState(false)

    const deleteItem = () =>  
            Alert.alert("Confirmation", "Are you sure you want to delete the entry?", [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            {
                text: "OK",
                onPress: async () => {
                    try {                
                        setDel(true)   
                        await GraphService.deleteListItem(Id);          
                        onDelete()  
                    } catch(e:any) {
                        Alert.alert("Error", e.message)
                    } finally {
                        setDel(false)  
                    }
                }
            }
        ])

    return (     
        del 
         ? <ActivityIndicator size="large" color={ MEDIUMSLATEBLUE } />
         : <TouchableOpacity style= { styles.container } onPress={deleteItem}>  
              <Icons name="delete" size={ 24 } color={GRAY} />  
           </TouchableOpacity>        
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: WHITE,
        padding: 6,
        borderRadius: 20,
        width: 37,
        elevation: 1,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowColor: BLACK,
        shadowOffset: { height: 0, width: 0 },
    }
})

export default DeleteImage