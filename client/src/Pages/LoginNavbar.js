import React, { useState } from 'react'
import LoginNav from '../Components/Navbar/LoginNav'

function LoginNavbar() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (isOpen) => () => {
    setOpen(isOpen);
  };

  const userDetails = JSON.parse(localStorage.getItem("user")) || null;

  return (
    <div>
      <LoginNav toggleDrawer={toggleDrawer} userDetails={userDetails} />
    </div>
  )
}

export default LoginNavbar