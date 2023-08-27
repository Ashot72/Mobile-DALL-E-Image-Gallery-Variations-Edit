const createImageUrl = 'https://api.openai.com/v1/images/generations'
const imageVariationsUrl = 'https://api.openai.com/v1/images/variations'
const editImageUrl = "https://api.openai.com/v1/images/edits"

const createImage = async (prompt: string): Promise<string> => {
    
        const response = await fetch(createImageUrl, 
        {
           method: "POST",    
           headers: {
                 'Content-Type': 'application/json',
                 Authorization: `Bearer ${process.env.EXPO_PUBLIC_APIKEY}`
             },
            body: JSON.stringify({
              prompt,
              n: 1,
              size: "512x512"
            })
        })

        const json = await response.json()
        return json?.data[0]?.url       
}

const imageVariations = async (image: string): Promise<[{url: string}]> => {

    const formData: any = new FormData() 

    formData.append('image', {
        uri:  image,
        type: "image/png",
        name: "image.png"
    })
    formData.append("n", 6)
    formData.append("size", "512x512")

    const response = await fetch(imageVariationsUrl, 
        {
           method: "POST",    
           headers: {
                'Content-Type': 'multipart/form-data',
                 Authorization: `Bearer ${process.env.EXPO_PUBLIC_APIKEY}`
            },
            body: formData
        })

        const json = await response.json()
        return json?.data 
}

const editImage = async (image: string, mask: string, prompt: string): Promise<string> => {
        const formData: any = new FormData() 

        formData.append('image', {
            uri: image,
            type: "image/png",
            name: "image.png"
        })

        formData.append('mask', {
            uri: mask,
            type: "image/png",
            name: "mask.png"
        })

        formData.append("prompt", prompt)
        formData.append("n", 1)
        formData.append("size", "512x512")

        const response = await fetch(editImageUrl, 
        {
           method: "POST",    
           headers: {
                'Content-Type': 'multipart/form-data',
                 Authorization: `Bearer ${process.env.EXPO_PUBLIC_APIKEY}`
            },
            body: formData
        })

        const json = await response.json()
        return json?.data[0]?.url 
}

export { createImage, imageVariations, editImage }
