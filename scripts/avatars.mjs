// Legge le immagini in public/avatars e scrive l'elenco in lib/avatars.json (parte da solo con npm run dev / build)
import {readdirSync,writeFileSync,existsSync,mkdirSync} from 'fs';
const dir='public/avatars';
if(!existsSync(dir))mkdirSync(dir,{recursive:true});
const list=readdirSync(dir).filter(f=>/\.(png|jpe?g|webp|gif|svg)$/i.test(f)).sort().map(f=>'/avatars/'+encodeURIComponent(f));
writeFileSync('lib/avatars.json',JSON.stringify(list,null,1)+'\n');
console.log(`Avatar trovati: ${list.length}`);
