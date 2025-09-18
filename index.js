require("dotenv").config();
const solanaWeb3 = require("@solana/web3.js");

let keypair;

if (process.env.PRIVATE_KEY) {
  // Use PRIVATE_KEY from .env
  const secretKey = Uint8Array.from(JSON.parse(process.env.PRIVATE_KEY));
  keypair = solanaWeb3.Keypair.fromSecretKey(secretKey);
  console.log("🔑 Loaded wallet from .env");
} else {
  // Generate new wallet if no PRIVATE_KEY found
  keypair = solanaWeb3.Keypair.generate();
  console.log("✨ Generated new wallet");
  console.log("Public Key:", keypair.publicKey.toBase58());
  console.log("Secret Key (save this to .env):", JSON.stringify(Array.from(keypair.secretKey)));
}

async function main() {
  // Connect to Solana Devnet
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl("devnet"),
    "confirmed"
  );

  console.log("✅ Connected to Solana Devnet");

  // Airdrop 1 SOL to the wallet
  const airdropSignature = await connection.requestAirdrop(
    keypair.publicKey,
    solanaWeb3.LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(airdropSignature, "confirmed");
  console.log("💸 Airdrop of 1 SOL complete!");

  // Get balance
  const balance = await connection.getBalance(keypair.publicKey);
  console.log("Wallet Balance:", balance / solanaWeb3.LAMPORTS_PER_SOL, "SOL");
}

main();





