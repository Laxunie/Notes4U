import React, {useState} from 'react'
import { Navigate } from 'react-router-dom';
import { UserAuth } from "../Auth/AuthAPI";
import waiting from '../assets/images/waiting.gif'

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
        <div className='w-full h-screen flex justify-center items-center bg-blue-300 p-6'>
            {user ? <Navigate to="/notes"/>
            :  !sent ?
                <div className='xl:min-w-[1000px] flex flex-col justify-between bg-white rounded-lg shadow-lg p-8'>
                    <div>
                        <h1 className='md:text-4xl font-bold text-xl'>Create personal notes easy and free!</h1>
                        <p className='md:text-md text-sm mt-2 text-gray-600'>Enter your email below and we'll send you a sign in link for authentication. No password required!</p>
                    </div>
                    <form className='flex flex-col mt-4'>
                        <label className='text-md font-bold'>Email Address</label>
                        <input className='border border-gray-400 rounded shadow-lg px-3 py-1 mt-1 outline-none' placeholder='Email' type="text" onChange={(e) => handleEmail(e)}/>
                        <div>
                            <button className='disabled:bg-gray-400 bg-blue-300 hover:bg-blue-500 font-bold text-white rounded px-8 py-2 mt-5 shadow-md duration-200'
                                disabled={
                                    !email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                                }
                                type="submit"
                                pattern="/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/"
                                onClick={(e) => {handleSubmit(e)}}>Send Email
                            </button>
                        </div>
                    </form> 
                </div>
                :
                <div className='xl:min-w-[1000px] flex flex-col justify-center items-center bg-white rounded-lg shadow-sm shadow-black p-6'>
                    <h1 className='text-[80px]'>&#128231;</h1>
                    <h1 className='font-bold text-4xl text-center'>Email link has been sent!</h1>
                    <p className='text-gray-600 text-md mt-2 text-center'>Please click the link in your inbox to sign in. If you did not receive an email, check your junk/spam folder!</p>
                    <img className='w-[200px]' src={waiting} alt="cat"/>
                </div>
            }
        </div>
    )
}

export default Home