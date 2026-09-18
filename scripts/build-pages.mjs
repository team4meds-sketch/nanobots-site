import {build} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {writeFile} from 'node:fs/promises';
const root=fileURLToPath(new URL('../',import.meta.url));
await build({configFile:false,root:resolve(root,'pages'),base:'./',publicDir:resolve(root,'public'),plugins:[{name:'pages-portability',enforce:'pre',transform(code,id){if(!/\/(app\/home-client|lib\/content)\.tsx?$/.test(id))return;return code.replaceAll('"/art/','"./art/').replaceAll('`/art/','`./art/').replace('<a href="/admin">Редакция сайта</a>','<span>Анимационный образовательный проект</span>');}},react()],resolve:{alias:{'@':root}},define:{'process.env.NODE_ENV':JSON.stringify('production')},build:{outDir:resolve(root,'docs'),emptyOutDir:true}});
await writeFile(resolve(root,'docs/.nojekyll'),'');
