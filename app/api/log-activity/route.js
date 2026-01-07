import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// In-memory storage for MVP (replace with database in production)
const userLogs = new Map();

// Business logic constants
const COOLDOWN_MINUTES = 120;
const DAILY_CAP = 10;
const REWARD_DECAY = [5, 3, 2]; // 1st log: 5 HLT, 2nd: 3 HLT, 3rd+: 2 HLT

// Contract ABI (only the functions we need)
const CONTRACT_ABI = [
    "function rewardUser(address user, uint256 amount) external",
    "function balanceOf(address account) view returns (uint256)"
];

export async function POST(request) {
    try {
        const body = await request.json();
        const { userAddress, waterAmount, stepCount, sleepHours } = body;

        // Validation: Check all fields are provided
        if (!userAddress || !waterAmount || !stepCount || !sleepHours) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'All fields are required: userAddress, waterAmount, stepCount, sleepHours'
                },
                { status: 400 }
            );
        }

        // Validate Ethereum address
        if (!ethers.isAddress(userAddress)) {
            return NextResponse.json(
                { success: false, error: 'Invalid Ethereum address' },
                { status: 400 }
            );
        }

        // Get user's log history
        const userKey = userAddress.toLowerCase();
        if (!userLogs.has(userKey)) {
            userLogs.set(userKey, []);
        }
        const logs = userLogs.get(userKey);

        const now = Date.now();
        const today = new Date().toDateString();

        // Check cooldown (120 minutes)
        if (logs.length > 0) {
            const lastLog = logs[logs.length - 1];
            const timeSinceLastLog = now - lastLog.timestamp;
            const cooldownMs = COOLDOWN_MINUTES * 60 * 1000;

            if (timeSinceLastLog < cooldownMs) {
                const remainingMinutes = Math.ceil((cooldownMs - timeSinceLastLog) / 60000);
                return NextResponse.json(
                    {
                        success: false,
                        error: `Cooldown active. Please wait ${remainingMinutes} more minutes.`,
                        remainingMinutes
                    },
                    { status: 429 }
                );
            }
        }

        // Check daily cap (10 logs per day)
        const todayLogs = logs.filter(log => new Date(log.timestamp).toDateString() === today);
        if (todayLogs.length >= DAILY_CAP) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Daily limit reached. Maximum ${DAILY_CAP} logs per day.`
                },
                { status: 429 }
            );
        }

        // Calculate reward with decay
        const logCountToday = todayLogs.length;
        let baseReward;
        if (logCountToday === 0) {
            baseReward = REWARD_DECAY[0]; // 5 HLT
        } else if (logCountToday === 1) {
            baseReward = REWARD_DECAY[1]; // 3 HLT
        } else {
            baseReward = REWARD_DECAY[2]; // 2 HLT
        }

        // Data completeness bonus: 1.5x for complete data, 0.5x for incomplete
        const isComplete = waterAmount && stepCount && sleepHours;
        const completenessMultiplier = isComplete ? 1.5 : 0.5;
        const finalReward = baseReward * completenessMultiplier;

        // Convert to wei (18 decimals)
        const rewardInWei = ethers.parseEther(finalReward.toString());

        // Connect to blockchain and send reward
        const provider = new ethers.JsonRpcProvider(
            process.env.RPC_URL || 'http://127.0.0.1:8545'
        );

        const verifierPrivateKey = process.env.VERIFIER_PRIVATE_KEY;
        if (!verifierPrivateKey) {
            throw new Error('VERIFIER_PRIVATE_KEY not set in environment variables');
        }

        const verifierWallet = new ethers.Wallet(verifierPrivateKey, provider);
        const contractAddress = process.env.CONTRACT_ADDRESS;

        if (!contractAddress) {
            throw new Error('CONTRACT_ADDRESS not set in environment variables');
        }

        const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, verifierWallet);

        // Call rewardUser on the smart contract
        const tx = await contract.rewardUser(userAddress, rewardInWei);
        await tx.wait();

        // Store the log
        logs.push({
            timestamp: now,
            waterAmount: parseFloat(waterAmount),
            stepCount: parseInt(stepCount),
            sleepHours: parseFloat(sleepHours),
            reward: finalReward,
            txHash: tx.hash
        });

        return NextResponse.json({
            success: true,
            message: 'Health activity logged successfully!',
            reward: finalReward,
            txHash: tx.hash,
            logNumber: logCountToday + 1,
            remainingLogsToday: DAILY_CAP - (logCountToday + 1)
        });

    } catch (error) {
        console.error('Error processing log activity:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Internal server error'
            },
            { status: 500 }
        );
    }
}
