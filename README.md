
<h1 align="center">Candymachine Client SDK</h1>
<p align="center">A full-featured Solana Metaplex Candymachine client-side library in Typescript</p>

> **Disclaimer:** The SDK is currently a pre-alpha version and under devlopment

### About

The Candymachine Client SDK offers all functionalities of the former Metaplex Candy Machine CLI but on a standalone pure Typescript client-side library that can run on any browser.

### Features

- Create a Candy Machine V2 with multiple and configurable settings:
  - Captcha enabled/disabled.
  - Mutability on the NFTs.
  - Price, number of NFTs.
  - Authority.
  - NFTs hosted on Arweave.
  - Time and date to start the minting.
- Update any Candy Machine V2 in which you are the authority and have the cache file.
- Explore any Candy Machine V2, view the minted NFTs, remaining NFTs to mint...
- Mint a NFT from the Candy Machine V2.
- Available on Solana's Mainnet and Devnet networks.
- Fully compatible with React and NextJS.

### Built with

- Typescript
- Metaplex
- Anchor from Serum
- Solana web3.js

<br/>

## Installation

```
$ npm i @boxfish-studio/candymachine-client-sdk
$ yarn add @boxfish-studio/candymachine-client-sdk
$ pnpm add @boxfish-studio/candymachine-client-sdk
```

<br/>

## How to use

### Upload your first Candy Machine

1. Import `uploadV2, loadCandyProgramV2, StorageType, verifyAssets` functions and enums:

```ts
import { uploadV2, loadCandyProgramV2, StorageType, verifyAssets } from '@boxfish-studio/candymachine-client-sdk'

async function createCandyMachineV2() {
        let candyMachine: string = ''
        const config: ICandyMachineConfig = {
            price: 1,
            number: 200,
            gatekeeper: null,
            solTreasuryAccount: ******************, // where the NFTs initial sale SOL will go to
            splTokenAccount: null,
            splToken: null,
            goLiveDate: "21 Jul 2023 16:00:00 GMT",
            endSettings: null,
            whitelistMintSettings: null,
            hiddenSettings: null,
            storage: StorageType.Arweave,
            ipfsInfuraProjectId: null,
            ipfsInfuraSecret: null,
            nftStorageKey: null,
            awsS3Bucket: null,
            noRetainAuthority: false,
            noMutable: false,
            arweaveJwk: null,
            batchSize: null,
            pinataGateway: null,
            pinataJwt: null,
            uuid: null,
        }
        // files being all the assets uploaded to the page: [0.json, 0.png, 1.json, 1.png....]
        const { supportedFiles, elemCount } = verifyAssets(files, config.storage, config.number)

        const provider = new AnchorProvider(connection, anchorWallet, {
            preflightCommitment: 'recent',
        })

        const anchorProgram = await loadCandyProgramV2(provider)

        const {
            storage,
            nftStorageKey,
            ipfsInfuraProjectId,
            number,
            ipfsInfuraSecret,
            pinataJwt,
            pinataGateway,
            arweaveJwk,
            awsS3Bucket,
            retainAuthority,
            mutable,
            batchSize,
            price,
            splToken,
            treasuryWallet,
            gatekeeper,
            endSettings,
            hiddenSettings,
            whitelistMintSettings,
            goLiveDate,
            uuid,
        } = await getCandyMachineV2Config(publicKey, config, anchorProgram)

        try {
            const _candyMachine = await uploadV2({
                files: supportedFiles,
                cacheName: 'example',
                env: "devnet",
                totalNFTs: elemCount,
                gatekeeper,
                storage,
                retainAuthority,
                mutable,
                batchSize,
                price,
                treasuryWallet,
                anchorProgram,
                walletKeyPair: anchorWallet, // from react solana wallet package
                endSettings,
                hiddenSettings,
                whitelistMintSettings,
                goLiveDate,
                rateLimit: null,
            })

            if (typeof _candyMachine === 'string') candyMachine = _candyMachine
            console.log("Candy machine v2 successfully created!")
        } catch (err) {
            console.error("Error during candy machine v2 upload.")
        }

    }

```

## Acknowledgements

This SDK has been built thanks to Metaplex's Candy Machine CLI.

## License

[Apache 2.0](./LICENSE) &copy; [Boxfish Studio]

[Boxfish Studio]: https://boxfish.studio

