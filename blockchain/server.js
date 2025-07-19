const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers'); // ABI from Hardhat artifacts
const KYCArtifact = require('./artifacts/contracts/KYCRegistry.sol/KYCRegistry.json');
const KYCABI = KYCArtifact.abi;


const app = express();
app.use(bodyParser.json());

const cors = require('cors');
// Allow requests from your frontend origin:
app.use(cors({ origin: 'http://localhost:8080' }));  // or whatever port your React app runs on


const PORT = 7000;

// Hardhat local node URL (default)
const PROVIDER_URL = 'http://localhost:8545';
const provider = new ethers.JsonRpcProvider(PROVIDER_URL);

// Replace with your local unlocked Hardhat private key (admin or staff wallet that will do the tx)
const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const CONTRACT_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'; // from Hardhat deployment
const contract = new ethers.Contract(CONTRACT_ADDRESS, KYCABI, wallet);

app.post('/kyctochain', async (req, res) => {
    try {
        const { kycIdName, kycHash, timestamp } = req.body;
        if (!kycIdName || !kycHash || !timestamp) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Make sure kycHash is bytes32
        let hashBytes32 = kycHash;
        if (!kycHash.startsWith("0x")) {
            hashBytes32 = ethers.keccak256(ethers.toUtf8Bytes(kycHash)); // fallback: hash the input
        }

        const tx = await contract.storeKYC(kycIdName, hashBytes32, Number(timestamp));
        await tx.wait();

        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`KYC Chain API listening at http://localhost:${PORT}`);
});
