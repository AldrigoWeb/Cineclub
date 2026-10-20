import {db} from '../../../lib/db';import {t} from '../../../lib/tmdb';import {getMe} from '../../../lib/me';
export async function POST(req){
 const {id,status,added_by}=await req.json();
 // correzione a posteriori di "aggiunto da" (vuoto = nessuno, altrimenti deve essere un profilo esistente)
 if(added_by!==undefined&&!status){
  const nome=String(added_by||'').trim();let val=null;
  if(nome){const {data:ps}=await db.from('profiles').select('name');
   val=(ps||[]).find(p=>p.name.trim().toLowerCase()===nome.toLowerCase())?.name;
   if(!val)return Response.json({ok:0},{status:400})}
  const {error}=await db.from('library').update({added_by:val}).eq('tmdb_id',id);
  return Response.json({ok:!error},{status:error?500:200});
 }
 if(status==='none'){await db.from('library').delete().eq('tmdb_id',id);return Response.json({ok:1})}
 const m=await t(`/movie/${id}`,{append_to_response:'credits'});
 const row={tmdb_id:id,title:m.title,year:+(m.release_date||'').slice(0,4)||null,poster:m.poster_path,backdrop:m.backdrop_path,overview:m.overview,
  genres:(m.genres||[]).map(g=>g.name),director:m.credits?.crew?.find(c=>c.job==='Director')?.name||'',status};
 // chi aggiunge viene registrato solo al primo inserimento: cambiare stato (lista/visto) non lo sovrascrive
 const {data:ex}=await db.from('library').select('tmdb_id').eq('tmdb_id',id).maybeSingle();
 if(!ex){const me=await getMe();if(me)row.added_by=me.name}
 let {error}=await db.from('library').upsert(row);
 // se la colonna added_by non esiste ancora su Supabase, salvo il film senza
 if(error&&row.added_by!==undefined){delete row.added_by;({error}=await db.from('library').upsert(row))}
 return Response.json({ok:!error},{status:error?500:200});
}
