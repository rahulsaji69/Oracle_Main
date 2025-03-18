const tf = require('@tensorflow/tfjs-node');
const Booking = require('../Models/Bookings');

async function analyzeHistoricalData(shipId, route) {
  try {
    // Get historical bookings for the ship
    const historicalBookings = await Booking.find({
      'assignedShip': shipId,
      'status': 'COMPLETED'
    }).sort({ createdAt: -1 }).limit(50);

    // Calculate performance metrics
    const performanceMetrics = calculatePerformanceMetrics(historicalBookings);

    // Analyze patterns
    const patterns = analyzePatterns(historicalBookings);

    // Calculate impact factors
    const impact = calculateImpactFactors(performanceMetrics, patterns);

    return {
      performanceMetrics,
      patterns,
      impact
    };
  } catch (error) {
    console.error('Error analyzing historical data:', error);
    return {
      performanceMetrics: {},
      patterns: {},
      impact: 1
    };
  }
}

function calculatePerformanceMetrics(bookings) {
  const metrics = {
    averageEmissions: 0,
    averageSavings: 0,
    optimizationRate: 0,
    reliability: 0
  };

  if (bookings.length === 0) return metrics;

  const totalEmissions = bookings.reduce((sum, booking) => 
    sum + (booking.carbonEmissions?.estimatedTotalEmissions || 0), 0);
  
  const totalSavings = bookings.reduce((sum, booking) => 
    sum + (booking.carbonEmissions?.emissionSavings || 0), 0);
  
  const optimizedRoutes = bookings.filter(booking => 
    booking.carbonEmissions?.optimizedRoute).length;

  metrics.averageEmissions = totalEmissions / bookings.length;
  metrics.averageSavings = totalSavings / bookings.length;
  metrics.optimizationRate = (optimizedRoutes / bookings.length) * 100;
  metrics.reliability = calculateReliability(bookings);

  return metrics;
}

function analyzePatterns(bookings) {
  const patterns = {
    seasonalTrends: {},
    routeEfficiency: {},
    weatherImpact: {},
    cargoTypeImpact: {}
  };

  // Analyze seasonal trends
  bookings.forEach(booking => {
    const month = new Date(booking.createdAt).getMonth();
    if (!patterns.seasonalTrends[month]) {
      patterns.seasonalTrends[month] = {
        count: 0,
        totalEmissions: 0,
        averageSavings: 0
      };
    }
    patterns.seasonalTrends[month].count++;
    patterns.seasonalTrends[month].totalEmissions += 
      booking.carbonEmissions?.estimatedTotalEmissions || 0;
    patterns.seasonalTrends[month].averageSavings += 
      booking.carbonEmissions?.emissionSavings || 0;
  });

  // Calculate averages for each month
  Object.keys(patterns.seasonalTrends).forEach(month => {
    const data = patterns.seasonalTrends[month];
    data.averageEmissions = data.totalEmissions / data.count;
    data.averageSavings = data.averageSavings / data.count;
  });

  // Analyze route efficiency
  bookings.forEach(booking => {
    const route = `${booking.originPort}-${booking.destinationPort}`;
    if (!patterns.routeEfficiency[route]) {
      patterns.routeEfficiency[route] = {
        count: 0,
        totalEmissions: 0,
        totalDistance: 0
      };
    }
    patterns.routeEfficiency[route].count++;
    patterns.routeEfficiency[route].totalEmissions += 
      booking.carbonEmissions?.estimatedTotalEmissions || 0;
    patterns.routeEfficiency[route].totalDistance += 
      booking.distance || 0;
  });

  // Calculate efficiency metrics for each route
  Object.keys(patterns.routeEfficiency).forEach(route => {
    const data = patterns.routeEfficiency[route];
    data.averageEmissions = data.totalEmissions / data.count;
    data.averageDistance = data.totalDistance / data.count;
    data.efficiency = data.averageEmissions / data.averageDistance;
  });

  return patterns;
}

function calculateReliability(bookings) {
  const onTimeDeliveries = bookings.filter(booking => {
    const estimatedArrival = new Date(booking.estimatedArrival);
    const actualArrival = new Date(booking.actualArrival);
    const timeDiff = Math.abs(actualArrival - estimatedArrival);
    return timeDiff <= 24 * 60 * 60 * 1000; // Within 24 hours
  }).length;

  return (onTimeDeliveries / bookings.length) * 100;
}

function calculateImpactFactors(performanceMetrics, patterns) {
  // Calculate overall impact factor based on various metrics
  const emissionImpact = performanceMetrics.averageEmissions > 1000 ? 1.2 : 0.8;
  const savingsImpact = performanceMetrics.averageSavings > 100 ? 0.8 : 1.2;
  const optimizationImpact = performanceMetrics.optimizationRate > 70 ? 0.9 : 1.1;
  const reliabilityImpact = performanceMetrics.reliability > 90 ? 0.9 : 1.1;

  // Calculate seasonal impact
  const currentMonth = new Date().getMonth();
  const seasonalData = patterns.seasonalTrends[currentMonth];
  const seasonalImpact = seasonalData ? 
    (seasonalData.averageEmissions > 1000 ? 1.2 : 0.8) : 1;

  // Calculate route impact
  const routeEfficiency = Object.values(patterns.routeEfficiency)
    .reduce((sum, route) => sum + route.efficiency, 0) / 
    Object.keys(patterns.routeEfficiency).length;
  const routeImpact = routeEfficiency > 0.5 ? 1.2 : 0.8;

  // Combine all factors
  const impact = (
    emissionImpact +
    savingsImpact +
    optimizationImpact +
    reliabilityImpact +
    seasonalImpact +
    routeImpact
  ) / 6;

  return impact;
}

module.exports = {
  analyzeHistoricalData
}; 