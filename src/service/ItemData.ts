import axios from "axios"

const baseURL = "http://localhost:8085/lostandfound/api/v1/items"

const GetItems = async() => {
    //get the items
    try {
        const response = await axios.get(`${baseURL}/getallitems`)
        return response.data
    } catch (error) {
        console.error("Failed to get users", error)
        throw error   
    }
}

const UpdateItem = async(item: any) => {
    //update the item
    try {
        const response = await axios.patch(
            `${baseURL}?itemId=${item.itemId}`,
            item
        );
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error("Failed to Update item", error)
        throw error   
    }
}

const DeleteItem = async(itemId: string) => {
    //delete the item
    try {
        const response = await axios.delete(
            `${baseURL}?itemId=${itemId}`
        );
        return response.data
    } catch (error) {
        console.error("Failed to Delete item", error)
        throw error   
    }
}

export { GetItems, UpdateItem, DeleteItem };