// Import necessary modules
import axios from "axios"; // For making HTTP requests
import React, { useEffect, useState } from "react"; // For React functionality
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import "./UserList.css";

function UserList() {
  // State to hold the list of users
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null); // State to hold any error

  // Function to fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/admin/users`
      );
      console.log(response); // Log the response data for debugging
      setUsers(response.data.data.users); // Set the users state with the fetched data
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError("Failed to fetch users"); // Set error message in state
    }
  };

  // Effect to fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEnableDisable = async (userId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/admin/users/${userId}/status`
      );

      if (response.data.status === 1) {
        fetchUsers();
      } else {
        setError("Failed to update user status");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update user status");
    }
  };

  // Render error message if there is an error
  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div className="user-list-container">
      <Typography variant="h4" className="user-list-title">
        User List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Street and Number</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Postal Code</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.company}</TableCell>
                <TableCell>{user.street}</TableCell>
                <TableCell>{user.country}</TableCell>
                <TableCell>{user.postalCode}</TableCell>
                <TableCell>{user.city}</TableCell>
                <TableCell>{user.state}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color={user.status === "enabled" ? "secondary" : "primary"} 
                    onClick={() => handleEnableDisable(user._id)} 
                  >
                    {user.status === "enabled" ? "Disable" : "Enable"} 
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default UserList;
