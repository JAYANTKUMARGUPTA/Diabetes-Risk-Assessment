// const express = require("express");
// const router = express.Router();
// const Result = require("../models/Result");

// // POST endpoint to save the result
// router.post("/submit", async (req, res) => {
//   try {
//     const newResult = new Result(req.body);
//     const savedResult = await newResult.save();
//     res.status(200).json({ message: "Result saved", data: savedResult });
//   } catch (error) {
//     res.status(500).json({ message: "Error saving result", error });
//   }
// });

// module.exports = router;


// mongodb atlas connection
const express = require("express");
const router = express.Router();
const Result = require("../models/Result");

// GET all results

router.get("/", async (req, res) => {
  try {
    const results = await Result.find().sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching results", error });
  }
});

// GET single result by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching result", error });
  }
});

// POST new result
router.post("/submit", async (req, res) => {
  try {
    if (!req.body.percentage || !req.body.keyFactors) {
      return res.status(200).json({ message: "Result to be saved" });
    }
    const newResult = new Result(req.body);
    const savedResult = await newResult.save();
    res.status(201).json(savedResult);
  } catch (error) {
    res.status(400).json({ message: "Error saving result", error });
  }
});

// DELETE result by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedResult = await Result.findByIdAndDelete(req.params.id);
    if (!deletedResult) {
      return res.status(404).json({ message: "Result not found" });
    }
    res.status(200).json({ message: "Result deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting result", error });
  }
});

// Add this new route before module.exports
router.get("/analysis/dashboard", async (req, res) => {
  try {
    // Get all results sorted by risk percentage
    const results = await Result.find().sort({ "riskLevel.percentage": -1 });
    
    // Calculate statistics
    const totalUsers = results.length;
    const riskDistribution = {
      low: results.filter(r => r.riskLevel.level === "Low").length,
      moderate: results.filter(r => r.riskLevel.level === "Moderate").length,
      high: results.filter(r => r.riskLevel.level === "High").length
    };
    
    // Age distribution
    const ageGroups = {
      "18-30": results.filter(r => r.age >= 18 && r.age <= 30).length,
      "31-45": results.filter(r => r.age > 30 && r.age <= 45).length,
      "46-60": results.filter(r => r.age > 45 && r.age <= 60).length,
      "60+": results.filter(r => r.age > 60).length
    };
    
    // BMI analysis
    const bmiData = results.map(r => {
      const bmi = r.weight / ((r.height / 100) ** 2);
      return {
        bmi: bmi.toFixed(1),
        risk: r.riskLevel.percentage
      };
    });
    
    res.status(200).json({
      totalUsers,
      riskDistribution,
      ageGroups,
      bmiData,
      allResults: results
    });
    
  } catch (error) {
    res.status(500).json({ message: "Error fetching analysis data", error });
  }
});

module.exports = router;