import * as anchor from '@project-serum/anchor'
import { AnchorWallet } from '@solana/wallet-adapter-react'
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import {
    CANDY_MACHINE_PROGRAM_V2_ID,
    CONFIG_ARRAY_START_V2,
    CONFIG_LINE_SIZE_V2,
} from '../constants'
import { ICandyMachineData } from '../interfaces'
/**
 * Parse a date.
 * @param date The date to parse.
 * @returns  The parsed date.
 */
export function parseDate(date: string) {
    if (date === 'now') {
        return Date.now() / 1000
    }
    return Date.parse(date) / 1000
}
export function sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
}


export function uuidFromConfigPubkey(configAccount: PublicKey) {
    return configAccount.toBase58().slice(0, 6)
}
/** 
 * Create a candy machine v2.
 * @param anchorProgram The anchor program to use.
 * @param payerWallet  The payer wallet to use.
 * @param treasuryWallet  The treasury wallet to use.
 * @param candyData  The candy machine data to use.
 * @returns  The config account.
 */
export const createCandyMachineV2 = async function (
    anchorProgram: anchor.Program,
    payerWallet: AnchorWallet,
    treasuryWallet: PublicKey,
    // splToken: PublicKey,
    candyData: ICandyMachineData
) {
    const candyAccount = Keypair.generate()
    candyData.uuid = uuidFromConfigPubkey(candyAccount.publicKey)

    if (!candyData.symbol) {
        throw new Error(`Invalid config, there must be a symbol.`)
    }

    if (!candyData.creators || candyData.creators.length === 0) {
        throw new Error(`Invalid config, there must be at least one creator.`)
    }

    const totalShare = (candyData.creators || []).reduce((acc, curr) => acc + curr.share, 0)

    if (totalShare !== 100) {
        throw new Error(`Invalid config, creators shares must add up to 100`)
    }

    let remainingAccounts: any[] = []
    // if (splToken) {
    //   remainingAccounts.push({
    //     pubkey: splToken,
    //     isSigner: false,
    //     isWritable: false,
    //   });
    // }
    const cmCreation = {
        candyMachine: candyAccount.publicKey,
        uuid: candyData.uuid,
        txId: await anchorProgram.methods
            .initializeCandyMachine(candyData)
            .accounts({
                candyMachine: candyAccount.publicKey,
                wallet: treasuryWallet,
                authority: payerWallet.publicKey,
                payer: payerWallet.publicKey,
                systemProgram: SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            })
            // MAYBE NEED TO ADD PAYER WALLET
            .signers([candyAccount])
            .remainingAccounts(remainingAccounts)
            .preInstructions([
                await createCandyMachineV2Account(
                    anchorProgram,
                    candyData,
                    payerWallet.publicKey,
                    candyAccount.publicKey
                ),
            ])
            .rpc(),
    }
    console.log('cmCreation', cmCreation)
    return cmCreation
}

/**
 *  Creates a candy machine v2 account.
 * @param anchorProgram The anchor program to use. 
 * @param candyData    The candy machine data to use.
 * @param payerWallet  The payer wallet to use.
 * @param candyAccount  The candy machine account to use.
 * @returns  The instruction to create the candy machine account.
 */
export async function createCandyMachineV2Account(
    anchorProgram: anchor.Program,
    candyData: ICandyMachineData,
    payerWallet: PublicKey,
    candyAccount: PublicKey
) {
    console.log('creating v2 account')
    const size =
        CONFIG_ARRAY_START_V2 +
        4 +
        candyData.itemsAvailable.toNumber() * CONFIG_LINE_SIZE_V2 +
        8 +
        2 * (Math.floor(candyData.itemsAvailable.toNumber() / 8) + 1)

    const candyMachineAccount = anchor.web3.SystemProgram.createAccount({
        fromPubkey: payerWallet,
        newAccountPubkey: candyAccount,
        space: size,
        lamports: await anchorProgram.provider.connection.getMinimumBalanceForRentExemption(size),
        programId: CANDY_MACHINE_PROGRAM_V2_ID,
    })
    console.log('account created', candyMachineAccount)
    return candyMachineAccount
}

export const getUnixTs = () => {
    return new Date().getTime() / 1000
}

export const getFileName = (fileName: string) => {
    return fileName.split('.')[0]
}

export const getFileExtension = (fileName: string) => {
    return fileName.split('.')[1]
}
