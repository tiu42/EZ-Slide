import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = ({setUser}) =>{
    const [error, setError] = useState('');
    const [formdata, setFormdata] = useState({
        name: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormdata({...formdata, [e.target.name]:e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/register', formdata);
            localStorage.setItem("token", res.data.token);
            setUser(res.data);
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md boder-gray-200">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h1>
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

                <form  onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-1">Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formdata.name} 
                            onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 outline-none focus:border-blue-400" 
                            placeholder="Enter your name"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-medium mb-1">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formdata.email} 
                            onChange={handleChange} 
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 outline-none focus:border-blue-400" 
                            placeholder="Enter your email"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-600 text-sm font-medium mb-1">Password</label>
                        <input 
                            type="password"
                            name="password"
                            value={formdata.password}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 outline-none focus:border-blue-400" 
                            placeholder="Enter your password"
                            autoComplete="off"
                            required
                        />
                    </div>
                    <button className="w-full bg-blue-500 text-white p-3 rounded-md font-medium hover:bg-blue-600 cursor-pointer">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;