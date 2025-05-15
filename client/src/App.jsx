import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DiabetesPortal from "./components/DiabetesPortal";
import AnalyticsDashboard from './components/AnalyticsDashboard';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <Routes>
          {/* Default route */}
          <Route path="/" element={<DiabetesPortal />} />
          
          {/* Analytics route */}
          <Route path="/analytics" element={<AnalyticsDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
