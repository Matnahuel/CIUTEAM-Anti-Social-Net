
import LoginForm from './pages/login'
import Home from './pages/home' 
import { AuthProvider } from './contexts/authContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
        <BrowserRouter>
      <Routes>
      
         <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginForm />} />
        </Route>

    
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
  );
}

export default App
