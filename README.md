# 🏥 HealthToken System - Token Incentive for Healthy Behavior Logging

A full-stack blockchain MVP that rewards users with ERC-20 tokens (HLT) for logging complete health data.

## 🎯 Project Overview

This university capstone project demonstrates a token incentive system where users earn HealthTokens (HLT) by consistently logging their daily health activities. The system implements gamification through reward decay, cooldown periods, and completeness bonuses to encourage high-quality data submission.

### Key Features

- **ERC-20 Token**: HealthToken (HLT) with verifier-only minting
- **Smart Reward System**: Decay mechanism (5→3→2 HLT) with completeness bonus (1.5x)
- **Business Rules**: 120-minute cooldown, 10 logs/day cap
- **MetaMask Integration**: Seamless wallet connection
- **Premium UI**: Modern glassmorphism design with animations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Blockchain**: Hardhat, Solidity ^0.8.0, Ethers.js v6
- **Smart Contract**: OpenZeppelin ERC-20
- **Storage**: In-memory (MVP)

## 📁 Project Structure

```
HealthTokenSystemFinal/
├── app/
│   ├── api/
│   │   ├── log-activity/
│   │   │   └── route.js          # Health logging API endpoint
│   │   └── balance/
│   │       └── route.js          # Token balance API endpoint
│   ├── page.js                   # Main frontend UI
│   ├── layout.js                 # Root layout
│   └── globals.css               # Global styles
├── contracts/
│   └── HealthToken.sol           # ERC-20 smart contract
├── scripts/
│   └── deploy.js                 # Deployment script
├── hardhat.config.js             # Hardhat configuration
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── package.json                  # Dependencies
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension

### Installation

1. **Clone and install dependencies**:
   ```bash
   cd HealthTokenSystemFinal
   npm install
   ```

2. **Start Hardhat local blockchain** (Terminal 1):
   ```bash
   npm run hardhat:node
   ```
   
   📝 **Important**: Copy one of the private keys from the output. You'll need it for the verifier wallet.

3. **Deploy the smart contract** (Terminal 2):
   ```bash
   # First, create .env.local file
   cp .env.local.example .env.local
   
   # Edit .env.local and add:
   # - VERIFIER_PRIVATE_KEY=<private_key_from_hardhat_node>
   # - RPC_URL=http://127.0.0.1:8545
   
   # Then deploy
   npm run hardhat:deploy
   ```
   
   📝 Copy the contract address from the output and add it to `.env.local`:
   ```
   CONTRACT_ADDRESS=<deployed_contract_address>
   ```

4. **Start the Next.js development server** (Terminal 3):
   ```bash
   npm run dev
   ```

5. **Configure MetaMask**:
   - Add Hardhat Network:
     - Network Name: `Hardhat Local`
     - RPC URL: `http://127.0.0.1:8545`
     - Chain ID: `31337`
     - Currency Symbol: `ETH`
   - Import one of the test accounts using a private key from Hardhat node output

6. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 💡 How to Use

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Fill Health Data**:
   - Water Intake (liters)
   - Step Count
   - Sleep Duration (hours)
3. **Submit**: Click "Submit Daily Log"
4. **Earn Tokens**: Receive HLT tokens based on:
   - 1st log: 7.5 HLT (5 × 1.5 completeness bonus)
   - 2nd log: 4.5 HLT (3 × 1.5)
   - 3rd+ log: 3 HLT (2 × 1.5)

## 🎮 Business Logic

### Reward Calculation

```javascript
Base Rewards (with decay):
- 1st log of the day: 5 HLT
- 2nd log: 3 HLT
- 3rd+ log: 2 HLT

Completeness Multiplier:
- All 3 fields filled: 1.5x bonus
- Missing fields: 0.5x penalty

Final Reward = Base Reward × Completeness Multiplier
```

### Rules

- **Cooldown**: 120 minutes between submissions
- **Daily Cap**: Maximum 10 logs per day
- **Data Completeness**: All 3 fields required for full bonus

## 🔐 Smart Contract

### HealthToken.sol

```solidity
contract HealthToken is ERC20, Ownable {
    address public verifier;
    
    function rewardUser(address user, uint256 amount) external onlyVerifier {
        _mint(user, amount);
    }
}
```

- **Token Name**: HealthToken
- **Symbol**: HLT
- **Decimals**: 18
- **Verifier**: Backend wallet address (set in constructor)

## 🧪 Testing

### Manual Testing Flow

1. Start Hardhat node, deploy contract, start Next.js server
2. Connect MetaMask to local network
3. Submit first log → Should receive 7.5 HLT
4. Try immediate resubmission → Should fail (cooldown)
5. Wait 120 minutes or adjust system time → Submit again → Should receive 4.5 HLT
6. Check balance → Should show cumulative tokens

### API Endpoints

- `POST /api/log-activity`: Log health activity
  ```json
  {
    "userAddress": "0x...",
    "waterAmount": 2.5,
    "stepCount": 10000,
    "sleepHours": 8
  }
  ```

- `GET /api/balance?address=0x...`: Get token balance

## 📝 Environment Variables

Create `.env.local` with:

```env
RPC_URL=http://127.0.0.1:8545
VERIFIER_PRIVATE_KEY=<hardhat_test_account_private_key>
CONTRACT_ADDRESS=<deployed_contract_address>
```

## 🎨 Design Features

- **Glassmorphism**: Frosted glass effect with backdrop blur
- **Gradient Animations**: Animated blob backgrounds
- **Responsive Design**: Mobile-friendly interface
- **Dark Mode**: Premium dark theme with vibrant accents
- **Smooth Transitions**: Micro-animations for better UX

## 🔧 Available Scripts

```bash
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server
npm run hardhat:node     # Start local blockchain
npm run hardhat:compile  # Compile smart contracts
npm run hardhat:deploy   # Deploy to localhost network
```

## 👥 Team Roles

- **Hakan**: Smart Contract Development (Solidity, Hardhat)
- **Ceyda**: Backend API & Frontend (Next.js, React, Ethers.js)

## 📚 Learning Outcomes

This project demonstrates:
- Full-stack blockchain development
- ERC-20 token implementation
- Web3 integration with Ethers.js
- Next.js API routes as backend
- Gamification in health tech
- Modern UI/UX design patterns

## ⚠️ Important Notes

- This is an MVP for educational purposes
- Uses in-memory storage (not production-ready)
- Local blockchain only (not deployed to mainnet/testnet)
- Private keys in `.env.local` for development only

## 🚀 Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- User authentication
- Historical data visualization
- Leaderboard system
- Mobile app (React Native)
- Mainnet deployment

## 📄 License

MIT License - University Capstone Project

---

**Built with ❤️ for promoting healthy behaviors through blockchain incentives**
