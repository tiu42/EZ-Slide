import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({user, setUser}) =>{
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    }
    return (
        <nav>
            <div>
                <Link to='/'>EzSlide</Link>
                <div>
                    {user? (
                        <button onClick={handleLogout}>Logout</button>
                    ):(
                        <>
                            <Link to='/login'>Login</Link>
                            <Link to='/register'>Register</Link>
                        </>
                    )}
                </div>
            </div>
            <br></br>
        </nav>
    )
}

export default Navbar