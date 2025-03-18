import React, { useState } from 'react';
import { 
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import './TruckingModule.css';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TruckingModule = () => {
  const [tabValue, setTabValue] = useState(0);
  
  // Dialogs state
  const [openTruckingDialog, setOpenTruckingDialog] = useState(false);
  const [openSchedulingDialog, setOpenSchedulingDialog] = useState(false);
  const [openMovementDialog, setOpenMovementDialog] = useState(false);
  const [openDriverDialog, setOpenDriverDialog] = useState(false);
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState(false);
  
  // Form data states
  const [truckingFormData, setTruckingFormData] = useState({
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    fleet: ''
  });
  
  const [schedulingFormData, setSchedulingFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    pickupLocation: '',
    deliveryDate: '',
    deliveryTime: '',
    deliveryLocation: '',
    cargoType: '',
    specialInstructions: ''
  });
  
  const [movementFormData, setMovementFormData] = useState({
    containerId: '',
    status: 'In Transit',
    currentLocation: '',
    estimatedDelivery: '',
    notes: ''
  });
  
  const [driverFormData, setDriverFormData] = useState({
    driverName: '',
    driverPhone: '',
    vehicleType: '',
    vehicleId: '',
    containerId: ''
  });
  
  const [deliveryFormData, setDeliveryFormData] = useState({
    containerId: '',
    deliveryDate: '',
    receiverName: '',
    receiverSignature: '',
    notes: '',
    status: 'Pending'
  });
  
  // Mock data for demonstration
  const [truckingCompanies, setTruckingCompanies] = useState([
    { id: 1, name: 'FastTruck Logistics', contact: 'John Doe', phone: '555-1234', email: 'john@fasttruck.com', fleet: '15 trucks, 8 vans' },
    { id: 2, name: 'RoadMasters Inc.', contact: 'Jane Smith', phone: '555-5678', email: 'jane@roadmasters.com', fleet: '22 trucks, 12 refrigerated' }
  ]);
  
  const [schedules, setSchedules] = useState([
    { id: 1, pickupDate: '2023-05-15', pickupLocation: 'Port of Los Angeles', deliveryDate: '2023-05-17', deliveryLocation: 'San Francisco Warehouse', status: 'Completed' },
    { id: 2, pickupDate: '2023-06-01', pickupLocation: 'Oakland Port', deliveryDate: '2023-06-03', deliveryLocation: 'Sacramento Distribution Center', status: 'In Progress' }
  ]);
  
  const [containerMovements, setContainerMovements] = useState([
    { id: 'CONT12345', status: 'In Transit', currentLocation: 'Highway 101, Mile 45', estimatedDelivery: '2023-05-17', notes: 'On schedule' },
    { id: 'CONT67890', status: 'Delivered', currentLocation: 'Sacramento Distribution Center', estimatedDelivery: '2023-05-15', notes: 'Delivered on time' }
  ]);
  
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Mike Johnson', phone: '555-9012', vehicleType: 'Semi-Truck', vehicleId: 'TRK-123', containerId: 'CONT12345' },
    { id: 2, name: 'Sarah Williams', phone: '555-3456', vehicleType: 'Box Truck', vehicleId: 'TRK-456', containerId: 'CONT67890' }
  ]);
  
  const [deliveries, setDeliveries] = useState([
    { id: 1, containerId: 'CONT67890', deliveryDate: '2023-05-15', receiverName: 'Robert Brown', status: 'Completed', notes: 'Signed and verified' },
    { id: 2, containerId: 'CONT54321', deliveryDate: '2023-05-20', receiverName: 'Lisa Chen', status: 'Pending', notes: 'Scheduled for delivery' }
  ]);
  
  // Dialog handlers
  const handleOpenTruckingDialog = () => setOpenTruckingDialog(true);
  const handleCloseTruckingDialog = () => setOpenTruckingDialog(false);
  
  const handleOpenSchedulingDialog = () => setOpenSchedulingDialog(true);
  const handleCloseSchedulingDialog = () => setOpenSchedulingDialog(false);
  
  const handleOpenMovementDialog = () => setOpenMovementDialog(true);
  const handleCloseMovementDialog = () => setOpenMovementDialog(false);
  
  const handleOpenDriverDialog = () => setOpenDriverDialog(true);
  const handleCloseDriverDialog = () => setOpenDriverDialog(false);
  
  const handleOpenDeliveryDialog = () => setOpenDeliveryDialog(true);
  const handleCloseDeliveryDialog = () => setOpenDeliveryDialog(false);
  
  // Form change handlers
  const handleTruckingFormChange = (e) => {
    const { name, value } = e.target;
    setTruckingFormData({
      ...truckingFormData,
      [name]: value
    });
  };
  
  const handleSchedulingFormChange = (e) => {
    const { name, value } = e.target;
    setSchedulingFormData({
      ...schedulingFormData,
      [name]: value
    });
  };
  
  const handleMovementFormChange = (e) => {
    const { name, value } = e.target;
    setMovementFormData({
      ...movementFormData,
      [name]: value
    });
  };
  
  const handleDriverFormChange = (e) => {
    const { name, value } = e.target;
    setDriverFormData({
      ...driverFormData,
      [name]: value
    });
  };
  
  const handleDeliveryFormChange = (e) => {
    const { name, value } = e.target;
    setDeliveryFormData({
      ...deliveryFormData,
      [name]: value
    });
  };
  
  // Form submit handlers
  const handleTruckingSubmit = () => {
    // Validate form data
    if (!truckingFormData.companyName || !truckingFormData.contactPerson || 
        !truckingFormData.phone || !truckingFormData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Add new trucking company
    const newCompany = {
      id: truckingCompanies.length + 1,
      name: truckingFormData.companyName,
      contact: truckingFormData.contactPerson,
      phone: truckingFormData.phone,
      email: truckingFormData.email,
      fleet: truckingFormData.fleet
    };
    
    setTruckingCompanies([...truckingCompanies, newCompany]);
    toast.success("Trucking company registered successfully!");
    setOpenTruckingDialog(false);
    
    // Reset form
    setTruckingFormData({
      companyName: '',
      contactPerson: '',
      phone: '',
      email: '',
      fleet: ''
    });
  };
  
  const handleSchedulingSubmit = () => {
    // Validate form data
    if (!schedulingFormData.pickupDate || !schedulingFormData.pickupLocation || 
        !schedulingFormData.deliveryDate || !schedulingFormData.deliveryLocation) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Add new schedule
    const newSchedule = {
      id: schedules.length + 1,
      pickupDate: schedulingFormData.pickupDate,
      pickupTime: schedulingFormData.pickupTime,
      pickupLocation: schedulingFormData.pickupLocation,
      deliveryDate: schedulingFormData.deliveryDate,
      deliveryTime: schedulingFormData.deliveryTime,
      deliveryLocation: schedulingFormData.deliveryLocation,
      status: 'Scheduled'
    };
    
    setSchedules([...schedules, newSchedule]);
    toast.success("Pickup/delivery scheduled successfully!");
    setOpenSchedulingDialog(false);
    
    // Reset form
    setSchedulingFormData({
      pickupDate: '',
      pickupTime: '',
      pickupLocation: '',
      deliveryDate: '',
      deliveryTime: '',
      deliveryLocation: '',
      cargoType: '',
      specialInstructions: ''
    });
  };
  
  const handleMovementSubmit = () => {
    // Validate form data
    if (!movementFormData.containerId || !movementFormData.currentLocation || 
        !movementFormData.estimatedDelivery) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Add new container movement
    const existingIndex = containerMovements.findIndex(
      m => m.id === movementFormData.containerId
    );
    
    if (existingIndex >= 0) {
      // Update existing container
      const updatedMovements = [...containerMovements];
      updatedMovements[existingIndex] = {
        ...updatedMovements[existingIndex],
        status: movementFormData.status,
        currentLocation: movementFormData.currentLocation,
        estimatedDelivery: movementFormData.estimatedDelivery,
        notes: movementFormData.notes
      };
      setContainerMovements(updatedMovements);
    } else {
      // Add new container
      const newMovement = {
        id: movementFormData.containerId,
        status: movementFormData.status,
        currentLocation: movementFormData.currentLocation,
        estimatedDelivery: movementFormData.estimatedDelivery,
        notes: movementFormData.notes
      };
      setContainerMovements([...containerMovements, newMovement]);
    }
    
    toast.success("Container movement updated successfully!");
    setOpenMovementDialog(false);
    
    // Reset form
    setMovementFormData({
      containerId: '',
      status: 'In Transit',
      currentLocation: '',
      estimatedDelivery: '',
      notes: ''
    });
  };
  
  const handleDriverSubmit = () => {
    // Validate form data
    if (!driverFormData.driverName || !driverFormData.driverPhone || 
        !driverFormData.vehicleType || !driverFormData.vehicleId) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Add new driver
    const newDriver = {
      id: drivers.length + 1,
      name: driverFormData.driverName,
      phone: driverFormData.driverPhone,
      vehicleType: driverFormData.vehicleType,
      vehicleId: driverFormData.vehicleId,
      containerId: driverFormData.containerId
    };
    
    setDrivers([...drivers, newDriver]);
    toast.success("Driver assigned successfully!");
    setOpenDriverDialog(false);
    
    // Reset form
    setDriverFormData({
      driverName: '',
      driverPhone: '',
      vehicleType: '',
      vehicleId: '',
      containerId: ''
    });
  };
  
  const handleDeliverySubmit = () => {
    // Validate form data
    if (!deliveryFormData.containerId || !deliveryFormData.deliveryDate || 
        !deliveryFormData.receiverName) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Add new delivery
    const newDelivery = {
      id: deliveries.length + 1,
      containerId: deliveryFormData.containerId,
      deliveryDate: deliveryFormData.deliveryDate,
      receiverName: deliveryFormData.receiverName,
      status: deliveryFormData.status,
      notes: deliveryFormData.notes
    };
    
    setDeliveries([...deliveries, newDelivery]);
    toast.success("Delivery confirmed successfully!");
    setOpenDeliveryDialog(false);
    
    // Reset form
    setDeliveryFormData({
      containerId: '',
      deliveryDate: '',
      receiverName: '',
      receiverSignature: '',
      notes: '',
      status: 'Pending'
    });
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  return (
    <Container className="trucking-module-container">
      <ToastContainer />
      
      <Paper className="module-header" elevation={0}>
        <Typography variant="h4" component="h1" className="module-title">
          Trucking Management System
        </Typography>
        <Typography variant="subtitle1" className="module-subtitle">
          Manage your inland transportation operations efficiently
        </Typography>
      </Paper>
      
      <Paper className="tab-container">
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="fullWidth"
          className="tabs"
        >
          <Tab label="Dashboard" />
          <Tab label="Companies" />
          <Tab label="Scheduling" />
          <Tab label="Tracking" />
          <Tab label="Reports" />
        </Tabs>
      </Paper>
      
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3} className="dashboard-grid">
          <Grid item xs={12} md={6} lg={3}>
            <Card className="stats-card">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Companies
                </Typography>
                <Typography variant="h4">
                  {truckingCompanies.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card className="stats-card">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Schedules
                </Typography>
                <Typography variant="h4">
                  {schedules.filter(s => s.status !== 'Completed').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card className="stats-card">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Containers In Transit
                </Typography>
                <Typography variant="h4">
                  {containerMovements.filter(c => c.status === 'In Transit').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Card className="stats-card">
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Deliveries
                </Typography>
                <Typography variant="h4">
                  {deliveries.filter(d => d.status === 'Pending').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" className="section-heading">
              Quick Actions
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card className="action-card" onClick={handleOpenTruckingDialog}>
              <CardContent>
                <LocalShippingIcon className="card-icon" />
                <Typography variant="h6">
                  Add Trucking Company
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Register a new trucking company in the system
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card className="action-card" onClick={handleOpenSchedulingDialog}>
              <CardContent>
                <CalendarTodayIcon className="card-icon" />
                <Typography variant="h6">
                  Schedule Pickup/Delivery
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Create a new schedule for container pickup or delivery
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card className="action-card" onClick={handleOpenMovementDialog}>
              <CardContent>
                <TrackChangesIcon className="card-icon" />
                <Typography variant="h6">
                  Update Container Location
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Track and update the current location of containers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className="tab-header">
              <Typography variant="h6">Trucking Companies</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleOpenTruckingDialog}
              >
                Add New Company
              </Button>
            </div>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company Name</TableCell>
                    <TableCell>Contact Person</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Fleet</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {truckingCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>{company.contact}</TableCell>
                      <TableCell>{company.phone}</TableCell>
                      <TableCell>{company.email}</TableCell>
                      <TableCell>{company.fleet}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className="tab-header">
              <Typography variant="h6">Pickup/Delivery Scheduling</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleOpenSchedulingDialog}
              >
                Create New Schedule
              </Button>
            </div>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pickup Date</TableCell>
                    <TableCell>Pickup Location</TableCell>
                    <TableCell>Delivery Date</TableCell>
                    <TableCell>Delivery Location</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.id}>
                      <TableCell>{schedule.pickupDate}</TableCell>
                      <TableCell>{schedule.pickupLocation}</TableCell>
                      <TableCell>{schedule.deliveryDate}</TableCell>
                      <TableCell>{schedule.deliveryLocation}</TableCell>
                      <TableCell>{schedule.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className="tab-header">
              <Typography variant="h6">Container Tracking</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleOpenMovementDialog}
              >
                Update Container Status
              </Button>
            </div>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Container ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Current Location</TableCell>
                    <TableCell>Estimated Delivery</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {containerMovements.map((container) => (
                    <TableRow key={container.id}>
                      <TableCell>{container.id}</TableCell>
                      <TableCell>{container.status}</TableCell>
                      <TableCell>{container.currentLocation}</TableCell>
                      <TableCell>{container.estimatedDelivery}</TableCell>
                      <TableCell>{container.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </TabPanel>
      
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card className="report-card">
              <CardContent>
                <Typography variant="h6">Driver Management</Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Assign and manage drivers for container deliveries
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleOpenDriverDialog}
                >
                  Assign Driver
                </Button>
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Driver Name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Vehicle</TableCell>
                        <TableCell>Container</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {drivers.map((driver) => (
                        <TableRow key={driver.id}>
                          <TableCell>{driver.name}</TableCell>
                          <TableCell>{driver.phone}</TableCell>
                          <TableCell>{driver.vehicleType}</TableCell>
                          <TableCell>{driver.containerId}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card className="report-card">
              <CardContent>
                <Typography variant="h6">Delivery Confirmation</Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Record and confirm successful deliveries
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleOpenDeliveryDialog}
                >
                  Confirm Delivery
                </Button>
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Container ID</TableCell>
                        <TableCell>Delivery Date</TableCell>
                        <TableCell>Receiver</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {deliveries.map((delivery) => (
                        <TableRow key={delivery.id}>
                          <TableCell>{delivery.containerId}</TableCell>
                          <TableCell>{delivery.deliveryDate}</TableCell>
                          <TableCell>{delivery.receiverName}</TableCell>
                          <TableCell>{delivery.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Dialogs */}
      <Dialog open={openTruckingDialog} onClose={handleCloseTruckingDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Register Trucking Company</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Company Name"
            name="companyName"
            fullWidth
            value={truckingFormData.companyName}
            onChange={handleTruckingFormChange}
            required
          />
          <TextField
            margin="dense"
            label="Contact Person"
            name="contactPerson"
            fullWidth
            value={truckingFormData.contactPerson}
            onChange={handleTruckingFormChange}
            required
          />
          <TextField
            margin="dense"
            label="Phone Number"
            name="phone"
            fullWidth
            value={truckingFormData.phone}
            onChange={handleTruckingFormChange}
            required
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            fullWidth
            value={truckingFormData.email}
            onChange={handleTruckingFormChange}
            required
          />
          <TextField
            margin="dense"
            label="Fleet Size & Types"
            name="fleet"
            fullWidth
            multiline
            rows={3}
            value={truckingFormData.fleet}
            onChange={handleTruckingFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTruckingDialog}>Cancel</Button>
          <Button onClick={handleTruckingSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={openSchedulingDialog} onClose={handleCloseSchedulingDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Schedule Pickup/Delivery</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Pickup Date"
            name="pickupDate"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={schedulingFormData.pickupDate}
            onChange={handleSchedulingFormChange}
            required
          />
          <TextField
            margin="dense"
            label="Pickup Time"
            name="pickupTime"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={schedulingFormData.pickupTime}
            onChange={handleSchedulingFormChange}
          />
          <TextField
            margin="dense"
            label="Pickup Location"
            name="pickupLocation"
            fullWidth
            value={schedulingFormData.pickupLocation}
            onChange={handleSchedulingFormChange}
            required
          />
          <TextField
            margin="dense"
            label="Delivery Date"
            name="deliveryDate"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={schedulingFormData.deliveryDate}
            onChange={handleSchedulingFormChange}
            required
          />
          <TextField
            margin="dense"
            label="Delivery Time"
            name="deliveryTime"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={schedulingFormData.deliveryTime}
            onChange={handleSchedulingFormChange}
          />
          <TextField
            margin="dense"
            label="Delivery Location"
            name="deliveryLocation"
            fullWidth
            value={schedulingFormData.deliveryLocation}
            onChange={handleSchedulingFormChange}
            required
          />
          <TextField
            margin="dense"
            label="Cargo Type"
            name="cargoType"
            fullWidth
            value={schedulingFormData.cargoType}
            onChange={handleSchedulingFormChange}
          />
          <TextField
            margin="dense"
            label="Special Instructions"
            name="specialInstructions"
            fullWidth
            multiline
            rows={3}
            value={schedulingFormData.specialInstructions}
            onChange={handleSchedulingFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSchedulingDialog}>Cancel</Button>
          <Button onClick={handleSchedulingSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={openMovementDialog} onClose={handleCloseMovementDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Container Movement</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Container ID"
            name="containerId"
            fullWidth
            value={movementFormData.containerId}
            onChange={handleMovementFormChange}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={movementFormData.status}
              onChange={handleMovementFormChange}
            >
              <MenuItem value="In Transit">In Transit</MenuItem>
              <MenuItem value="At Port">At Port</MenuItem>
              <MenuItem value="Customs Clearance">Customs Clearance</MenuItem>
              <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Current Location"
            name="currentLocation"
            fullWidth
            value={movementFormData.currentLocation}
            onChange={handleMovementFormChange}
            required
          />
          <TextField
            margin="dense"
            label="Estimated Delivery Date"
            name="estimatedDelivery"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={movementFormData.estimatedDelivery}
            onChange={handleMovementFormChange}
            required
          />
          <TextField
            margin="dense"
            label="Notes"
            name="notes"
            fullWidth
            multiline
            rows={3}
            value={movementFormData.notes}
            onChange={handleMovementFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMovementDialog}>Cancel</Button>
          <Button onClick={handleMovementSubmit} color="primary">Update</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={openDriverDialog} onClose={handleCloseDriverDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Driver</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Driver Name"
            name="driverName"
            fullWidth
            value={driverFormData.driverName}
            onChange={handleDriverFormChange}
            required
          />
          <TextField
            margin="dense"
            label="Driver Phone"
            name="driverPhone"
            fullWidth
            value={driverFormData.driverPhone}
            onChange={handleDriverFormChange}
            required
          />
          <TextField
            margin="dense"
            label="Vehicle Type"
            name="vehicleType"
            fullWidth
            value={driverFormData.vehicleType}
            onChange={handleDriverFormChange}
            required
          />
          <TextField
            margin="dense"
            label="Vehicle ID"
            name="vehicleId"
            fullWidth
            value={driverFormData.vehicleId}
            onChange={handleDriverFormChange}
            required
          />
          <TextField
            margin="dense"
            label="Container ID"
            name="containerId"
            fullWidth
            value={driverFormData.containerId}
            onChange={handleDriverFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDriverDialog}>Cancel</Button>
          <Button onClick={handleDriverSubmit} color="primary">Assign</Button>
        </DialogActions>
      </Dialog>
      
      <Dialog open={openDeliveryDialog} onClose={handleCloseDeliveryDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Delivery</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Container ID"
            name="containerId"
            fullWidth
            value={deliveryFormData.containerId}
            onChange={handleDeliveryFormChange}
            required
          />
          <TextField
            margin="dense"
            label="Delivery Date"
            name="deliveryDate"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={deliveryFormData.deliveryDate}
            onChange={handleDeliveryFormChange}
            required
          />
          <TextField
            margin="dense"
            label="Receiver Name"
            name="receiverName"
            fullWidth
            value={deliveryFormData.receiverName}
            onChange={handleDeliveryFormChange}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={deliveryFormData.status}
              onChange={handleDeliveryFormChange}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Notes"
            name="notes"
            fullWidth
            multiline
            rows={3}
            value={deliveryFormData.notes}
            onChange={handleDeliveryFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeliveryDialog}>Cancel</Button>
          <Button onClick={handleDeliverySubmit} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TruckingModule; 