'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Home() {
    const [walletAddress, setWalletAddress] = useState('');
    const [balance, setBalance] = useState('0');
    const [waterAmount, setWaterAmount] = useState('');
    const [stepCount, setStepCount] = useState('');
    const [sleepHours, setSleepHours] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Connect wallet
    const connectWallet = async () => {
        console.log("Connecting...");

        try {
            // Check if MetaMask is installed
            if (typeof window.ethereum === 'undefined') {
                console.error('MetaMask not found');
                setMessage({ type: 'error', text: 'Please install MetaMask!' });
                return;
            }

            console.log('MetaMask detected, requesting accounts...');

            // Request account access using window.ethereum directly
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            console.log('Accounts received:', accounts);

            if (accounts.length > 0) {
                setWalletAddress(accounts[0]);
                console.log('Wallet connected:', accounts[0]);
                setMessage({ type: 'success', text: 'Wallet connected successfully!' });

                // Fetch balance
                await fetchBalance(accounts[0]);
            } else {
                console.error('No accounts found');
                setMessage({ type: 'error', text: 'No accounts found' });
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            console.error('Error details:', error.message);
            setMessage({ type: 'error', text: `Failed to connect wallet: ${error.message}` });
        }
    };

    // Fetch token balance
    const fetchBalance = async (address) => {
        try {
            const response = await fetch(`/api/balance?address=${address}`);
            const data = await response.json();

            if (data.success) {
                setBalance(parseFloat(data.balance).toFixed(2));
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    // Submit health log
    const submitLog = async (e) => {
        e.preventDefault();

        if (!walletAddress) {
            setMessage({ type: 'error', text: 'Please connect your wallet first!' });
            return;
        }

        if (!waterAmount || !stepCount || !sleepHours) {
            setMessage({ type: 'error', text: 'Please fill in all fields!' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('/api/log-activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userAddress: walletAddress,
                    waterAmount: parseFloat(waterAmount),
                    stepCount: parseInt(stepCount),
                    sleepHours: parseFloat(sleepHours),
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({
                    type: 'success',
                    text: `🎉 Success! You earned ${data.reward} HLT tokens! (Log #${data.logNumber} today)`
                });

                // Clear form
                setWaterAmount('');
                setStepCount('');
                setSleepHours('');

                // Refresh balance
                await fetchBalance(walletAddress);
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch (error) {
            console.error('Error submitting log:', error);
            setMessage({ type: 'error', text: 'Failed to submit log. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    // Auto-refresh balance when wallet is connected
    useEffect(() => {
        if (walletAddress) {
            const interval = setInterval(() => {
                fetchBalance(walletAddress);
            }, 10000); // Refresh every 10 seconds

            return () => clearInterval(interval);
        }
    }, [walletAddress]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                        🏥 HealthToken System
                    </h1>
                    <p className="text-gray-300 text-lg">
                        Earn HLT tokens by logging your daily health activities
                    </p>
                </div>

                {/* Main Card */}
                <div className="max-w-2xl mx-auto">
                    <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">

                        {/* Wallet Connection */}
                        {!walletAddress ? (
                            <div className="text-center py-12">
                                <div className="mb-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
                                <p className="text-gray-300 mb-8">Connect your MetaMask wallet to start earning health tokens</p>
                                <button
                                    onClick={connectWallet}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
                                >
                                    Connect Wallet
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Wallet Info */}
                                <div className="mb-8 p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-gray-300 text-sm">Connected Wallet</span>
                                        <span className="text-xs text-gray-400 font-mono bg-black/30 px-3 py-1 rounded-lg">
                                            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300 text-sm">Your Balance</span>
                                        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                            {balance} HLT
                                        </span>
                                    </div>
                                </div>

                                {/* Health Log Form */}
                                <form onSubmit={submitLog} className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white mb-6">📊 Log Your Daily Health Data</h3>

                                    {/* Water Intake */}
                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">
                                            💧 Water Intake (Liters)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={waterAmount}
                                            onChange={(e) => setWaterAmount(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="e.g., 2.5"
                                            required
                                        />
                                    </div>

                                    {/* Step Count */}
                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">
                                            👟 Step Count
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={stepCount}
                                            onChange={(e) => setStepCount(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="e.g., 10000"
                                            required
                                        />
                                    </div>

                                    {/* Sleep Hours */}
                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">
                                            😴 Sleep Duration (Hours)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max="24"
                                            value={sleepHours}
                                            onChange={(e) => setSleepHours(e.target.value)}
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                            placeholder="e.g., 8"
                                            required
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            'Submit Daily Log'
                                        )}
                                    </button>
                                </form>

                                {/* Message Display */}
                                {message.text && (
                                    <div className={`mt-6 p-4 rounded-xl ${message.type === 'success'
                                        ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                                        : 'bg-red-500/20 border border-red-500/30 text-red-300'
                                        }`}>
                                        <p className="font-medium">{message.text}</p>
                                    </div>
                                )}

                                {/* Info Box */}
                                <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                                    <h4 className="text-white font-semibold mb-3">ℹ️ Reward System</h4>
                                    <ul className="text-gray-300 text-sm space-y-2">
                                        <li>• 1st log today: <span className="text-purple-400 font-semibold">7.5 HLT</span> (5 × 1.5 completeness bonus)</li>
                                        <li>• 2nd log today: <span className="text-purple-400 font-semibold">4.5 HLT</span> (3 × 1.5)</li>
                                        <li>• 3rd+ log today: <span className="text-purple-400 font-semibold">3 HLT</span> (2 × 1.5)</li>
                                        <li>• Cooldown: <span className="text-yellow-400 font-semibold">120 minutes</span> between logs</li>
                                        <li>• Daily limit: <span className="text-yellow-400 font-semibold">10 logs maximum</span></li>
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-8 text-gray-400 text-sm space-y-2">
                        <p className="text-gray-300 font-medium">Ceyda Arık • Hakan Kayacı</p>
                        <p>Muğla Sıtkı Koçman University</p>
                        <p>CENG3550 • Instructor: Enis Karaarslan</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
