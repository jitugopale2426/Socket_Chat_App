import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const RegisterPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [response, setResponse] = useState(null);

    const handleRegister = async(e)=>{
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/api/auth/register',{username,email,password},{
                headers:{
                    'Content-Type':"application/json"
                }
            });

            const data = res.data;

            if(data.message==="User Registered Successfully"){
                setResponse(data.message);
                console.log(data.message)
                navigate('/login');
            }
        } catch (err) {
            console.error("Registration Failed",err)
        }
    }
  return (
    <>
      <div className='register'>
         <div className='flex flex-col items-center justify-center h-dvh'>
            <div className='border-2 rounded-2xl p-4'>
                <form onSubmit={handleRegister}>
                    <h3 className='font-bold text-4xl mb-3'>Register Page</h3>
                    <div className='flex flex-col mb-2'>
                        <label htmlFor='username'>UserName :</label>
                        <input type='text'
                        name='username' 
                        value={username} 
                        onChange={(e)=>setUsername(e.target.value)} className="border border-gray-200 p-2 rounded" placeholder='UserName'/>
                    </div>
                    <div className='flex flex-col mb-2'>
                        <label htmlFor='email'>Email :</label>
                        <input type='email' className="border border-gray-200 p-2 rounded" placeholder='email'
                        value={email} 
                        onChange={(e)=>setEmail(e.target.value)} />
                    </div>
                    <div className='flex flex-col mb-2'>
                        <label htmlFor='username'>Password :</label>
                        <input type='password' className="border border-gray-200 p-2 rounded" placeholder='password'
                        value={password} 
                        onChange={(e)=>setPassword(e.target.value)} />
                    </div>
                    <button type='submit' className='border border-gray-500 rounded-2xl p-2 w-full'>Submit</button>

                    <div className='mt-3'>
                        <p>Already Registered ? <Link to="/login">Go to Login</Link></p>
                    </div>
                </form>
            </div>
         </div>
      </div>
    </>
  )
}

export default RegisterPage
