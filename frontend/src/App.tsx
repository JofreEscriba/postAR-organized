import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CardAdd from './pages/CardAdd';
import CardEdit from './pages/CardEdit';
import ProfilePage from './pages/ProfilePage';
import MyCards from './pages/MyCards';
import Layout from './components/Layout';
import Dashboard from "./pages/Dashboard";
import PostCreatedPage from './pages/postCreatedPage';
import ProtectedRoute from './components/ProtectedRoute'; // Importa el componente
import './styles/global.css';

const App: React.FC = () => {
  return (
    <Router basename="/Post-AR">
      <Routes>
        <Route element={<Layout />}>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Rutas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cardAdd" 
            element={
              <ProtectedRoute>
                <CardAdd />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/cardEdit/:id" 
            element={
              <ProtectedRoute>
                <CardEdit />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/MyCards" 
            element={
              <ProtectedRoute>
                <MyCards />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/post-created" 
            element={
              <ProtectedRoute>
                <PostCreatedPage />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
