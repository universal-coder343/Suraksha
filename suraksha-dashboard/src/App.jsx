import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem('policeToken'));

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={!token ? <Login setToken={setToken} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={token ? <Dashboard onLogout={() => {
            localStorage.removeItem('policeToken');
            setToken(null);
          }} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
