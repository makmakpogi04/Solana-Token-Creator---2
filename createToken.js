require("dotenv").config();
const {
  Connection,
  Keypair,
} = require("@solana/web3.js");
const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  setAuthority,
  AuthorityType,
} = require("@solana/spl-token");
const bs58 = require("bs58");

(async () => {
  try {
    // 1. Setup connection (Devnet for testing)
    const connection = new Connection(
      process.env.RPC_URL || "https://api.devnet.solana.com",
      "confirmed"
    );

    // 2. Load wallet from .env (base58 private key string)
    const secret = bs58.decode(process.env.SECRET_KEY);
    const payer = Keypair.fromSecretKey(secret);

    console.log("✅ Wallet loaded:", payer.publicKey.toBase58());

    // 3. Create new token
    const mint = await createMint(
      connection,
      payer,
      payer.publicKey, // mint authority
      null,            // freeze authority disabled
      9                // decimals
    );
    console.log("✅ Token created:", mint.toBase58());

    // 4. Create token account for the wallet
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      payer.publicKey
    );
    console.log("✅ Token account:", tokenAccount.address.toBase58());

    // 5. Mint tokens into the account
    await mintTo(
      connection,
      payer,
      mint,
      tokenAccount.address,
      payer,          // authority
      1000000000      // amount (1 token if decimals=9)
    );
    console.log("✅ Minted tokens successfully!");

    // 6. Remove mint authority only
    await setAuthority(
      connection,
      payer,
      mint,
      payer.publicKey,
      AuthorityType.MintTokens,
      null
    );
    console.log("✅ Mint authority removed!");

    console.log(
      "🔗 Final token (immutable): https://explorer.solana.com/address/" +
        mint.toBase58() +
        "?cluster=devnet"
    );
  } catch (err) {
    console.error("❌ Error:", err);
  }
})();
