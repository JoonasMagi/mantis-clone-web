import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import IssueList from './components/Issues/IssueList';
import IssueDetail from './components/Issues/IssueDetail';
import CreateIssue from './components/Issues/CreateIssue';
import Labels from './components/Labels/Labels';
import Milestones from './components/Milestones/Milestones';
import Header from './components/Layout/Header';
import './App.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div>Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div>Loading...</div>
      </div>
    );
  }

  return !user ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/issues" element={
                <ProtectedRoute>
                  <IssueList />
                </ProtectedRoute>
              } />
              <Route path="/issues/new" element={
                <ProtectedRoute>
                  <CreateIssue />
                </ProtectedRoute>
              } />
              <Route path="/issues/:id" element={
                <ProtectedRoute>
                  <IssueDetail />
                </ProtectedRoute>
              } />
              <Route path="/labels" element={
                <ProtectedRoute>
                  <Labels />
                </ProtectedRoute>
              } />
              <Route path="/milestones" element={
                <ProtectedRoute>
                  <Milestones />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
