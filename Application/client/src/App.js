// src/App.js
import React, { useState } from 'react';
import { BrowserRotuer as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth pages
import Login from './pages/auth/Login';
import ManagerRegister from './pages/auth/ManagerRegister';
import ClientRegister from './pages/auth/ClientRegister';

// Manager pages
import ManagerDashboard from './pages/manager/Dashboard';
import ManageCars from './pages/manager/ManageCars';
import ManageDrivers from './pages/manager/ManageDrivers';
import Reports from './pages/manager/Reports';

// Driver pages
import DriverDashboard from './pages/driver/Dashboard';
import ManageAddress from './pages/driver/ManageAddress';
import ManageModels from './pages/driver/ManageModels';

// Client pages
import ClientDashboard from './pages/client/Dashboard';
import BookRent from './pages/client/BookRent';
import MyRents from './pages/client/MyRents';
import AddReview from './pages/client/AddReview';


// App
function App() {
    const [userType, setUserType] = useSate(localStorage.getitem('userType') || null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    // Auth check
    const isAuthenticated = () => {
        return user !== null;
    }

    // Auth handler

    const handleLogin = (type, userData) => {
        setUserType(type);
        setUser(userData);
        localStorage.setItem('userType', type);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Logout handler
    const handleLogout = () => {
        setUserType(null);
        setUser(null);
        localStorage.removeItem('userType');
        localStorage.removeItem('user');
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Routes>
                    {/* Public routes */}
                    <Route
                        path="/"
                        element={isAuthenticated() ? (
                            userType === 'manager' ? <Navigate to="/manager/dashboard" /> :
                                userType === 'driver' ? <Navigate to="/driver/dashboard" /> :
                                    <Navigate to="/client/dashboard" />
                        ) : <Login onLogin={handleLogin} />}
                    />
                    <Route path="/register/manager" element={<ManagerRegister onRegister={(userData) => handleLogin('manager', userData)} />} />
                    <Route path="/register/client" element={<ClientRegister onRegister={(userData) => handleLogin('client', userData)} />} />

                    {/* Manager routes */}
                    <Route path="/manager/dashboard" element={userType === 'manager' ? <ManagerDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                    <Route path="/manager/cars" element={userType === 'manager' ? <ManageCars user={user} /> : <Navigate to="/" />} />
                    <Route path="/manager/drivers" element={userType === 'manager' ? <ManageDrivers user={user} /> : <Navigate to="/" />} />
                    <Route path="/manager/reports" element={userType === 'manager' ? <Reports user={user} /> : <Navigate to="/" />} />

                    {/* Driver routes */}
                    <Route path="/driver/dashboard" element={userType === 'driver' ? <DriverDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                    <Route path="/driver/address" element={userType === 'driver' ? <ManageAddress user={user} /> : <Navigate to="/" />} />
                    <Route path="/driver/models" element={userType === 'driver' ? <ManageModels user={user} /> : <Navigate to="/" />} />

                    {/* Client routes */}
                    <Route path="/client/dashboard" element={userType === 'client' ? <ClientDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} />
                    <Route path="/client/book" element={userType === 'client' ? <BookRent user={user} /> : <Navigate to="/" />} />
                    <Route path="/client/rents" element={userType === 'client' ? <MyRents user={user} /> : <Navigate to="/" />} />
                    <Route path="/client/review/:driverName" element={userType === 'client' ? <AddReview user={user} /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}