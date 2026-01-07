'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SimulationDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSimulationData();
    }, []);

    const loadSimulationData = async () => {
        try {
            const response = await fetch('/simulation_results.json');
            const jsonData = await response.json();
            setData(jsonData);
            setLoading(false);
        } catch (error) {
            console.error('Error loading simulation data:', error);
            setLoading(false);
        }
    };

    const runSimulation = async () => {
        setLoading(true);
        // In a real scenario, this would trigger the backend script
        // For now, we'll just reload the data
        setTimeout(() => {
            loadSimulationData();
        }, 1000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading simulation data...</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-white text-xl">No simulation data available</div>
            </div>
        );
    }

    // Calculate cumulative tokens
    const cumulativeData = data.dailyMetrics.map((day, index) => {
        const cumulative = data.dailyMetrics
            .slice(0, index + 1)
            .reduce((sum, d) => sum + d.tokensDistributed, 0);
        return {
            ...day,
            cumulativeTokens: parseFloat(cumulative.toFixed(1)),
        };
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        📊 Pilot Study Analytics
                    </h1>
                    <p className="text-gray-300 text-lg">
                        14-Day Simulation: Control vs Incentive Group
                    </p>
                    <button
                        onClick={runSimulation}
                        className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                    >
                        🔄 Run New Simulation
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-200">
                        <div className="text-gray-400 text-sm mb-2">Control Group</div>
                        <div className="text-3xl font-bold text-white">{data.summary.controlGroupCompliance}%</div>
                        <div className="text-gray-300 text-xs mt-1">Compliance Rate</div>
                    </div>

                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-200">
                        <div className="text-gray-400 text-sm mb-2">Incentive Group</div>
                        <div className="text-3xl font-bold text-green-400">{data.summary.incentiveGroupCompliance}%</div>
                        <div className="text-gray-300 text-xs mt-1">Compliance Rate</div>
                    </div>

                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-200">
                        <div className="text-gray-400 text-sm mb-2">Improvement</div>
                        <div className="text-3xl font-bold text-purple-400">+{data.summary.complianceImprovement}%</div>
                        <div className="text-gray-300 text-xs mt-1">vs Control</div>
                    </div>

                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-200">
                        <div className="text-gray-400 text-sm mb-2">Total Distributed</div>
                        <div className="text-3xl font-bold text-yellow-400">{data.summary.totalTokensDistributed}</div>
                        <div className="text-gray-300 text-xs mt-1">HLT Tokens</div>
                    </div>

                    <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-200">
                        <div className="text-gray-400 text-sm mb-2">Batch Submissions</div>
                        <div className="text-3xl font-bold text-blue-400">{data.summary.averageBatchSubmissionRate}%</div>
                        <div className="text-gray-300 text-xs mt-1">Complete Logs</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Compliance Rate Chart */}
                    <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">📈 Daily Compliance Rate</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.dailyMetrics}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="day" stroke="#999" label={{ value: 'Day', position: 'insideBottom', offset: -5, fill: '#999' }} />
                                <YAxis stroke="#999" label={{ value: 'Compliance (%)', angle: -90, position: 'insideLeft', fill: '#999' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #444', borderRadius: '8px' }} />
                                <Legend />
                                <Line type="monotone" dataKey="controlCompliance" stroke="#ef4444" name="Control Group" strokeWidth={2} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="incentiveCompliance" stroke="#22c55e" name="Incentive Group" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Cumulative Tokens Chart */}
                    <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">💰 Cumulative Tokens Distributed</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={cumulativeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="day" stroke="#999" label={{ value: 'Day', position: 'insideBottom', offset: -5, fill: '#999' }} />
                                <YAxis stroke="#999" label={{ value: 'HLT Tokens', angle: -90, position: 'insideLeft', fill: '#999' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #444', borderRadius: '8px' }} />
                                <Legend />
                                <Bar dataKey="cumulativeTokens" fill="#a855f7" name="Total HLT Distributed" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Batch Submission Rate Chart */}
                <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 mb-12">
                    <h3 className="text-2xl font-bold text-white mb-6">✅ Batch Submission Rate (Data Quality)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.dailyMetrics}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="day" stroke="#999" label={{ value: 'Day', position: 'insideBottom', offset: -5, fill: '#999' }} />
                            <YAxis stroke="#999" label={{ value: 'Batch Rate (%)', angle: -90, position: 'insideLeft', fill: '#999' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #444', borderRadius: '8px' }} />
                            <Legend />
                            <Line type="monotone" dataKey="batchSubmissionRate" stroke="#3b82f6" name="Complete Submissions" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                    <p className="text-gray-400 text-sm mt-4">
                        Batch submission rate indicates the percentage of logs where users submitted all three health metrics (steps, water, sleep) together, earning the completeness bonus (1.5x multiplier).
                    </p>
                </div>

                {/* Detailed Stats */}
                <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">Study Metadata</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                        <div>
                            <p className="text-sm text-gray-400">Simulation Date</p>
                            <p className="font-semibold">{new Date(data.metadata.simulationDate).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Duration</p>
                            <p className="font-semibold">{data.metadata.duration} days</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Control Group Size</p>
                            <p className="font-semibold">{data.metadata.controlGroupSize} participants</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Incentive Group Size</p>
                            <p className="font-semibold">{data.metadata.incentiveGroupSize} participants</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Average Tokens per User</p>
                            <p className="font-semibold">{data.summary.averageTokensPerUser} HLT</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Effectiveness</p>
                            <p className="font-semibold text-green-400">
                                {((data.summary.complianceImprovement / data.summary.controlGroupCompliance) * 100).toFixed(1)}% increase
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-gray-400 text-sm space-y-2">
                    <p className="text-gray-300 font-medium">Ceyda Arık • Hakan Kayacı</p>
                    <p>Muğla Sıtkı Koçman University</p>
                    <p>CENG3550 • Instructor: Enis Karaarslan</p>
                </div>
            </div>
        </div>
    );
}
