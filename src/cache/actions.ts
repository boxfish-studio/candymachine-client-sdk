/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import fileDownloader from 'js-file-download'
import { ICache } from './interfaces'

// export function cachePath(
//   env: string,
//   cacheName: string,
//   cPath: string = CACHE_PATH,
//   legacy: boolean = false,
// ) {
//   const filename = `${env}-${cacheName}`;
//   return path.join(cPath, legacy ? filename : `${filename}.json`);
// }

// export function loadCache(
//   cacheName: string,
//   env: string,
//   cPath: string = CACHE_PATH,
//   legacy: boolean = false,
// ) {
//   const path = cachePath(env, cacheName, cPath, legacy);

//   if (!fs.existsSync(path)) {
//     if (!legacy) {
//       return loadCache(cacheName, env, cPath, true);
//     }
//     return undefined;
//   }

//   return JSON.parse(fs.readFileSync(path).toString());
// }

/**
 * Save the cache to the cache path.
 * @param cacheName The name of the cache to save.
 * @param env The environment used 'mainnet-beta' | 'devnet' | 'testnet'
 * @param cacheContent The content of the cache to save.
 */

export function saveCache(cacheName: string, env: string, cacheContent: ICache) {
    cacheContent.env = env
    cacheContent.cacheName = cacheName
    fileDownloader(JSON.stringify(cacheContent), cacheName)
}
