import React, { useEffect, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer, ScatterChart, Scatter
} from 'recharts';
import { FaChartBar, FaChartPie, FaChartLine, FaUserShield, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsDashboard = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const BASE_URL = import.meta.env.MONGO_URI || 'http://localhost:5000';
                const response = await fetch(`${BASE_URL}/api/results/analysis/dashboard`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>Error loading dashboard: {error}</p>
        </div>
    );

    if (!data) return null;

    // Prepare data for charts
    const riskData = [
        { name: 'Low', value: data.riskDistribution.low, color: '#10B981' },
        { name: 'Moderate', value: data.riskDistribution.moderate, color: '#F59E0B' },
        { name: 'High', value: data.riskDistribution.high, color: '#EF4444' }
    ];

    const ageData = Object.entries(data.ageGroups).map(([name, value]) => ({
        name,
        value
    }));

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">


                <button
                    onClick={() => navigate("/")}
                    className="flex items-center bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg mr-4 transition-colors duration-200"
                >
                    <FaArrowLeft className="mr-2" />
                    Home
                </button>
                <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                    <FaChartLine className="mr-2" /> Diabetes Risk Analytics Dashboard
                </h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                        <h3 className="text-gray-500 font-medium">Total Users</h3>
                        <p className="text-3xl font-bold text-gray-800">{data.totalUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                        <h3 className="text-gray-500 font-medium">Low Risk</h3>
                        <p className="text-3xl font-bold text-green-600">{data.riskDistribution.low}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
                        <h3 className="text-gray-500 font-medium">Moderate Risk</h3>
                        <p className="text-3xl font-bold text-yellow-600">{data.riskDistribution.moderate}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                        <h3 className="text-gray-500 font-medium">High Risk</h3>
                        <p className="text-3xl font-bold text-red-600">{data.riskDistribution.high}</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Risk Distribution Pie Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <FaChartPie className="mr-2 text-blue-500" /> Risk Level Distribution
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={riskData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {riskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Age Group Bar Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                            <FaChartBar className="mr-2 text-blue-500" /> Age Group Distribution
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ageData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value" fill="#4F46E5" name="Users" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* BMI vs Risk Scatter Plot */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FaUserShield className="mr-2 text-blue-500" /> BMI vs Risk Percentage
                    </h3>
                    <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart
                                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                            >
                                <CartesianGrid />
                                <XAxis type="number" dataKey="bmi" name="BMI" unit="" />
                                <YAxis type="number" dataKey="risk" name="Risk %" unit="%" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Legend />
                                <Scatter name="Users" data={data.bmiData} fill="#8884d8" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Assessments Table */}
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    <h3 className="text-lg font-semibold mb-4">Recent Assessments</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.allResults.slice(0, 10).map((result, index) => {
                                const bmi = (result.weight / ((result.height / 100) ** 2)).toFixed(1);
                                return (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.age}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bmi}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${result.riskLevel.level === 'High' ? 'bg-red-100 text-red-800' :
                                                    result.riskLevel.level === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'}`}>
                                                {result.riskLevel.level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.riskLevel.percentage}%</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(result.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;