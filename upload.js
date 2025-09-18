import { NFTStorage, File } from "nft.storage";
import fs from "fs";
import mime from "mime";
import "dotenv/config";

// Load API key
const client = new NFTStorage({ token: process.env.NFT_STORAGE_KEY });

// Helper function to read image
async function fileFromPath(filePath) {
  const content = await fs.promises.readFile(filePath);
  const type = mime.getType(filePath);
  return new File([content], filePath, { type });
}

async function main() {
  const imagePath = "./assets/mytoken.png"; // replace with your image
  const imageFile = await fileFromPath(imagePath);

  console.log("Uploading to NFT.Storage...");

  const cid = await client.storeBlob(imageFile);
  console.log("✅ Uploaded! CID:", cid);
  console.log("🌐 IPFS Gateway URL:", `https://ipfs.io/ipfs/${cid}`);
}

main();
