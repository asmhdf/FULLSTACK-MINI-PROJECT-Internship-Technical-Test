import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-slate-400">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center text-slate-400">Loading...</div>;
  return user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<RootRedirect />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
