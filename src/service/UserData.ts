import axios from "axios"

const baseURL = "http://localhost:8085/lostandfound/api/v1/users"

const fetchToken = () => {
    const token = localStorage.getItem("lofToken");
    return "Bearer " + token
}

const GetUsers = async() => {
    //get the users
    try {
        const response = await axios.get(`${baseURL}/getallusers`,
        {
            headers: {
                Authorization: fetchToken()
            }
        }
        )
        return response.data
    } catch (error) {
        console.error("Failed to get users", error)
        throw error   
    }
}

const UpdateUser = async(user: any) => {
    //update the user
    try {
        const response = await axios.patch(
            `${baseURL}?userId=${user.userId}`,
            user,
            {
                headers: {
                    Authorization: fetchToken()
                }
            }
        );
        console.log(response.data)
        return response.data
    } catch (error) {
        console.error("Failed to Update user", error)
        throw error   
    }
}

const DeleteUser = async(userId: string) => {
    //delete the user
    try {
        const response = await axios.delete(
            `${baseURL}?userId=${userId}`,
            {
                headers: {
                    Authorization: fetchToken()
                }
            }
        );
        return response.data
    } catch (error) {
        console.error("Failed to Delete user", error)
        throw error   
    }
}

const AddUserData = async(user: any) => {
    //Create the request
    user.userId = "";
    console.log(user)
    try {
        const response = await axios.post(
            baseURL,
            user,
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

const GetUserByEmail = async(email:string) => {
    //get the user
    try {
        const response = await axios.get(`${baseURL}/getuserbyemail?email=${email}`,
        {
            headers: {
                Authorization: fetchToken()
            }
        }
        )
        return response.data
    } catch (error) {
        console.error("Failed to get users", error)
        throw error   
    }
}

export { GetUsers, UpdateUser, DeleteUser, AddUserData, GetUserByEmail };