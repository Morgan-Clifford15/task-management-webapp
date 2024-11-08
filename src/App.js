import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ClientDashboard from './components/ClientDashboard';
import CreateBoard from './components/CreateBoard';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Navigation />
                <div className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<ClientDashboard />} />
                        <Route path="/create-board" element={<CreateBoard />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
