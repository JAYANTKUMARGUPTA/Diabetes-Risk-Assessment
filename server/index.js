
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/diabetes-db-jayant")
// .then(() => console.log("MongoDB connected"))
// .catch((err) => console.error("MongoDB connection error:", err));

// // Import Routes
// const calculateRiskRoute = require("./routes/riskCalculator");
// const resultsRoute = require("./routes/resultRoutes");

// // Use Routes
// app.use("/api", calculateRiskRoute);
// app.use("/api/results", resultsRoute);

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

//atlas
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB Atlas
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/diabetes-db-jayant";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority'
})
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.error("MongoDB connection error:", err));

// Import Routes
const calculateRiskRoute = require("./routes/riskCalculator");
const resultsRoute = require("./routes/resultRoutes");

// Use Routes
app.use("/api", calculateRiskRoute); //change
app.use("/api/results", resultsRoute);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

