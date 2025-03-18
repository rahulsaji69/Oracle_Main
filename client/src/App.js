import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/track" element={<Track />} />
          <Route path="/ebookings" element={<Booking />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/myprofile" element={<Profile />} />
          <Route path="/login-navbar" element={<LoginNavbar />} />
          <Route path="/shipschedules" element={<ShipSchedules />} />
          <Route path="/shiprep" element={<ShipRep />} />
          <Route path="/customs" element={<Customs/>}/>
          <Route path="/support" element={<Support />} />
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
