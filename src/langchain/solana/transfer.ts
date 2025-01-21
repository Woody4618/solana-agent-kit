import { PublicKey } from "@solana/web3.js";
import { Tool } from "langchain/tools";
import { SolanaAgentKit } from "../../agent";

export class SolanaTransferTool extends Tool {
  name = "solana_transfer";
  description = `Transfer tokens or SOL to another address ( also called as wallet address ).

  Input should be a JSON string with:
  - to: string (required) - The recipient's wallet address
  - amount: number (required) - The amount to transfer
  - mint?: string (optional) - The token's mint address. If not provided, transfers SOL`;

  constructor(private solanaKit: SolanaAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input);

      // Validate amount is positive
      if (parsedInput.amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }

      const recipient = new PublicKey(parsedInput.to);
      const mintAddress = parsedInput.mint
        ? new PublicKey(parsedInput.mint)
        : undefined;

      const tx = await this.solanaKit.transfer(
        recipient,
        parsedInput.amount,
        mintAddress,
      );

      return JSON.stringify({
        status: "success",
        message: "Transfer completed successfully",
        amount: parsedInput.amount,
        recipient: parsedInput.to,
        token: parsedInput.mint || "SOL",
        transaction: tx,
      });
    } catch (error: any) {
      return JSON.stringify({
        status: "error",
        message: error.message,
        code: error.code || "UNKNOWN_ERROR",
      });
    }
  }
}
