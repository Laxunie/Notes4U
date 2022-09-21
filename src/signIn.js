import React, {useState} from 'react'
import { UserAuth } from "./Auth/AuthAPI";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const {SignInEmail} = UserAuth()
    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        SignInEmail(email)
    }
    return (
        <div>
            <h1>Sign in with email!</h1>
            <form>
                <input type="text" onChange={(e) => handleEmail(e)}/>
                <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>
            </form>
        </div>
    )
}

export default SignIn