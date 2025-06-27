
import LoginForm from './pages/login'
import Home from './pages/home' 
import { AuthProvider } from './contexts/authContext';

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
        
      </Routes>
    </BrowserRouter>
  </AuthProvider>
  );
}

export default App
