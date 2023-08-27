import AsyncStorage from "@react-native-async-storage/async-storage"
import { IListItem } from "../interfaces";

class GraphService { 

    private static baseUrl: string = "https://graph.microsoft.com/v1.0"

    private static getAccessToken = async () => {
        const token = await AsyncStorage.getItem('token');
        const accessToken = JSON.parse(token!).accessToken
        return accessToken
    }

    private static getInfo = async () => {
        const accessToken = await GraphService.getAccessToken()

        const url = await AsyncStorage.getItem('url');
        const relativeUrl = await AsyncStorage.getItem('relativeUrl');
 
        const sharePointHost = url?.replace("https://", "").split(".")[0] + ".sharepoint.com"  
        return { accessToken, sharePointHost, relativeUrl }
    }

    public static getListItems = async () => {
        const { accessToken, sharePointHost, relativeUrl } = await GraphService.getInfo()

        const response = await fetch(`${GraphService.baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/AIGallery/items?expand=fields(select=id,Prompt,Image,Name,Email)`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        const json = await response.json()

        if(!response.ok) {
            throw new Error(json.error.message)
        }

        return json   
    }

    public static getProfilePicture = async () => {
        const accessToken = await GraphService.getAccessToken()

        const response = await fetch(`${GraphService.baseUrl}/me/photo/$value`, 
        {   
           headers: {
                 Authorization: `Bearer ${accessToken}`
            }
        })

        return await response.blob()
    }

    public static deleteListItem = async (itemId: string) => {
        const { accessToken, sharePointHost, relativeUrl } = await GraphService.getInfo()

        await fetch(`${GraphService.baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/AIGallery/items/${itemId}`,
        {
            method: "DELETE",    
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        })
 
        return {deleted: true}   
    }

    public static addListItem = async (listItem: IListItem) => {  
        const { accessToken, sharePointHost, relativeUrl } = await GraphService.getInfo()

        const response =  await fetch(`${GraphService.baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists/AIGallery/items`,
            {
                method: "POST",    
                headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ fields: listItem })
            })
            
            const json = await response.json()

            if(!response.ok) {
                throw new Error(json.error.message)
            }

            return json    
    }
  
    public static createList = async () => {
        const { accessToken, sharePointHost, relativeUrl } = await GraphService.getInfo()

        const list = {
            displayName: "AIGallery",
            columns: [
                {
                    name: "Prompt",
                    text: { }
                },
                {
                    name: "Image",
                    text: {
                        "allowMultipleLines": true
                    }
                },
                {
                    name: "Name",
                    text: { }
                },
                {
                    name: "Email",
                    text: { }
                }
            ],
            list: {
                template: 'genericList'
            }
        }

        const response = await fetch(`${GraphService.baseUrl}/sites/${sharePointHost}:${relativeUrl}:/lists`, 
           {
              method: "POST",    
              headers: {
                    'content-type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                    body: JSON.stringify(list)
           })

            const json = await response.json()

            if(!response.ok) {
                if(json.error.code !== "nameAlreadyExists") {
                    throw new Error(json.error.message)
                }             
            }

            return json    
    }    
}

export default GraphService