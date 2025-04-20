// const mongoose = require('mongoose');

// const assessmentSchema = new mongoose.Schema({
//   age: Number,
//   weight: Number,
//   height: Number,
//   bloodSugar: Number,
//   hba1c: Number,
//   familyHistory: Boolean,
//   hypertension: Boolean,
//   heartDisease: Boolean,
//   increasedThirst: Boolean,
//   frequentUrination: Boolean,
//   fatigue: Boolean,
//   weightLoss: Boolean,
//   riskLevel: String,
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Assessment', assessmentSchema);

const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }},
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    familyHistory: Boolean,
    hypertension: Boolean,
    heartDisease: Boolean,
    hbA1c: Number,
    bloodSugar: Number,
    symptoms: {
      increasedThirst: Boolean,
      frequentUrination: Boolean,
      unexpectedFatigue: Boolean,
      weightLoss: Boolean,
    },
    riskLevel: {
      level: String,
      percentage: Number,
      description: String,
      keyFactors: [String],
      recommendations: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

module.exports = mongoose.model("Result", resultSchema);
