import axios from "axios"

const baseURL = "http://localhost:8085/lostandfound/api/v1/requests"

const fetchToken = () => {
    const token = localStorage.getItem("lofToken");
    return "Bearer " + token
}

const GetRequests = async() => {
    //get the requests
    try {
        const response = await axios.get(`${baseURL}/getallrequests`,
        {
            headers: {
                Authorization: fetchToken()
            }
        }
        );
        return response.data
    } catch (error) {
        console.error("Failed to get Requests", error)
        throw error   
    }
}

const UpdateRequest = async(request: any) => {
    //update the request
    try {
        const response = await axios.patch(
            `${baseURL}?requestId=${request.requestId}`,
            request,
            {
                headers: {
                    Authorization: fetchToken()
                }
            }
        );
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error("Failed to Update request", error)
        throw error   
    }
}

const DeleteRequest = async(requestId: string) => {
    //delete the request
    try {
        const response = await axios.delete(
            `${baseURL}?requestId=${requestId}`,
            {
                headers: {
                    Authorization: fetchToken()
                }
            }
        );
        return response.data
    } catch (error) {
        console.error("Failed to Delete Request", error)
        throw error   
    }
}

const AddRequestData = async(request: any) => {
    //Create the request
    request.requestId = "";
    request.status = "PENDING";
    console.log(request)
    try {
        const response = await axios.post(
            baseURL,
            request,
            {
                headers: {
                    Authorization: fetchToken()
                }
            }
        );
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error("Failed to Add Request", error)
        throw error   
    }
}

export { GetRequests, UpdateRequest, DeleteRequest, AddRequestData };