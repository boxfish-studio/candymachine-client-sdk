import { web3 } from "@project-serum/anchor";
import {
  CANDY_MACHINE_PROGRAM_V2_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_METADATA_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "../constants";

/**
 * Get the associated token account from a mint and the owner.
 *
 * @param mint The mint to get the associated token account of.
 * @param buyer The owner of the associated token account.
 * @returns The associated token account
 */
export const getAtaForMint = async (
  mint: web3.PublicKey,
  buyer: web3.PublicKey
): Promise<[web3.PublicKey, number]> => {
  return await web3.PublicKey.findProgramAddress(
    [buyer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  );
};

/**
 * Get the mint metadata.
 *
 * @param mint The mint to get the metadata of.
 * @returns The mint metadata.
 * */

export const getMetadata = async (
  mint: web3.PublicKey
): Promise<web3.PublicKey> => {
  return (
    await web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};

/**
 * Get the mint edition.
 * @param mint The mint to get the edition of.
 * @returns The mint edition.
 * 
 **/
export const getMasterEdition = async (
  mint: web3.PublicKey
): Promise<web3.PublicKey> => {
  return (
    await web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];
};
/**
 * Get the creator of a candy machine.
 * @param candyMachine The candy machine to get the mint of.
 * @returns The creator of the Candy Machine.
 */
export const getCandyMachineCreator = async (
  candyMachine: web3.PublicKey
): Promise<[web3.PublicKey, number]> => {
  return await web3.PublicKey.findProgramAddress(
    [Buffer.from("candy_machine"), candyMachine.toBuffer()],
    CANDY_MACHINE_PROGRAM_V2_ID
  );
};
