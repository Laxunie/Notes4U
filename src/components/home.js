import React, {useState} from 'react'
import { Navigate } from 'react-router-dom';
import { UserAuth } from "../Auth/AuthAPI";

const Home = () => {
    const [email, setEmail] = useState("");
    const {SendEmail, user} = UserAuth()

    //State for if the email was sent yet
    const [sent, setSent] = useState(false)
    
    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSent(true)
        SendEmail(email)
    }
    
    return (
        <div className='w-full h-screen flex justify-center items-center bg-blue-300'>
            {user ? <Navigate to="/notes"/>
            :  !sent ?
                <div className='flex flex-col justify-between bg-white rounded-3xl shadow-lg w-[800px] h-[300px] p-6'>
                    <div>
                        <h1 className='font-bold text-4xl'>Create personal notes easy and free!</h1>
                        <p className='text-md mt-2'>Enter your email below and we'll send you a sign in link for authentication. No password required!</p>
                    </div>
                    <form className='flex flex-col'>
                        <label className='text-xl'>Email Address</label>
                        <input className='border border-black rounded shadow-lg px-3 py-1 mt-1' placeholder='Email' type="text" onChange={(e) => handleEmail(e)}/>
                        <button className='w-[100px] disabled:bg-gray-400 bg-blue-300 hover:bg-blue-500 font-bold text-white rounded-md p-2 mt-5 shadow-md duration-200'
                            disabled={
                                !email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                            }
                            type="submit"
                            pattern="/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/"
                            onClick={(e) => {handleSubmit(e)}}>Send Email</button>
                    </form> 
                </div>
                :
                <div className='flex flex-col justify-center bg-white rounded-3xl shadow-lg w-[800px] h-[300px] p-6'>
                    <div>
                        <h1 className='font-bold text-4xl'>Email has been sent!</h1>
                        <p className='text-md mt-2'>Click on the link sent to your email to login! Make sure to check your junk folder if you can't find it.</p>
                    </div>
                </div>
            }
        </div>
    )
}

export default Home