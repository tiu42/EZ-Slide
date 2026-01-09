import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PresentationProvider } from './contexts/PresentationContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard'
import Login from './pages/Login';
import Register from './pages/Register';
import Slides from './pages/Slides';
import ProtectedRoute from './contexts/ProtectedRoute';
import Templates from './pages/Templates';
import Editor from './pages/Editor';
import AISlide from './pages/AISlide';

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
      <Route path='/' element={user ? <Navigate to='/dashboard' replace /> : <LandingPage />} />
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path='/login' element={user ? <Navigate to='/dashboard' replace /> : <Login />} />
      <Route path='/register' element={user ? <Navigate to='/dashboard' replace /> : <Register />} />
      <Route path='/slides' element={<ProtectedRoute><Slides /></ProtectedRoute>} />
      <Route path='/templates' element={<ProtectedRoute><Templates /></ProtectedRoute>} />
      <Route path='/ai-slide' element={<ProtectedRoute><AISlide /></ProtectedRoute>} />
      <Route path='/design/:id' element={<Editor />} />
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