import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {cp, mkdir, writeFile} from 'node:fs/promises';
const root=fileURLToPath(new URL('../',import.meta.url));
const output=resolve(root,'docs');
await mkdir(output,{recursive:true});
// Keep existing routes and their resources. The approved homepage is static,
// with no framework runtime or network dependency required to render it.
await cp(resolve(root,'public'),output,{recursive:true});
await cp(resolve(root,'pages/homepage'),output,{recursive:true});
await writeFile(resolve(output,'.nojekyll'),'');
console.log('GitHub Pages built in docs/: homepage, mediakit, and existing routes.');
