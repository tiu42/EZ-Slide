import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PresentationProvider } from './contexts/PresentationContext';
import Test from './pages/Test';
import Dashboard from './pages/Dashboard'
import Login from './pages/Login';
import Register from './pages/Register';
import Slides from './pages/Slides';
import ProtectedRoute from './contexts/ProtectedRoute';
import Templates from './pages/Templates';

// Component riêng để xử lý loading
function AppContent() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path='/' element={<Test />} />
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path='/login' element={user ? <Navigate to='/dashboard' replace /> : <Login />} />
      <Route path='/register' element={user ? <Navigate to='/dashboard' replace /> : <Register />} />
      <Route path='/slides' element={<ProtectedRoute><Slides /></ProtectedRoute>} />
      <Route path='/templates' element={<ProtectedRoute><Templates/></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <PresentationProvider>
        <Router>
          <AppContent />
        </Router>
      </PresentationProvider>
    </AuthProvider>
  );
}

export default App;