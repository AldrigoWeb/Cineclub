import {t} from './tmdb';
// durata (minuti) dei film da TMDB; le risposte restano in cache 24h
export async function runtimes(films){
 const r=await Promise.all(films.map(f=>t(`/movie/${f.tmdb_id}`).then(m=>m.runtime||0).catch(()=>0)));
 return Object.fromEntries(films.map((f,i)=>[f.tmdb_id,r[i]]));
}
export const sum=o=>Object.values(o).reduce((a,b)=>a+b,0);
