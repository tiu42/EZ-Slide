import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Notfound from './components/Notfound';
import { useEffect, useState } from 'react';
import axios from 'axios'

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isloading, setIsloading] = useState(true);

  useEffect(()=>{
    const fetchUser = async ()=>{
      const token = localStorage.getItem("token");
      if (token){
        try {
          const res = await axios.get('/api/auth/me', {
            headers: {Authorization: `Bearer ${token}`}
          })
          setUser(res.data)
        }catch (err) {
          setError("Failed to fetch user data");
          localStorage.removeItem("token");
        }
      }
      setIsloading(false);
    }

    fetchUser();
  },[])

  if (isloading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <Router>
      <Navbar user={user} setUser={setUser}/>
      <Routes>
        <Route path='/' element={<Home user={user} error={error}/>} />
        <Route path='/login' element={user?<Navigate to='/' /> : <Login setUser={setUser}/>} />
        <Route path='/register' element={user?<Navigate to='/' /> :<Register setUser={setUser} />} />
        <Route path='*' element={<Notfound/>} />
      </Routes>
    </Router>
  )
}

export default App
