import axios from "axios";

const baseAuthURL = "http://localhost:8085/lostandfound/api/v1/auth";

const SignUpTask = async (user: any) => {
    console.log(user)
    try {
        const signUpResponse = await axios.post(
            `${baseAuthURL}/signup`,
            user
        );
        console.log(signUpResponse.data.token);
        return signUpResponse.data.token
    } catch (error) {
        console.error("Failed to sign up", error);
        throw error
    }
}


const SignInTask = async (signIn: any) => {
    console.log(signIn)
    try {
        const signInResponse = await axios.post(
            `${baseAuthURL}/signin`,
            signIn
        );
        return signInResponse.data.token
    } catch (error) {
        console.error("Failed to sign in", error);
        throw error
    }
}

export { SignUpTask, SignInTask }