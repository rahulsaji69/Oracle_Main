const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const indexRoutes = require("./Routes/indexRoutes");
const paymentRoutes = require('./Routes/paymentRoutes');
const supportRoutes = require('./Routes/supportRoutes');
const carbonEmissionsRoutes = require('./Routes/carbonEmissionsRoutes');
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api", indexRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/carbon', carbonEmissionsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
