import { View, StyleSheet, Image, Text } from "react-native"
import { IListItem } from "../interfaces"
import { width } from "../dimentions"
import { BLACK, MEDIUMSLATEBLUE, WHITE } from "../colors"
import DeleteImage from "./DeleteImage"

interface ICardItem extends IListItem {    
    userPrincipalName: string,
    onDelete: () => void
}

const CardItem = ( { id, Image: img, Prompt, Name, userPrincipalName, Email, onDelete }: ICardItem ) => {

    return (
        <View style={styles.container}>
          {
            userPrincipalName === Email
            ? <View style={ styles.deleteImage }>
              <DeleteImage Id={id!}  onDelete = { onDelete }/>
            </View>
            : <View style={{ marginTop: 20 }} />
           }
           <Image style={ styles.image }
              source={{uri: img }}
              resizeMode='contain'
            />  
            <View style={styles.itemContainer}>               
              <Text style={styles.item}>
                 {Name} 
              </Text>
           </View>                                                 
           <Text style={ styles.prompt }>{ Prompt }</Text>      
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 410,
        backgroundColor: WHITE,
        borderRadius: 8,
        alignItems: "center",     
        marginTop: 25,
        elevation: 1,
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowColor: BLACK,
        shadowOffset: { height: 0, width:  0 },
    },
    itemContainer: {
        marginTop: -37,
        backgroundColor: MEDIUMSLATEBLUE,
        paddingVertical: 7,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    item: {
        color: WHITE,
    },
    image: {
        borderRadius: 8,
        height: width - 60,
        width: width - 60,
        margin: 20
    },
    prompt: {
        paddingTop: 5,
        paddingHorizontal: 27,
        textAlign: "center",
        fontSize: 18,
    },
    deleteImage: {
        marginTop: -20,
        marginLeft: 260  
    }
})

export default CardItem