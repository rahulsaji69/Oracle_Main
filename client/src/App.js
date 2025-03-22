import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Track from "./Pages/Track";
import Booking from "./Pages/Booking";
import Schedule from "./Pages/Schedule";
import AdminDashboard from "./Pages/AdminPages/AdminDashboard";
import AppLayout from "./Components/AppLayout/AppLayout";
import Ship from "./Pages/AdminPages/Ship";
import ScheduledShips from "./Pages/AdminPages/ScheduledShips";
import AddShipFormPage from "./Pages/AdminPages/AddShipFormPage";
import Profile from "./Pages/Profile";
import LoginNavbar from "./Pages/LoginNavbar";
import UsersList from "./Pages/AdminPages/UsersList";
import ShipSchedules from "./Pages/ShipSchedules";
import BookingPage from "./Pages/AdminPages/BookingPage";
import ShipRep from "./Pages/ShipRep";
import Customs from "./Pages/Customs"; 
import Support from "./Pages/Support";
import Analytics from "./Pages/AdminPages/Analytics";
import Trucking from "./Pages/Trucking";
import { useEffect, useState } from "react";

// Protected route component to ensure only authenticated users can access certain routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/track" element={<Track />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/ebookings" element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          } />
          <Route path="/schedule" element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          } />
          <Route path="/myprofile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/login-navbar" element={<LoginNavbar />} />
          <Route path="/shipschedules" element={
            <ProtectedRoute>
              <ShipSchedules />
            </ProtectedRoute>
          } />
          <Route path="/shiprep" element={
            <ProtectedRoute>
              <ShipRep />
            </ProtectedRoute>
          } />
          <Route path="/customs" element={
            <ProtectedRoute>
              <Customs/>
            </ProtectedRoute>
          } />
          <Route path="/support" element={<Support />} />
          <Route path="/trucking" element={
            <ProtectedRoute>
              <Trucking />
            </ProtectedRoute>
          } />
          <Route element={<AppLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-dashboard/ships" element={<Ship />} />
            <Route path="/admin-dashboard/ships-form" element={<AddShipFormPage />} />
            <Route path="/admin-dashboard/schedules" element={<ScheduledShips />} />
            <Route path="/admin-dashboard/users" element={<UsersList />} />
            <Route path="/admin-dashboard/bookings" element={<BookingPage/>} />
            <Route path="/admin-dashboard/analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
