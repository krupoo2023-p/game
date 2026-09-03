import {build} from 'esbuild';
import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('public',{recursive:true});
await build({entryPoints:['client/online.js'],bundle:true,platform:'browser',format:'esm',target:'es2022',outfile:'public/online.js',minify:true});
await copyFile('client/game.html','public/index.html');await copyFile('client/online.css','public/online.css');
await cp('client/assets','public/assets',{recursive:true});
console.log('Built online game.');
