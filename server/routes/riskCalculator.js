// const express = require("express");
// const router = express.Router();

// // Validation middleware

// const validateRequest = (req, res, next) => {
//     const { name, phone, age, weight, height, hbA1c, bloodSugar } = req.body;

//     // Name validation
//     if (!name || typeof name !== 'string') {
//         return res.status(400).json({ message: "Valid name is required" });
//     }
//     if (name.length < 2 || name.length > 50) {
//         return res.status(400).json({ message: "Name must be 2-50 characters" });
//     }

//     // Phone validation
//     if (!phone) {
//         return res.status(400).json({ message: "Phone number is required" });
//     }
    
//     // Clean phone number (remove all non-digit characters)
//     const cleanedPhone = phone.replace(/\D/g, '');
    
//     if (!/^\d{10,15}$/.test(cleanedPhone)) {
//         return res.status(400).json({ 
//             message: "Phone number must be 10-15 digits (international numbers accepted)" 
//         });
//     }
    
//     // Store cleaned version back to request
//     req.body.phone = cleanedPhone;

//     // Other field validations
//     if (!age || !weight || !height || !hbA1c || !bloodSugar) {
//         return res.status(400).json({ message: "Missing required fields" });
//     }
//     if (isNaN(age)) return res.status(400).json({ message: "Age must be a number" });
//     if (age > 120) return res.status(400).json({ message: "Age must be under 120" });
//     if (age < 1) return res.status(400).json({ message: "Age must be positive" });

//     next();
// };

// // Risk calculation logic (extracted for better organization)
// const calculateRiskScore = (data) => {
//     let score = 0;
//     const age = Number(data.age);
//     const weight = parseFloat(data.weight);
//     const height = parseFloat(data.height);
//     const hbA1c = Number(data.hbA1c);
//     const bloodSugar = Number(data.bloodSugar);
//     const bmi = weight / ((height / 100) ** 2);

//     // BMI scoring
//     if (bmi > 25) score += 2;

//     // Medical history scoring
//     if (data.familyHistory) score += 3;
//     if (data.hypertension) score += 2;
//     if (data.heartDisease) score += 2;

//     // Age scoring
//     if (age > 45) score += 2;

//     // HbA1c scoring
//     if (hbA1c > 6.5) score += 4;
//     else if (hbA1c > 5.6) score += 2;

//     // Blood sugar scoring
//     if (bloodSugar < 140) score += 2;
//     else if (bloodSugar < 199) score += 3;
//     else score += 4;

//     // Symptoms scoring
//     Object.values(data.symptoms).forEach(val => val && score++);

//     return Math.min(Math.round((score / 20) * 100), 100);
// };

// // Generate key risk factors
// const getKeyFactors = (data) => {
//     const factors = [];
//     const age = Number(data.age);
//     const weight = parseFloat(data.weight);
//     const height = parseFloat(data.height);
//     const hbA1c = Number(data.hbA1c);
//     const bloodSugar = Number(data.bloodSugar);
//     const bmi = weight / ((height / 100) ** 2);

//     if (age > 45) factors.push("Age over 45");
//     if (bmi > 25) factors.push(`BMI over 25 (${bmi.toFixed(1)})`);
//     if (data.familyHistory) factors.push("Family history of diabetes");
//     if (data.hypertension) factors.push("Hypertension");
//     if (data.heartDisease) factors.push("Heart disease");
//     if (hbA1c > 6.5) factors.push(`Elevated hbA1c (${hbA1c}%)`);
//     if (bloodSugar > 199) factors.push(`High blood sugar (${bloodSugar} mg/dL)`);

//     const activeSymptoms = Object.entries(data.symptoms)
//         .filter(([_, v]) => v)
//         .map(([key]) => key.replace(/([A-Z])/g, " $1").trim());

//     if (activeSymptoms.length > 0) {
//         factors.push(`Symptoms: ${activeSymptoms.join(', ')}`);
//     }

//     return factors;
// };

// // Route handler
// router.post("/calculate-risk", validateRequest, (req, res) => {
//     try {
//         const { name,phone } = req.body;
//         const percentage = calculateRiskScore(req.body);
//         const keyFactors = getKeyFactors(req.body);

//         const baseResult = {
//             name,
//             phone,
//             percentage,
//             keyFactors,
//             timestamp: new Date().toISOString()
//         };

//         // Determine risk level
//         if (percentage <= 25) {
//             res.json({
//                 ...baseResult,
//                 level: "Low",
//                 color: "bg-green-400",
//                 description: "Your risk of developing diabetes is relatively low.",
//                 recommendations: [
//                     "Maintain a healthy diet and regular exercise",
//                     "Get annual check-ups",
//                     "Stay aware of symptoms"
//                 ]
//             });
//         } else if (percentage <= 50) {
//             res.json({
//                 ...baseResult,
//                 level: "Moderate",
//                 color: "bg-yellow-400",
//                 description: "You have some risk factors. Consider lifestyle changes.",
//                 recommendations: [
//                     "Consult a healthcare provider",
//                     "Improve your diet and exercise routine",
//                     "Monitor your blood sugar"
//                 ]
//             });
//         } else {
//             res.json({
//                 ...baseResult,
//                 level: "High",
//                 color: "bg-red-500",
//                 description: "You have high risk factors. Seek medical attention.",
//                 recommendations: [
//                     "Consult your doctor immediately",
//                     "Start a diabetes prevention program",
//                     "Monitor blood sugar frequently"
//                 ]
//             });
//         }

//     } catch (error) {
//         console.error("Risk calculation error:", error);
//         res.status(500).json({
//             message: "Error processing risk calculation",
//             error: error.message
//         });
//     }
//     res.json({ riskLevel });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Result = require("../models/Result");

// Validation middleware
const validateRequest = (req, res, next) => {
    const { name, phone, age, weight, height, hbA1c, bloodSugar } = req.body;

    // Name validation
    if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: "Valid name is required" });
    }
    if (name.length < 2 || name.length > 50) {
        return res.status(400).json({ message: "Name must be 2-50 characters" });
    }

    // Phone validation
    if (!phone) {
        return res.status(400).json({ message: "Phone number is required" });
    }
    
    const cleanedPhone = phone.replace(/\D/g, '');
    
    if (!/^\d{10,15}$/.test(cleanedPhone)) {
        return res.status(400).json({ 
            message: "Phone number must be 10-15 digits" 
        });
    }
    
    req.body.phone = cleanedPhone;

    // Other validations
    if (!age || !weight || !height || !hbA1c || !bloodSugar) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    if (isNaN(age)) return res.status(400).json({ message: "Age must be a number" });
    if (age > 120) return res.status(400).json({ message: "Age must be under 120" });
    if (age < 1) return res.status(400).json({ message: "Age must be positive" });

    next();
};

// Risk calculation logic
const calculateRiskScore = (data) => {
    let score = 0;
    const age = Number(data.age);
    const weight = parseFloat(data.weight);
    const height = parseFloat(data.height);
    const hbA1c = Number(data.hbA1c);
    const bloodSugar = Number(data.bloodSugar);
    const bmi = weight / ((height / 100) ** 2);

    if (bmi > 25) score += 2;
    if (data.familyHistory) score += 3;
    if (data.hypertension) score += 2;
    if (data.heartDisease) score += 2;
    if (age > 45) score += 2;

    if (hbA1c < 5.7) score += 2;
    else if (hbA1c >= 5.6 && hbA1c <= 6.4) score += 3;
    else score += 4;

    if (bloodSugar < 70) score += 4;
    else if (bloodSugar >= 70 && bloodSugar <= 99 ) score += 2;
    else if (bloodSugar >= 100 && bloodSugar <= 125 ) score += 3;
    else score +=4;

    Object.values(data.symptoms).forEach(val => val && score++);

    return Math.min(Math.round((score / 20) * 100), 100);
};

// Generate key risk factors
const getKeyFactors = (data) => {
    const factors = [];
    const age = Number(data.age);
    const weight = parseFloat(data.weight);
    const height = parseFloat(data.height);
    const hbA1c = Number(data.hbA1c);
    const bloodSugar = Number(data.bloodSugar);
    const bmi = weight / ((height / 100) ** 2);

    if (age > 45) factors.push("Age over 45");
    if (bmi > 25) factors.push(`BMI over 25 (${bmi.toFixed(1)})`);
    if (data.familyHistory) factors.push("Family history of diabetes");
    if (data.hypertension) factors.push("Hypertension");
    if (data.heartDisease) factors.push("Heart disease");
    if (hbA1c > 6.5) factors.push(`Elevated hbA1c (${hbA1c}%)`);
    if (bloodSugar > 125) factors.push(`High blood sugar (${bloodSugar} mg/dL)`);

    const activeSymptoms = Object.entries(data.symptoms)
        .filter(([_, v]) => v)
        .map(([key]) => key.replace(/([A-Z])/g, " $1").trim());

    if (activeSymptoms.length > 0) {
        factors.push(`Symptoms: ${activeSymptoms.join(', ')}`);
    }

    return factors;
};

// Route handler
router.post("/calculate-risk", validateRequest, async (req, res) => {
    try {
        const { name, phone } = req.body;
        const percentage = calculateRiskScore(req.body);
        const keyFactors = getKeyFactors(req.body);

        let riskLevel;
        if (percentage <= 25) {
            riskLevel = {
                level: "Low",
                color: "bg-green-400",
                description: "Your risk of developing diabetes is relatively low.",
                recommendations: [
                    "Maintain a healthy diet and regular exercise",
                    "Get annual check-ups",
                    "Stay aware of symptoms"
                ]
            };
        } else if (percentage <= 50) {
            riskLevel = {
                level: "Moderate",
                color: "bg-yellow-400",
                description: "You have some risk factors. Consider lifestyle changes.",
                recommendations: [
                    "Consult a healthcare provider",
                    "Improve your diet and exercise routine",
                    "Monitor your blood sugar"
                ]
            };
        } else {
            riskLevel = {
                level: "High",
                color: "bg-red-500",
                description: "You have high risk factors. Seek medical attention.",
                recommendations: [
                    "Consult your doctor immediately",
                    "Start a diabetes prevention program",
                    "Monitor blood sugar frequently"
                ]
            };
        }

        // Save to MongoDB
        const resultData = {
            name,
            phone,
            age: req.body.age,
            gender: req.body.gender,
            height: req.body.height,
            weight: req.body.weight,
            familyHistory: req.body.familyHistory,
            hypertension: req.body.hypertension,
            heartDisease: req.body.heartDisease,
            hbA1c: req.body.hbA1c,
            bloodSugar: req.body.bloodSugar,
            symptoms: req.body.symptoms,
            riskLevel: {
                level: riskLevel.level,
                percentage: percentage,
                description: riskLevel.description,
                keyFactors: keyFactors,
                recommendations: riskLevel.recommendations
            }
        };

        const savedResult = await Result.create(resultData);

        res.json({
            ...riskLevel,
            name,
            phone,
            percentage,
            keyFactors,
            timestamp: new Date().toISOString(),
            // id: savedResult._id
        });

    } catch (error) {
        console.error("Risk calculation error:", error);
        res.status(500).json({
            message: "Error processing risk calculation",
            error: error.message
        });
    }
});

module.exports = router;