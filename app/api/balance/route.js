import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

const CONTRACT_ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)"
];

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userAddress = searchParams.get('address');

        if (!userAddress) {
            return NextResponse.json(
                { success: false, error: 'Address parameter is required' },
                { status: 400 }
            );
        }

        if (!ethers.isAddress(userAddress)) {
            return NextResponse.json(
                { success: false, error: 'Invalid Ethereum address' },
                { status: 400 }
            );
        }

        const provider = new ethers.JsonRpcProvider(
            process.env.RPC_URL || 'http://127.0.0.1:8545'
        );

        const contractAddress = process.env.CONTRACT_ADDRESS;
        if (!contractAddress) {
            throw new Error('CONTRACT_ADDRESS not set in environment variables');
        }

        const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);

        const balance = await contract.balanceOf(userAddress);
        const balanceInTokens = ethers.formatEther(balance);

        return NextResponse.json({
            success: true,
            address: userAddress,
            balance: balanceInTokens,
            balanceWei: balance.toString()
        });

    } catch (error) {
        console.error('Error fetching balance:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to fetch balance'
            },
            { status: 500 }
        );
    }
}
