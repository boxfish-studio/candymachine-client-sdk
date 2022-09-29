import { Program } from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { ICache, saveCache } from './cache'

/**
 *
 * Update a given candy machine with the new settings passed and cache.
 * At the end of the update, the updated cache can be downloaded.
 * @newSettings The new settings to update the candy machine with.
 * @candyMachinePubkey The public key of the candy machine to update.
 * @publicKey The public key of the authority of the candy machine
 * @treasuryWallet The public key of the treasury wallet
 * @anchorProgram The program that is used to update the candy machine.
 * @cache The cache to update the candy machine with.
 * @newAuthority (Optional) The new authority of the candy machine.
 */

export async function updateV2({
	newSettings,
	candyMachinePubkey,
	publicKey,
	treasuryWallet,
	anchorProgram,
	cache,
	newAuthority,
}: {
	newSettings: any
	candyMachinePubkey: string | string[]
	publicKey: PublicKey
	treasuryWallet: PublicKey
	anchorProgram: Program
	cache: string
	newAuthority: string
}) {
	try {
		const cacheContent: ICache = JSON.parse(cache)
		const env = cacheContent.env
		const cacheName = cacheContent.cacheName

		const tx = await anchorProgram.methods
			.updateCandyMachine(newSettings)
			.accounts({
				candyMachine: new PublicKey(candyMachinePubkey),
				authority: publicKey,
				wallet: treasuryWallet,
			})
			.signers([])
			.rpc()

		cacheContent.startDate = newSettings.goLiveDate

		console.log('update_candy_machine finished', tx)

		if (newAuthority) {
			const tx = await anchorProgram.methods
				.updateAuthority(new PublicKey(newAuthority))
				.accounts({
					candyMachine: new PublicKey(candyMachinePubkey),
					authority: publicKey,
					wallet: treasuryWallet,
				})
				.rpc()

			cacheContent.authority = new PublicKey(newAuthority).toBase58()
			console.log(` - updated authority: ${cacheContent.authority}`)
			console.log('update_authority finished', tx)
		}

		saveCache(cacheName, env, cacheContent)
	} catch (err) {
		console.error(err)
		throw new Error()
	}
}
