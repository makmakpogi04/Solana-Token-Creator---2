const express = require('express');
const { Connection, Keypair, clusterApiUrl } = require('@solana/web3.js');
const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');
const bs58 = require('bs58');
require('dotenv').config();

const app = express();
app.use(express.json());

// Load wallet from env as base58 string
const SECRET_KEY_BASE58 = process.env.SECRET_KEY;
const secretKeyUint8 = bs58.decode(SECRET_KEY_BASE58);
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const wallet = Keypair.fromSecretKey(secretKeyUint8);

app.post('/create-token', async (req, res) => {
  const { name, symbol, decimals, initialSupply } = req.body;

  try {
    // Create new mint
    const mint = await createMint(
      connection,
      wallet,
      wallet.publicKey,
      null,
      decimals
    );

    // Create associated token account for initial supply
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      wallet,
      mint,
      wallet.publicKey
    );

    // Mint initial supply to creator's wallet
    await mintTo(
      connection,
      wallet,
      mint,
      tokenAccount.address,
      wallet.publicKey,
      initialSupply * Math.pow(10, decimals)
    );

    res.json({
      mintAddress: mint.toBase58(),
      tokenAccount: tokenAccount.address.toBase58(),
      name,
      symbol,
      decimals,
      initialSupply
    });
  } catch (err) {
    console.error('Token creation error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Solana Token Creator API is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Solana Token Creator API listening on port ${PORT}`);
});





