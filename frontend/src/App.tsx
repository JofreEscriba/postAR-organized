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
import MyChats from './pages/MyChats';
import NewChat from './pages/NewChat';
import CurrentChats from './pages/CurrentChats';
import EditProfile from './pages/EditProfile';
import ModelViewer from './pages/ModelViewer';
import CardPreview from './pages/CardPreview';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';


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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

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
          <Route 
            path="/chats" 
            element={
              <ProtectedRoute>
                <MyChats />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/new-chat" 
            element={
              <ProtectedRoute>
                <NewChat />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/current-chats/:idChat" 
            element={
              <ProtectedRoute>
                <CurrentChats />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-profile" 
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/model-viewer/:id" 
            element={
              <ProtectedRoute>
                <ModelViewer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/CardPreview/:id" 
            element={
              <ProtectedRoute>
                <CardPreview />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
