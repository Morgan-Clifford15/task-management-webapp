import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateBoard from './components/CreateBoard';
import BoardPage from './components/BoardPage';

function App() {
    return (
        <Router>
            <div className="h-screen w-screen overflow-hidden">
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/addBoard" element={<CreateBoard />} />
                    <Route path="/board/:title" element={<BoardPage />} />
                </Routes>
            </div>
        </Router>
    );
}



export default App;
