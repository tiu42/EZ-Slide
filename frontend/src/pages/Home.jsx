import React from "react";
import { Link } from "react-router-dom";

const Home = ({user, error})=>{
    return (
        <div>
            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
            {user ? (
                <div>
                    <h2>Welcome, {user.name}</h2>
                    <p>{user.email}</p>
                </div>
            ) : (
                <div>
                    <h2>Please login or register</h2>
                    <Link to='/login'>Login</Link>
                    <Link to='/register'>Register</Link>
                </div>
            )}
        </div>
    )
}

export default Home;