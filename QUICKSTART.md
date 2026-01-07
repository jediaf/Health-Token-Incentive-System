# 🚀 Quick Start Guide - HealthToken System

## Current Status
✅ Hardhat node is **RUNNING** in the background
✅ All code files created and ready
✅ Smart contract compiled successfully

## Next Steps to Run the Application

### Step 1: Deploy the Smart Contract

Open a **NEW terminal** and run:

```bash
cd /Users/ceydaarik/Desktop/HealthTokenSystemFinal

# Create environment file
cp .env.local.example .env.local

# Deploy the contract
npm run hardhat:deploy
```

**Expected Output:**
```
🚀 Deploying HealthToken contract...
Deploying with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Verifier address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

✅ HealthToken deployed successfully!
📍 Contract address: 0x5FbDB2315678afecb367f032d93F642f64180aa3

📝 Add this to your .env.local file:
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Step 2: Update .env.local

Edit `.env.local` and add the contract address from the output above:

```env
RPC_URL=http://127.0.0.1:8545
VERIFIER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### Step 3: Start Next.js Server

In the same terminal:

```bash
npm run dev
```

Open your browser to: **http://localhost:3000**

### Step 4: Configure MetaMask

1. **Add Hardhat Network** in MetaMask:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`

2. **Import Test Account**:
   - Click "Import Account"
   - Paste this private key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - This account has 10,000 ETH for testing

### Step 5: Test the Application

1. Click "Connect Wallet" on the app
2. Fill in health data:
   - Water: `2.5` liters
   - Steps: `10000`
   - Sleep: `8` hours
3. Click "Submit Daily Log"
4. Approve the MetaMask transaction
5. You should receive **7.5 HLT tokens**!

## Troubleshooting

**If deployment fails:**
- Make sure Hardhat node is still running
- Check that `.env.local` exists with the correct private key

**If MetaMask shows wrong balance:**
- Reset account in MetaMask settings
- Make sure you're on the Hardhat Local network

**If transaction fails:**
- Check that CONTRACT_ADDRESS in `.env.local` matches deployed address
- Verify you're using the correct network in MetaMask

## Project Structure

```
HealthTokenSystemFinal/
├── contracts/HealthToken.sol       # Smart contract
├── scripts/deploy.js               # Deployment script
├── app/
│   ├── api/
│   │   ├── log-activity/route.js  # Backend API
│   │   └── balance/route.js       # Balance checker
│   ├── page.js                    # Frontend UI
│   └── globals.css                # Styles
└── .env.local                     # Configuration
```

## Team Responsibilities

- **Hakan**: Smart Contract (HealthToken.sol, deploy.js)
- **Ceyda**: Backend API (log-activity, balance) + Frontend (page.js)

---

**Ready to demo! 🎉**
