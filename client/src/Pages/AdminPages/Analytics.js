import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import './Analytics.css';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    byStatus: [],
    byRoute: [],
    revenue: [],
    performance: [],
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/booking/bookings`);
      const bookings = response.data.data;
      
      // Process booking data for analytics
      const stats = processBookingData(bookings);
      setBookingStats(stats);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processBookingData = (bookings) => {
    // Calculate total bookings
    const total = bookings.length;

    // Calculate bookings by status
    const byStatus = Object.entries(
      bookings.reduce((acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value }));

    // Calculate bookings by route
    const byRoute = Object.entries(
      bookings.reduce((acc, booking) => {
        const route = `${booking.originPort} - ${booking.destinationPort}`;
        acc[route] = (acc[route] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, value]) => ({ name, value }));

    // Calculate revenue over time (mock data for now)
    const revenue = [
      { month: 'Jan', revenue: 12000 },
      { month: 'Feb', revenue: 15000 },
      { month: 'Mar', revenue: 18000 },
      { month: 'Apr', revenue: 22000 },
      { month: 'May', revenue: 25000 },
      { month: 'Jun', revenue: 28000 },
    ];

    // Calculate performance metrics (mock data for now)
    const performance = [
      { metric: 'On-time Delivery', value: 85 },
      { metric: 'Customer Satisfaction', value: 92 },
      { metric: 'Route Efficiency', value: 78 },
      { metric: 'Cargo Safety', value: 95 },
    ];

    return {
      total,
      byStatus,
      byRoute,
      revenue,
      performance,
    };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="analytics-container">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Analytics Dashboard</Typography>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
            <MenuItem value="year">Last Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Total Bookings */}
        <Grid item xs={12} md={3}>
          <Paper className="stat-card">
            <Typography variant="h6">Total Bookings</Typography>
            <Typography variant="h3">{bookingStats.total}</Typography>
          </Paper>
        </Grid>

        {/* Bookings by Status */}
        <Grid item xs={12} md={6}>
          <Paper className="chart-card">
            <Typography variant="h6">Bookings by Status</Typography>
            <PieChart width={400} height={300}>
              <Pie
                data={bookingStats.byStatus}
                cx={200}
                cy={150}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {bookingStats.byStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Paper>
        </Grid>

        {/* Revenue Over Time */}
        <Grid item xs={12} md={6}>
          <Paper className="chart-card">
            <Typography variant="h6">Revenue Over Time</Typography>
            <LineChart
              width={500}
              height={300}
              data={bookingStats.revenue}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </Paper>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Paper className="chart-card">
            <Typography variant="h6">Performance Metrics</Typography>
            <BarChart
              width={500}
              height={300}
              data={bookingStats.performance}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </Paper>
        </Grid>

        {/* Route Analysis */}
        <Grid item xs={12} md={6}>
          <Paper className="chart-card">
            <Typography variant="h6">Route Analysis</Typography>
            <BarChart
              width={500}
              height={300}
              data={bookingStats.byRoute}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Analytics; 