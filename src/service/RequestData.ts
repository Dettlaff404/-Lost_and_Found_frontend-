import axios from "axios"

const baseURL = "http://localhost:8085/lostandfound/api/v1/requests"

const GetRequests = async() => {
    //get the requests
    try {
        const response = await axios.get(`${baseURL}/getallrequests`)
        console.log(response.data)
    } catch (error) {
        console.error("Failed to get books", error)
        throw error   
    }
}

export {GetRequests}