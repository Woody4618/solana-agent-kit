import { expect } from "chai";
import { SolanaAgentKit } from "../../../../src/agent";
import { SolanaTransferTool } from "../../../../src/langchain/solana/transfer";
import * as dotenv from "dotenv";

dotenv.config();

describe("Solana Transfer Integration Tests", () => {
  let agent: SolanaAgentKit;
  let transferTool: SolanaTransferTool;
  const testRecipient = "aidMwPNzY1XJvtQFk6JqvHREPydKAe47mm7CjDSAPx2"; // Example recipient

  before(() => {
    agent = new SolanaAgentKit(
      process.env.SOLANA_PRIVATE_KEY!, // Use a dedicated test wallet
      process.env.RPC_URL!,
      {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
      },
    );
    transferTool = new SolanaTransferTool(agent);
  });

  it("should validate transfer parameters", async () => {
    const response = await transferTool.invoke(
      JSON.stringify({
        to: testRecipient,
        amount: 0.0001,
        mint: null, // Optional, null for SOL transfer
      }),
    );
    const result = JSON.parse(response);
    console.log(result);
    expect(result).to.have.property("status", "success");
    expect(result).to.have.property("transaction").that.is.a("string");
  });

  it("should handle invalid recipient address", async () => {
    const response = await transferTool.invoke(
      JSON.stringify({
        to: "invalid_address",
        amount: 0.0001,
      }),
    );
    const result = JSON.parse(response);
    console.log(result);
    expect(result).to.have.property("status", "error");
  });
});
