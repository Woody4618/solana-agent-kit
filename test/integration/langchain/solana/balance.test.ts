import { expect } from "chai";
import { SolanaAgentKit } from "../../../../src/agent";
import { SolanaBalanceTool } from "../../../../src/langchain/solana/balance";
import * as dotenv from "dotenv";

dotenv.config();

describe("Solana Balance Integration Tests", () => {
  let agent: SolanaAgentKit;
  let balanceTool: SolanaBalanceTool;

  before(() => {
    // Setup agent before all tests
    agent = new SolanaAgentKit(
      process.env.SOLANA_PRIVATE_KEY!, // Use a dedicated test wallet
      process.env.RPC_URL!,
      {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
      },
    );
    balanceTool = new SolanaBalanceTool(agent);
  });

  it("should fetch SOL balance for the agent's wallet", async () => {
    const response = await balanceTool.invoke("");
    const result = JSON.parse(response);
    console.log(result);
    expect(result).to.have.property("status", "success");
    expect(result).to.have.property("balance");
    expect(result.balance).to.be.a("number");
    expect(result).to.have.property("token", "SOL");
  });

  it("should handle invalid wallet addresses", async () => {
    const response = await balanceTool.invoke("invalid_address");
    const result = JSON.parse(response);
    console.log(result);
    expect(result).to.have.property("status", "error");
  });
});
