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
  AreaChart,
  Area,
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
  const [carbonStats, setCarbonStats] = useState({
    totalEmissions: 0,
    totalSavings: 0,
    totalOffset: 0,
    percentOptimized: 0,
    emissionsByRoute: [],
    emissionTrend: [],
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  const EMISSION_COLORS = ['#4CAF50', '#FF9800', '#F44336'];

  useEffect(() => {
    fetchAnalyticsData();
    fetchCarbonEmissionsData();
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

  const fetchCarbonEmissionsData = async () => {
    try {
      // Get the date range based on selected time period
      const endDate = new Date();
      let startDate = new Date();
      
      if (timeRange === 'week') {
        startDate.setDate(endDate.getDate() - 7);
      } else if (timeRange === 'month') {
        startDate.setMonth(endDate.getMonth() - 1);
      } else if (timeRange === 'year') {
        startDate.setFullYear(endDate.getFullYear() - 1);
      }
      
      // Fetch carbon emissions statistics
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/carbon/stats`,
        {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          }
        }
      );
      
      const data = response.data.data;
      
      // Mock emission trend data for now
      // In a real implementation, this would come from the backend
      const emissionTrend = generateMockEmissionTrend(timeRange);
      const emissionsByRoute = generateMockEmissionsByRoute();
      
      setCarbonStats({
        totalEmissions: data.totalEmissions || 0,
        totalSavings: data.totalSavings || 0,
        totalOffset: data.totalOffset || 0,
        percentOptimized: data.percentOptimized || 0,
        emissionsByRoute,
        emissionTrend,
      });
    } catch (error) {
      console.error('Error fetching carbon emissions data:', error);
      // Set mock data if API fails
      const emissionTrend = generateMockEmissionTrend(timeRange);
      const emissionsByRoute = generateMockEmissionsByRoute();
      
      setCarbonStats({
        totalEmissions: 35000,
        totalSavings: 4800,
        totalOffset: 1200,
        percentOptimized: 75,
        emissionsByRoute,
        emissionTrend,
      });
    }
  };

  // Generate mock emission trend data
  const generateMockEmissionTrend = (period) => {
    if (period === 'week') {
      return [
        { day: 'Mon', emissions: 500, savings: 70 },
        { day: 'Tue', emissions: 480, savings: 65 },
        { day: 'Wed', emissions: 520, savings: 80 },
        { day: 'Thu', emissions: 540, savings: 90 },
        { day: 'Fri', emissions: 600, savings: 100 },
        { day: 'Sat', emissions: 450, savings: 60 },
        { day: 'Sun', emissions: 400, savings: 50 },
      ];
    } else if (period === 'month') {
      return [
        { name: 'Week 1', emissions: 3500, savings: 450 },
        { name: 'Week 2', emissions: 3800, savings: 520 },
        { name: 'Week 3', emissions: 3600, savings: 480 },
        { name: 'Week 4', emissions: 3900, savings: 550 },
      ];
    } else {
      return [
        { name: 'Jan', emissions: 9500, savings: 1200 },
        { name: 'Feb', emissions: 8800, savings: 1100 },
        { name: 'Mar', emissions: 9200, savings: 1300 },
        { name: 'Apr', emissions: 9800, savings: 1500 },
        { name: 'May', emissions: 10500, savings: 1600 },
        { name: 'Jun', emissions: 10200, savings: 1550 },
        { name: 'Jul', emissions: 9800, savings: 1400 },
        { name: 'Aug', emissions: 9500, savings: 1350 },
        { name: 'Sep', emissions: 9300, savings: 1300 },
        { name: 'Oct', emissions: 9700, savings: 1450 },
        { name: 'Nov', emissions: 10100, savings: 1550 },
        { name: 'Dec', emissions: 10800, savings: 1700 },
      ];
    }
  };

  // Generate mock emissions by route data
  const generateMockEmissionsByRoute = () => {
    return [
      { name: 'Hong Kong - Singapore', emissions: 8500 },
      { name: 'Singapore - Mumbai', emissions: 7200 },
      { name: 'Mumbai - Dubai', emissions: 6800 },
      { name: 'Dubai - Rotterdam', emissions: 12500 },
      { name: 'Rotterdam - New York', emissions: 9000 },
    ];
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

        {/* Total Carbon Emissions */}
        <Grid item xs={12} md={3}>
          <Paper className="stat-card eco-card">
            <Typography variant="h6">Carbon Emissions</Typography>
            <Typography variant="h3">{(carbonStats.totalEmissions / 1000).toFixed(2)} tons</Typography>
            <Typography variant="body2" color="textSecondary">
              {carbonStats.percentOptimized}% routes optimized
            </Typography>
          </Paper>
        </Grid>

        {/* Carbon Savings */}
        <Grid item xs={12} md={3}>
          <Paper className="stat-card eco-card">
            <Typography variant="h6">Emissions Saved</Typography>
            <Typography variant="h3">{(carbonStats.totalSavings / 1000).toFixed(2)} tons</Typography>
            <Typography variant="body2" color="textSecondary">
              Through route optimization
            </Typography>
          </Paper>
        </Grid>

        {/* Carbon Offset */}
        <Grid item xs={12} md={3}>
          <Paper className="stat-card eco-card">
            <Typography variant="h6">Carbon Offset</Typography>
            <Typography variant="h3">{(carbonStats.totalOffset / 1000).toFixed(2)} tons</Typography>
            <Typography variant="body2" color="textSecondary">
              Through carbon credits
            </Typography>
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

        {/* Carbon Emissions Trend */}
        <Grid item xs={12} md={6}>
          <Paper className="chart-card">
            <Typography variant="h6">Carbon Emissions & Savings Trend</Typography>
            <AreaChart
              width={500}
              height={300}
              data={carbonStats.emissionTrend}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="emissions" stackId="1" stroke="#F44336" fill="#F44336" fillOpacity={0.5} />
              <Area type="monotone" dataKey="savings" stackId="2" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.5} />
            </AreaChart>
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

        {/* Emissions by Route */}
        <Grid item xs={12} md={6}>
          <Paper className="chart-card">
            <Typography variant="h6">Carbon Emissions by Route</Typography>
            <BarChart
              width={500}
              height={300}
              data={carbonStats.emissionsByRoute}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="emissions" fill="#F44336" />
            </BarChart>
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