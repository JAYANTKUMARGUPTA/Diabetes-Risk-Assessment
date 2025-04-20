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

module.exports = router;